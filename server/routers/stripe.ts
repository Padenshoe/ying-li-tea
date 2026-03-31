import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { and, eq, sql } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { orders, products } from "../../drizzle/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

/**
 * Extract the last name from a full name string.
 * Splits on whitespace and returns the last token, normalised to lowercase
 * for case-insensitive comparison.
 */
function extractLastName(fullName: string | null | undefined): string {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1]?.toLowerCase() ?? "";
}

export const stripeRouter = router({
  // ── Create checkout session ────────────────────────────────────────────────
  createCheckout: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number().min(1),
            name: z.string(),
            price: z.number(),
            nameKey: z.string().optional(),
          })
        ),
        origin: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      try {
        const lineItems = input.items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        }));

        // Collect billing address so Stripe captures the customer's full name.
        // This lets us extract the last name for order lookup.
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${input.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${input.origin}/checkout/cancel`,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          billing_address_collection: "required", // captures full name on the card
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
          },
          allow_promotion_codes: true,
        });

        const totalAmount = input.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const customerLastName = extractLastName(ctx.user.name);

        await db.insert(orders).values({
          userId: ctx.user.id,
          stripeCheckoutSessionId: session.id,
          status: "pending",
          totalAmount: totalAmount.toString(),
          currency: "USD",
          items: JSON.stringify(input.items),
          customerEmail: ctx.user.email || undefined,
          customerName: ctx.user.name || undefined,
          customerLastName: customerLastName || undefined,
        });

        return {
          checkoutUrl: session.url || "",
          sessionId: session.id,
        };
      } catch (error) {
        console.error("[Stripe] Checkout creation failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  // ── Get order details (used on checkout success page) ─────────────────────
  getOrder: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      try {
        const order = await db
          .select()
          .from(orders)
          .where(eq(orders.stripeCheckoutSessionId, input.sessionId))
          .limit(1);

        if (!order || order.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
        }

        if (order[0].userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this order",
          });
        }

        return order[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Stripe] Get order failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve order",
        });
      }
    }),

  // ── Public order lookup by order ID + last name ───────────────────────────
  // No login required. Matches case-insensitively on last name.
  lookupOrder: publicProcedure
    .input(
      z.object({
        orderId: z.number().int().positive(),
        lastName: z.string().min(1).max(255),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      try {
        const result = await db
          .select()
          .from(orders)
          .where(eq(orders.id, input.orderId))
          .limit(1);

        if (!result || result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }

        const order = result[0];

        // Case-insensitive last name comparison
        const storedLastName = (order.customerLastName ?? "").toLowerCase().trim();
        const providedLastName = input.lastName.toLowerCase().trim();

        if (!storedLastName || storedLastName !== providedLastName) {
          // Return the same error as "not found" to avoid leaking order existence
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }

        // Return order but omit internal user ID for privacy
        const { userId, ...safeOrder } = order;
        return safeOrder;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Stripe] Order lookup failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to look up order",
        });
      }
    }),

  // ── Verify payment status (used on checkout success page) ─────────────────
  verifyPayment: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);

        if (session.payment_status === "paid") {
          const db = await getDb();
          if (db) {
            // Also update last name from billing details if available
            const billingName = session.customer_details?.name;
            const lastNameFromBilling = extractLastName(billingName);

            await db
              .update(orders)
              .set({
                status: "completed",
                ...(lastNameFromBilling
                  ? { customerLastName: lastNameFromBilling }
                  : {}),
                ...(billingName
                  ? { customerName: billingName }
                  : {}),
              })
              .where(eq(orders.stripeCheckoutSessionId, input.sessionId));
          }
          return { status: "completed", paymentStatus: session.payment_status };
        }

        return { status: session.payment_status };
      } catch (error) {
        console.error("[Stripe] Verify payment failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify payment",
        });
      }
    }),
});
