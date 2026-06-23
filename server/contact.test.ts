import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ── Mock the Resend module ───────────────────────────────────────────────────
const mockSendEmail = vi.fn().mockResolvedValue({ id: "test-email-id" });

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: mockSendEmail,
    },
  })),
}));

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
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, RESEND_API_KEY: "test-resend-key" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("sends an email and returns success for valid input", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.contact.submitInquiry({
      name: "Alice",
      email: "alice@example.com",
      message: "I would like to order some tea.",
    });

    expect(result).toEqual({ success: true });
    expect(mockSendEmail).toHaveBeenCalledOnce();
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: expect.arrayContaining(["yinglitea@gmail.com"]),
        subject: expect.stringContaining("Alice"),
      })
    );
  });

  it("still returns success when RESEND_API_KEY is not set", async () => {
    delete process.env.RESEND_API_KEY;

    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.contact.submitInquiry({
      name: "Bob",
      email: "bob@example.com",
      message: "Question about wholesale pricing.",
    });

    expect(result).toEqual({ success: true });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("throws INTERNAL_SERVER_ERROR when email sending fails", async () => {
    mockSendEmail.mockRejectedValueOnce(new Error("Network error"));

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
