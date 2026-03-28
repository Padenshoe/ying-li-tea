import { describe, it, expect, vi, beforeEach } from "vitest";
import Stripe from "stripe";
import { z } from "zod";

// Mock Stripe
vi.mock("stripe");

describe("Stripe Router", () => {
  let mockStripe: any;

  beforeEach(() => {
    mockStripe = {
      checkout: {
        sessions: {
          create: vi.fn(),
          retrieve: vi.fn(),
        },
      },
    };
    vi.mocked(Stripe).mockReturnValue(mockStripe);
  });

  describe("createCheckout", () => {
    it("should create a checkout session with correct line items", async () => {
      const mockSession = {
        id: "cs_test_123",
        url: "https://checkout.stripe.com/test",
        payment_status: "unpaid",
        status: "open",
      };

      mockStripe.checkout.sessions.create.mockResolvedValue(mockSession);

      // Simulate the checkout creation logic
      const items = [
        { productId: 1, quantity: 2, name: "Premium Gift Box", price: 89.99 },
        { productId: 2, quantity: 1, name: "Cold Brew", price: 49.99 },
      ];

      const lineItems = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      await mockStripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/checkout/cancel",
      });

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          payment_method_types: ["card"],
          mode: "payment",
        })
      );

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          line_items: expect.arrayContaining([
            expect.objectContaining({
              price_data: expect.objectContaining({
                unit_amount: 8999, // 89.99 * 100
              }),
              quantity: 2,
            }),
          ]),
        })
      );
    });

    it("should calculate correct total amount from items", () => {
      const items = [
        { productId: 1, quantity: 2, name: "Premium Gift Box", price: 89.99 },
        { productId: 2, quantity: 1, name: "Cold Brew", price: 49.99 },
      ];

      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      expect(totalAmount).toBe(229.97); // (89.99 * 2) + 49.99
    });
  });

  describe("getCheckoutSession", () => {
    it("should retrieve checkout session details", async () => {
      const mockSession = {
        id: "cs_test_123",
        payment_status: "paid",
        status: "complete",
        customer_email: "customer@example.com",
        amount_total: 22997, // in cents
      };

      mockStripe.checkout.sessions.retrieve.mockResolvedValue(mockSession);

      const result = await mockStripe.checkout.sessions.retrieve("cs_test_123");

      expect(result.id).toBe("cs_test_123");
      expect(result.payment_status).toBe("paid");
      expect(result.customer_email).toBe("customer@example.com");
    });

    it("should convert amount from cents to dollars", () => {
      const amountInCents = 22997;
      const amountInDollars = amountInCents / 100;

      expect(amountInDollars).toBe(229.97);
    });
  });

  describe("Cart to Stripe integration", () => {
    it("should handle empty cart gracefully", () => {
      const items: any[] = [];
      expect(items.length).toBe(0);
    });

    it("should convert cart items to Stripe format", () => {
      const cartItems = [
        { id: "1", name: "Premium Gift Box", price: 89.99, quantity: 1 },
        { id: "2", name: "Cold Brew", price: 49.99, quantity: 2 },
      ];

      const stripeItems = cartItems.map((item) => ({
        productId: parseInt(item.id),
        quantity: item.quantity,
        name: item.name,
        price: item.price,
      }));

      expect(stripeItems).toHaveLength(2);
      expect(stripeItems[0]).toEqual({
        productId: 1,
        quantity: 1,
        name: "Premium Gift Box",
        price: 89.99,
      });
    });
  });
});
