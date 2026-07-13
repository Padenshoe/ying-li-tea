/**
 * YING-LI TEA — ECPAY ROUTER
 * Handles ECPay credit card payment flow:
 *   1. createPayment  → saves order, returns HTML form to auto-submit to ECPay
 *   2. handleReturn   → server-side callback (ReturnURL), verifies CheckMacValue
 *   3. getOrderStatus → frontend polls order status
 */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createHash } from "crypto";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { ecpayOrders } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { ENV } from "../_core/env";
import { Resend } from "resend";

const ECPAY_PAYMENT_URL = "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5";
const STORE_EMAIL = "yinglitea@yinglitea.com";
const FROM_EMAIL = "迎利茶葉 <info@yinglitea.co>";

// Cart item schema
const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameKey: z.string().optional(),
  price: z.number(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
});

/**
 * ECPay CheckMacValue calculation (SHA256)
 * Steps:
 *   1. Sort params A-Z
 *   2. Join as key=value&key=value
 *   3. Prepend HashKey=xxx& and append &HashIV=xxx
 *   4. URL-encode (RFC 3986 lowercase)
 *   5. Lowercase entire string
 *   6. SHA256 → uppercase hex
 */
function calcCheckMacValue(
  params: Record<string, string>,
  hashKey: string,
  hashIV: string
): string {
  // 1. Sort
  const sorted = Object.keys(params)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  // 2. Prepend/append
  const raw = `HashKey=${hashKey}&${sorted}&HashIV=${hashIV}`;

  // 3. URL encode (using encodeURIComponent then fix per ECPay spec)
  const encoded = encodeURIComponent(raw)
    .replace(/%20/g, "+")
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
    .replace(/%7E/g, "~");

  // 4. Lowercase
  const lower = encoded.toLowerCase();

  // 5. SHA256 → uppercase
  return createHash("sha256").update(lower).digest("hex").toUpperCase();
}

/**
 * Generate unique MerchantTradeNo: max 20 chars, alphanumeric
 * Format: YL + timestamp (ms) trimmed to 18 chars
 */
function genMerchantTradeNo(): string {
  const ts = Date.now().toString(); // 13 digits
  return `YL${ts}`.slice(0, 20);
}

export const ecpayRouter = router({
  /**
   * createPayment
   * Saves order to DB, builds ECPay form params, returns form HTML
   */
  createPayment: publicProcedure
    .input(
      z.object({
        fullName: z.string().min(1).max(255),
        gender: z.enum(["male", "female", "other"]),
        phone: z.string().min(8).max(30),
        email: z.string().email().optional(),
        taxId: z.string().max(20).optional(),
        needsJar: z.boolean().optional(),
        deliveryMethod: z.enum(["home", "711"]),
        address: z.string().optional(),
        storeCode: z.string().optional(),
        note: z.string().max(500).optional(),
        items: z.array(cartItemSchema).min(1),
        totalAmount: z.number().int().positive(),
        shippingFee: z.number().min(0).default(0),
        returnBaseUrl: z.string().url(), // window.location.origin from frontend
        promoCode: z.string().optional(),
        giftItems: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Validate delivery
      if (input.deliveryMethod === "home" && !input.address?.trim()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "宅配需填寫收件地址" });
      }
      if (input.deliveryMethod === "711" && !input.storeCode?.trim()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "7-11 店到店需填寫門市名稱" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "資料庫連線失敗" });

      const merchantTradeNo = genMerchantTradeNo();
      const merchantTradeDate = new Date()
        .toLocaleString("zh-TW", {
          timeZone: "Asia/Taipei",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(/\//g, "/")
        .replace(",", "");
      // Format: 2024/01/15 14:30:00
      const tradeDate = merchantTradeDate.replace(/(\d{4})\/(\d{2})\/(\d{2})\s/, "$1/$2/$3 ");

      // Save order to DB with pending status
      try {
        await db.insert(ecpayOrders).values({
          merchantTradeNo,
          fullName: input.fullName,
          gender: input.gender,
          phone: input.phone,
          email: input.email ?? null,
          taxId: input.taxId ?? null,
          needsJar: input.needsJar ?? false,
          promoCode: input.promoCode ?? null,
          deliveryMethod: input.deliveryMethod,
          address: input.address ?? null,
          storeCode: input.storeCode ?? null,
          items: JSON.stringify(input.items),
          totalAmount: input.totalAmount.toFixed(2),
          shippingFee: input.shippingFee.toFixed(2),
          note: input.note ?? null,
          status: "pending",
        });
      } catch (err) {
        console.error("[ECPay] DB insert failed:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "訂單建立失敗，請稍後再試" });
      }

      // Build item name (max 400 chars)
      const itemName = input.items
        .map((i) => `${i.name} x${i.quantity}`)
        .join("#")
        .slice(0, 390);

      // ECPay params (no CheckMacValue yet)
      const params: Record<string, string> = {
        MerchantID: ENV.ecpayMerchantId,
        MerchantTradeNo: merchantTradeNo,
        MerchantTradeDate: tradeDate,
        PaymentType: "aio",
        TotalAmount: input.totalAmount.toString(),
        TradeDesc: "迎利茶葉線上訂購",
        ItemName: itemName,
        ReturnURL: `${input.returnBaseUrl}/api/ecpay/return`,
        ChoosePayment: "Credit",
        EncryptType: "1",
        OrderResultURL: `${input.returnBaseUrl}/checkout/result`,
        ClientBackURL: `${input.returnBaseUrl}/checkout`,
        Remark: input.note ? input.note.slice(0, 100) : "",
      };

      // Remove empty optional params
      Object.keys(params).forEach((k) => {
        if (params[k] === "") delete params[k];
      });

      // Calculate CheckMacValue
      params.CheckMacValue = calcCheckMacValue(params, ENV.ecpayHashKey, ENV.ecpayHashIV);

      // Build auto-submit HTML form
      const formFields = Object.entries(params)
        .map(([k, v]) => `<input type="hidden" name="${k}" value="${v.replace(/"/g, "&quot;")}">`)
        .join("\n");

      const formHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>正在前往付款頁面...</title></head>
<body onload="document.getElementById('ecpay-form').submit()">
  <p style="font-family:sans-serif;text-align:center;margin-top:80px;color:#666;">正在前往綠界付款頁面，請稍候...</p>
  <form id="ecpay-form" method="POST" action="${ECPAY_PAYMENT_URL}">
    ${formFields}
  </form>
</body>
</html>`;

      return { merchantTradeNo, formHtml };
    }),

  /**
   * getOrderStatus
   * Frontend polls this after returning from ECPay OrderResultURL
   */
  getOrderStatus: publicProcedure
    .input(z.object({ merchantTradeNo: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "資料庫連線失敗" });

      const rows = await db
        .select()
        .from(ecpayOrders)
        .where(eq(ecpayOrders.merchantTradeNo, input.merchantTradeNo))
        .limit(1);

      if (!rows.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "訂單不存在" });
      }

      const order = rows[0];
      return {
        merchantTradeNo: order.merchantTradeNo,
        status: order.status,
        rtnCode: order.rtnCode,
        rtnMsg: order.rtnMsg,
        totalAmount: order.totalAmount,
        fullName: order.fullName,
        paymentDate: order.paymentDate,
      };
    }),
});

/**
 * ECPay ReturnURL handler (server-side POST callback)
 * Called by ECPay after payment completes.
 * Must respond with "1|OK" to acknowledge receipt.
 */
export async function handleEcpayReturn(body: Record<string, string>): Promise<string> {
  const { CheckMacValue, ...rest } = body;

  // Verify CheckMacValue
  const expected = calcCheckMacValue(rest, ENV.ecpayHashKey, ENV.ecpayHashIV);
  if (expected !== CheckMacValue) {
    console.error("[ECPay Return] CheckMacValue mismatch", { expected, received: CheckMacValue });
    return "0|CheckMacValue Error";
  }

  const db = await getDb();
  if (!db) return "0|DB Error";

  const merchantTradeNo = rest.MerchantTradeNo;
  const rtnCode = parseInt(rest.RtnCode ?? "0", 10);
  const rtnMsg = rest.RtnMsg ?? "";
  const tradeNo = rest.TradeNo ?? "";
  const paymentDate = rest.PaymentDate ?? "";

  const newStatus = rtnCode === 1 ? "paid" : "failed";

  try {
    await db
      .update(ecpayOrders)
      .set({
        status: newStatus,
        rtnCode,
        rtnMsg,
        tradeNo,
        paymentDate,
      })
      .where(eq(ecpayOrders.merchantTradeNo, merchantTradeNo));

    console.log(`[ECPay Return] Order ${merchantTradeNo} → ${newStatus} (RtnCode=${rtnCode})`);

    // Send confirmation email if paid
    if (rtnCode === 1) {
      const rows = await db
        .select()
        .from(ecpayOrders)
        .where(eq(ecpayOrders.merchantTradeNo, merchantTradeNo))
        .limit(1);

      if (rows.length) {
        const order = rows[0];
        const genderLabel = order.gender === "male" ? "先生" : "小姐";
        const deliveryLabel = order.deliveryMethod === "home" ? "宅配" : "7-11 店到店";
        const deliveryDetail =
          order.deliveryMethod === "home"
            ? `收件地址：${order.address ?? "（未填）"}`
            : `7-11 門市：${order.storeCode ?? "（未填）"}`;
        const shippingFee = parseFloat(order.shippingFee ?? "0");
        const totalAmount = parseFloat(order.totalAmount ?? "0");
        const subtotal = totalAmount - shippingFee;
        const shippingLabel = shippingFee === 0 ? "免費" : `NT$${shippingFee.toFixed(0)}`;
        const orderTime = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });

        const items: Array<{ name: string; price: number; quantity: number }> = JSON.parse(order.items);

        // Reconstruct gift items from stored promoCode and totalAmount
        const ecpayGiftItems: string[] = [
          ...(order.promoCode === "welcomegift" ? ["小茶包禮盒 (15入)"] : []),
          ...(totalAmount >= 3000 ? ["品鑑杯一組"] : []),
        ];
        const hasEcpayGifts = ecpayGiftItems.length > 0;
        const ecpayGiftLinesText = hasEcpayGifts
          ? "\n" + ecpayGiftItems.map((g) => `  🎁 ${g}（贈品）  免費`).join("\n")
          : "";
        const ecpayGiftRowsHtml = hasEcpayGifts
          ? ecpayGiftItems.map((g) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #e8e0d4;color:#4a7c59;">🎁 ${g}（贈品）</td><td style="padding:6px 12px;border-bottom:1px solid #e8e0d4;text-align:center;color:#4a7c59;">× 1</td><td style="padding:6px 12px;border-bottom:1px solid #e8e0d4;text-align:right;color:#4a7c59;">免費</td></tr>`).join("")
          : "";

        const itemRowsHtml = items
          .map(
            (item) =>
              `<tr>
                <td style="padding:6px 12px;border-bottom:1px solid #e8e0d4;">${item.name}</td>
                <td style="padding:6px 12px;border-bottom:1px solid #e8e0d4;text-align:center;">× ${item.quantity}</td>
                <td style="padding:6px 12px;border-bottom:1px solid #e8e0d4;text-align:right;">NT$${(item.price * item.quantity).toFixed(0)}</td>
              </tr>`
          )
          .join("");

        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          const resend = new Resend(resendApiKey);

          // ── Customer confirmation email ──────────────────────────────────
          if (order.email) {
            await resend.emails.send({
              from: FROM_EMAIL,
              to: [order.email],
              subject: `【迎利茶葉】付款成功確認 #${merchantTradeNo}`,
              html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>付款成功確認</title></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f0e8;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:oklch(0.265 0.015 55);padding:28px 32px;">
      <h1 style="color:#f5f0e8;margin:0;font-size:20px;font-weight:400;letter-spacing:0.05em;">迎利茶葉 — 付款成功確認</h1>
      <p style="color:#c8b89a;margin:8px 0 0;font-size:13px;">訂單編號 ${merchantTradeNo}｜${orderTime}</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="font-size:15px;color:#2d2416;margin:0 0 24px;">親愛的 ${order.fullName} ${genderLabel}，您好！<br><br>您的信用卡付款已成功，<strong>預計1至3個工作日到貨</strong>。</p>

      <h2 style="font-size:14px;color:#6b5a3e;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px;border-bottom:1px solid #e8e0d4;padding-bottom:10px;">配送方式</h2>
      <p style="font-size:14px;color:#2d2416;margin:0 0 4px;"><strong>${deliveryLabel}</strong></p>
      <p style="font-size:14px;color:#5a4a35;margin:0 0 ${order.note ? "4px" : "24px"};">  ${deliveryDetail}</p>
      ${order.note ? `<p style="font-size:13px;color:#8a7560;margin:4px 0 24px;">備註：${order.note}</p>` : ""}

      <h2 style="font-size:14px;color:#6b5a3e;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px;border-bottom:1px solid #e8e0d4;padding-bottom:10px;">訂購商品</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">
        <thead>
          <tr style="background:#f5f0e8;">
            <th style="padding:8px 12px;text-align:left;color:#6b5a3e;font-weight:500;">商品</th>
            <th style="padding:8px 12px;text-align:center;color:#6b5a3e;font-weight:500;">數量</th>
            <th style="padding:8px 12px;text-align:right;color:#6b5a3e;font-weight:500;">小計</th>
          </tr>
        </thead>
        <tbody>${itemRowsHtml}</tbody>
      </table>
      <div style="text-align:right;font-size:14px;color:#5a4a35;margin-bottom:4px;">小計：NT$${subtotal.toFixed(0)}</div>
      <div style="text-align:right;font-size:14px;color:#5a4a35;margin-bottom:8px;">運費：${shippingLabel}</div>
      <div style="text-align:right;font-size:18px;color:#2d2416;font-weight:600;border-top:2px solid #2d2416;padding-top:8px;">總計：NT$${totalAmount.toFixed(0)}</div>
      ${hasEcpayGifts ? `<div style="margin-top:16px;padding:12px;background:#f0f9f4;border-radius:8px;border:1px solid #b8ddc8;"><p style="font-size:14px;color:#4a7c59;margin:0 0 6px;font-weight:600;">🎁 贈品：</p>${ecpayGiftItems.map((g) => `<p style="font-size:13px;color:#4a7c59;margin:2px 0;">• ${g}</p>`).join("")}</div>` : ""}
    </div>
    <div style="background:#f5f0e8;padding:20px 32px;text-align:center;">
      <p style="font-size:13px;color:#5a4a35;margin:0 0 8px;">如有任何問題，歡迎聯絡我們</p>
      <a href="mailto:yinglitea@yinglitea.com" style="font-size:13px;color:#6b5a3e;">yinglitea@yinglitea.com</a>
      <p style="font-size:12px;color:#8a7560;margin:12px 0 0;">迎利茶葉 敬上</p>
    </div>
  </div>
</body></html>`,
            }).catch((e) => console.warn("[ECPay] Customer email error:", e));
          }

          // ── Store notification email ───────────────────────────────────────────────────
          await resend.emails.send({
            from: FROM_EMAIL,
            to: [STORE_EMAIL, "yinglitea@gmail.com"],
            subject: `【迎利茶】信用卡訂單付款成功 #${merchantTradeNo}`,
            html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>信用卡訂單通知</title></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f0e8;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:oklch(0.265 0.015 55);padding:28px 32px;">
      <h1 style="color:#f5f0e8;margin:0;font-size:20px;font-weight:400;letter-spacing:0.05em;">迎利茶葉 — 信用卡訂單付款成功</h1>
      <p style="color:#c8b89a;margin:8px 0 0;font-size:13px;">訂單編號 #${merchantTradeNo}｜${orderTime}</p>
    </div>
    <div style="padding:28px 32px;">
      <h2 style="font-size:14px;color:#6b5a3e;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px;border-bottom:1px solid #e8e0d4;padding-bottom:10px;">客戶資料</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
        <tr><td style="padding:4px 0;color:#8a7560;width:100px;">姓名</td><td style="padding:4px 0;color:#2d2416;">${order.fullName} ${genderLabel}</td></tr>
        <tr><td style="padding:4px 0;color:#8a7560;">聯絡電話</td><td style="padding:4px 0;color:#2d2416;">${order.phone}</td></tr>
        ${order.email ? `<tr><td style="padding:4px 0;color:#8a7560;">Email</td><td style="padding:4px 0;color:#2d2416;">${order.email}</td></tr>` : ""}
        ${order.taxId ? `<tr><td style="padding:4px 0;color:#8a7560;">統一編號</td><td style="padding:4px 0;color:#2d2416;">${order.taxId}</td></tr>` : ""}
        <tr><td style="padding:4px 0;color:#8a7560;">是否需要罐子</td><td style="padding:4px 0;color:#2d2416;">${order.needsJar ? "需要" : "不需要"}</td></tr>
        <tr><td style="padding:4px 0;color:#8a7560;">付款方式</td><td style="padding:4px 0;color:#2d2416;">信用卡（綠界）</td></tr>
        <tr><td style="padding:4px 0;color:#8a7560;">綠界交易編號</td><td style="padding:4px 0;color:#2d2416;">${tradeNo}</td></tr>
      </table>

      <h2 style="font-size:14px;color:#6b5a3e;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px;border-bottom:1px solid #e8e0d4;padding-bottom:10px;">配送方式</h2>
      <p style="font-size:14px;color:#2d2416;margin:0 0 4px;"><strong>${deliveryLabel}</strong></p>
      <p style="font-size:14px;color:#5a4a35;margin:0 0 ${order.note ? "4px" : "24px"};">  ${deliveryDetail}</p>
      ${order.note ? `<p style="font-size:13px;color:#8a7560;margin:4px 0 24px;">備註：${order.note}</p>` : ""}

      <h2 style="font-size:14px;color:#6b5a3e;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px;border-bottom:1px solid #e8e0d4;padding-bottom:10px;">訂購商品</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">
        <thead>
          <tr style="background:#f5f0e8;">
            <th style="padding:8px 12px;text-align:left;color:#6b5a3e;font-weight:500;">商品</th>
            <th style="padding:8px 12px;text-align:center;color:#6b5a3e;font-weight:500;">數量</th>
            <th style="padding:8px 12px;text-align:right;color:#6b5a3e;font-weight:500;">小計</th>
          </tr>
        </thead>
        <tbody>${itemRowsHtml}</tbody>
      </table>
      <div style="text-align:right;font-size:14px;color:#5a4a35;margin-bottom:4px;">小計：NT$${subtotal.toFixed(0)}</div>
      <div style="text-align:right;font-size:14px;color:#5a4a35;margin-bottom:8px;">運費：${shippingLabel}</div>
      <div style="text-align:right;font-size:18px;color:#2d2416;font-weight:600;border-top:2px solid #2d2416;padding-top:8px;">總計：NT$${totalAmount.toFixed(0)}</div>
      ${hasEcpayGifts ? `<div style="margin-top:16px;padding:12px;background:#f0f9f4;border-radius:8px;border:1px solid #b8ddc8;"><p style="font-size:13px;color:#4a7c59;margin:0 0 6px;font-weight:600;">🎁 贈品明細：</p>${ecpayGiftItems.map((g) => `<p style="font-size:13px;color:#4a7c59;margin:2px 0;">• ${g}</p>`).join("")}</div>` : ""}
    </div>
    <div style="background:#f5f0e8;padding:16px 32px;text-align:center;">
      <p style="font-size:12px;color:#8a7560;margin:0;">請盡快確認並安排出貨，預計1至3個工作日到貨。</p>
    </div>
  </div>
</body></html>`,
          }).catch((e) => console.warn("[ECPay] Store email error:", e));
        }
      }
    }
  } catch (err) {
    console.error("[ECPay Return] DB update failed:", err);
    return "0|DB Update Error";
  }

  return "1|OK";
}
