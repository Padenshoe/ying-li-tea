import { describe, expect, it, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ── Mock the notifyOwner helper ──────────────────────────────────────────────
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import { notifyOwner } from "./_core/notification";

// ── Shared context factory ───────────────────────────────────────────────────
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ── Tests ────────────────────────────────────────────────────────────────────
describe("contact.submitInquiry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends a notification and returns success for valid input", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.contact.submitInquiry({
      name: "Alice",
      email: "alice@example.com",
      message: "I would like to order some tea.",
    });

    expect(result).toEqual({ success: true });
    expect(notifyOwner).toHaveBeenCalledOnce();
    expect(notifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining("Alice"),
        content: expect.stringContaining("alice@example.com"),
      })
    );
  });

  it("still returns success when notifyOwner returns false (service unavailable)", async () => {
    vi.mocked(notifyOwner).mockResolvedValueOnce(false);

    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.contact.submitInquiry({
      name: "Bob",
      email: "bob@example.com",
      message: "Question about wholesale pricing.",
    });

    expect(result).toEqual({ success: true });
  });

  it("throws INTERNAL_SERVER_ERROR when notifyOwner throws", async () => {
    vi.mocked(notifyOwner).mockRejectedValueOnce(new Error("Network error"));

    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.contact.submitInquiry({
        name: "Carol",
        email: "carol@example.com",
        message: "This should fail gracefully.",
      })
    ).rejects.toThrow(TRPCError);
  });

  it("rejects input with an empty name", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.contact.submitInquiry({
        name: "",
        email: "test@example.com",
        message: "Valid message here.",
      })
    ).rejects.toThrow();
  });

  it("rejects input with an invalid email", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.contact.submitInquiry({
        name: "Dave",
        email: "not-an-email",
        message: "Valid message here.",
      })
    ).rejects.toThrow();
  });

  it("rejects a message shorter than 10 characters", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.contact.submitInquiry({
        name: "Eve",
        email: "eve@example.com",
        message: "Short",
      })
    ).rejects.toThrow();
  });
});
