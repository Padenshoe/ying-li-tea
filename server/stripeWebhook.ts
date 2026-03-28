/**
 * YING-LI TEA — STRIPE WEBHOOK HANDLER
 * Registered at POST /api/stripe/webhook
 * Must use express.raw() BEFORE express.json() to preserve raw body for signature verification.
 */
import { Request, Response } from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { orders } from "../drizzle/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Webhook] Signature verification failed:", message);
    return res.status(400).json({ error: `Webhook Error: ${message}` });
  }

  // CRITICAL: Return verification response for Stripe test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const sessionId = session.id;
        const paymentStatus = session.payment_status;

        console.log(`[Webhook] Checkout session completed: ${sessionId}, payment: ${paymentStatus}`);

        if (paymentStatus === "paid") {
          const db = await getDb();
          if (db) {
            const result = await db
              .update(orders)
              .set({ status: "completed" })
              .where(eq(orders.stripeCheckoutSessionId, sessionId));
            console.log(`[Webhook] Order updated to completed for session: ${sessionId}`);
          }
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Webhook] Payment intent succeeded: ${paymentIntent.id}`);
        // Order status is handled via checkout.session.completed above
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const sessionId = paymentIntent.metadata?.checkout_session_id;
        console.log(`[Webhook] Payment failed for intent: ${paymentIntent.id}`);

        if (sessionId) {
          const db = await getDb();
          if (db) {
            await db
              .update(orders)
              .set({ status: "failed" })
              .where(eq(orders.stripeCheckoutSessionId, sessionId));
          }
        }
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Webhook] Handler error:", message);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
