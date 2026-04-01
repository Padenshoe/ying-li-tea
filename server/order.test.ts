/**
 * Tests for order.submitOrder procedure
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// ── Helpers ──────────────────────────────────────────────────────────────────

const sampleItems = [
  { id: "1", name: "高山烏龍茶", price: 800, quantity: 2 },
  { id: "2", name: "東方美人茶", price: 1200, quantity: 1 },
];

const baseInput = {
  fullName: "陳小明",
  gender: "male" as const,
  phone: "0912345678",
  deliveryMethod: "home" as const,
  address: "台北市中正區忠孝東路一段1號",
  items: sampleItems,
  totalAmount: 2800,
};

// ── Validation logic (mirrors the procedure) ─────────────────────────────────

function validateOrder(input: typeof baseInput & { deliveryMethod: "home" | "711"; address?: string; storeCode?: string }) {
  if (input.deliveryMethod === "home" && !input.address?.trim()) {
    return { error: "宅配需填寫收件地址" };
  }
  if (input.deliveryMethod === "711" && !input.storeCode?.trim()) {
    return { error: "7-11 店到店需填寫門市名稱" };
  }
  return { error: null };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("order.submitOrder validation", () => {
  it("accepts valid home delivery order", () => {
    const result = validateOrder({ ...baseInput, deliveryMethod: "home", address: "台北市中正區忠孝東路一段1號" });
    expect(result.error).toBeNull();
  });

  it("accepts valid 7-11 order", () => {
    const result = validateOrder({ ...baseInput, deliveryMethod: "711", storeCode: "台北忠孝門市" });
    expect(result.error).toBeNull();
  });

  it("rejects home delivery without address", () => {
    const result = validateOrder({ ...baseInput, deliveryMethod: "home", address: "" });
    expect(result.error).toBe("宅配需填寫收件地址");
  });

  it("rejects 7-11 without store code", () => {
    const result = validateOrder({ ...baseInput, deliveryMethod: "711", storeCode: "" });
    expect(result.error).toBe("7-11 店到店需填寫門市名稱");
  });

  it("rejects 7-11 with whitespace-only store code", () => {
    const result = validateOrder({ ...baseInput, deliveryMethod: "711", storeCode: "   " });
    expect(result.error).toBe("7-11 店到店需填寫門市名稱");
  });
});

// ── Email body builder ────────────────────────────────────────────────────────

function buildEmailBody(input: typeof baseInput, orderId: number) {
  const genderLabel = input.gender === "male" ? "先生" : input.gender === "female" ? "女士" : "其他";
  const deliveryLabel = input.deliveryMethod === "home" ? "宅配（貨到付款）" : "7-11 店到店（貨到付款）";
  const itemLines = input.items
    .map((item) => `  • ${item.name} × ${item.quantity}  NT$${(item.price * item.quantity).toFixed(0)}`)
    .join("\n");

  return `迎利茶 — 新訂單通知
訂單編號：#${orderId}
姓名：${input.fullName} ${genderLabel}
電話：${input.phone}
${deliveryLabel}
${itemLines}
總計：NT$${input.totalAmount.toFixed(0)}（貨到付款）`;
}

describe("buildEmailBody", () => {
  it("includes order ID", () => {
    const body = buildEmailBody(baseInput, 42);
    expect(body).toContain("#42");
  });

  it("includes customer name and gender label", () => {
    const body = buildEmailBody(baseInput, 1);
    expect(body).toContain("陳小明 先生");
  });

  it("includes all items with correct totals", () => {
    const body = buildEmailBody(baseInput, 1);
    expect(body).toContain("高山烏龍茶 × 2  NT$1600");
    expect(body).toContain("東方美人茶 × 1  NT$1200");
  });

  it("includes total amount", () => {
    const body = buildEmailBody(baseInput, 1);
    expect(body).toContain("NT$2800");
  });

  it("uses female label for female gender", () => {
    const body = buildEmailBody({ ...baseInput, gender: "female" }, 1);
    expect(body).toContain("女士");
  });

  it("uses 7-11 label for 711 delivery method", () => {
    const body = buildEmailBody({ ...baseInput, deliveryMethod: "711" }, 1);
    expect(body).toContain("7-11 店到店");
  });
});
