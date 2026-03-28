/**
 * Tests for Stripe webhook handler
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

// Mock Stripe
vi.mock("stripe", () => {
  const mockConstructEvent = vi.fn();
  return {
    default: vi.fn().mockImplementation(() => ({
      webhooks: {
        constructEvent: mockConstructEvent,
      },
    })),
    __mockConstructEvent: mockConstructEvent,
  };
});

// Mock DB
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
  }),
}));

// Mock drizzle schema
vi.mock("../drizzle/schema", () => ({
  orders: {},
}));

// Mock drizzle eq
vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

function makeReqRes(overrides: Partial<Request> = {}) {
  const req = {
    headers: { "stripe-signature": "test-sig" },
    body: Buffer.from("{}"),
    ...overrides,
  } as unknown as Request;

  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  const res = { json, status } as unknown as Response;

  return { req, res, json, status };
}

describe("handleStripeWebhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when signature verification fails", async () => {
    const Stripe = (await import("stripe")).default as unknown as { __mockConstructEvent: ReturnType<typeof vi.fn> };
    // @ts-ignore
    const { __mockConstructEvent } = await import("stripe");
    __mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const { handleStripeWebhook } = await import("./stripeWebhook");
    const { req, res, status, json } = makeReqRes();

    await handleStripeWebhook(req, res);

    expect(status).toHaveBeenCalledWith(400);
  });

  it("returns verified:true for test events", async () => {
    const { __mockConstructEvent } = await import("stripe") as any;
    __mockConstructEvent.mockReturnValue({
      id: "evt_test_abc123",
      type: "checkout.session.completed",
      data: { object: {} },
    });

    const { handleStripeWebhook } = await import("./stripeWebhook");
    const { req, res, json } = makeReqRes();

    await handleStripeWebhook(req, res);

    expect(json).toHaveBeenCalledWith({ verified: true });
  });

  it("returns received:true for handled real events", async () => {
    const { __mockConstructEvent } = await import("stripe") as any;
    __mockConstructEvent.mockReturnValue({
      id: "evt_real_abc123",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_session123",
          payment_status: "paid",
        },
      },
    });

    const { handleStripeWebhook } = await import("./stripeWebhook");
    const { req, res, json } = makeReqRes();

    await handleStripeWebhook(req, res);

    expect(json).toHaveBeenCalledWith({ received: true });
  });

  it("returns received:true for unhandled event types", async () => {
    const { __mockConstructEvent } = await import("stripe") as any;
    __mockConstructEvent.mockReturnValue({
      id: "evt_real_xyz",
      type: "customer.created",
      data: { object: {} },
    });

    const { handleStripeWebhook } = await import("./stripeWebhook");
    const { req, res, json } = makeReqRes();

    await handleStripeWebhook(req, res);

    expect(json).toHaveBeenCalledWith({ received: true });
  });
});
