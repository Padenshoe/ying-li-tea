import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { orders, products } from "../../drizzle/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const stripeRouter = router({
  // Create checkout session for cart items
  createCheckout: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number().min(1),
            name: z.string(),
            price: z.number(),
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
        // Prepare line items for Stripe
        const lineItems = input.items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        }));

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${input.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${input.origin}/checkout/cancel`,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
          },
          allow_promotion_codes: true,
        });

        // Create order record in database
        const totalAmount = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await db.insert(orders).values({
          userId: ctx.user.id,
          stripeCheckoutSessionId: session.id,
          status: "pending",
          totalAmount: totalAmount.toString(),
          currency: "USD",
          items: JSON.stringify(input.items),
          customerEmail: ctx.user.email || undefined,
          customerName: ctx.user.name || undefined,
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

  // Get order details
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
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }

        // Verify ownership
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

  // Get user's order history
  getOrderHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database connection failed",
      });
    }

    try {
      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, ctx.user.id));

      return userOrders;
    } catch (error) {
      console.error("[Stripe] Get order history failed:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve order history",
      });
    }
  }),

  // Verify payment status
  verifyPayment: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);

        if (session.payment_status === "paid") {
          const db = await getDb();
          if (db) {
            await db
              .update(orders)
              .set({ status: "completed" })
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
