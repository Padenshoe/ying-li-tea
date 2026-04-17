/**
 * YING-LI TEA — ORDER ROUTER
 * Handles custom COD orders (non-Stripe).
 * submitOrder: saves to customOrders table and sends email via Resend
 */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Resend } from "resend";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { customOrders } from "../../drizzle/schema";

const STORE_EMAIL = "yinglitea@gmail.com";
// Verified sender domain: yinglitea.co (verified in Resend dashboard)
const FROM_EMAIL = "迎利茶葉 <info@yinglitea.co>";

// Cart item schema (mirrors CartItem in client)
const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameKey: z.string().optional(),
  price: z.number(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
});

export const orderRouter = router({
  submitOrder: publicProcedure
    .input(
      z.object({
        fullName: z.string().min(1, "請填寫姓名").max(255),
        gender: z.enum(["male", "female", "other"]),
        phone: z.string().min(8, "請填寫有效電話號碼").max(30),
        email: z.string().email().optional(),
        deliveryMethod: z.enum(["home", "711"]),
        address: z.string().optional(),
        storeCode: z.string().optional(),
        note: z.string().max(500).optional(),
        items: z.array(cartItemSchema).min(1, "購物車不能為空"),
        totalAmount: z.number().positive(),
        shippingFee: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Validate delivery-specific fields
      if (input.deliveryMethod === "home" && !input.address?.trim()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "宅配需填寫收件地址",
        });
      }
      if (input.deliveryMethod === "711" && !input.storeCode?.trim()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "7-11 店到店需填寫門市名稱",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "資料庫連線失敗",
        });
      }

      // Save order to database
      let orderId: number;
      try {
        const result = await db.insert(customOrders).values({
          fullName: input.fullName,
          gender: input.gender,
          phone: input.phone,
          deliveryMethod: input.deliveryMethod,
          address: input.address ?? null,
          storeCode: input.storeCode ?? null,
          items: JSON.stringify(input.items),
          totalAmount: input.totalAmount.toFixed(2),
          note: input.note ?? null,
          status: "pending",
        });
        orderId = (result as any).insertId ?? 0;
      } catch (err) {
        console.error("[Order] DB insert failed:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "訂單儲存失敗，請稍後再試",
        });
      }

      // Build email content
      const genderLabel =
        input.gender === "male" ? "先生" : input.gender === "female" ? "女士" : "其他";
      const deliveryLabel =
        input.deliveryMethod === "home" ? "宅配（貨到付款）" : "7-11 店到店（貨到付款）";
      const deliveryDetail =
        input.deliveryMethod === "home"
          ? `收件地址：${input.address}`
          : `7-11 門市：${input.storeCode}`;

      const shippingFee = input.shippingFee ?? 0;
      const subtotal = input.totalAmount - shippingFee;
      const shippingLabel = shippingFee === 0 ? "免費" : `NT$${shippingFee}`;
      const orderTime = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });

      const itemRowsHtml = input.items
        .map(
          (item) =>
            `<tr>
              <td style="padding:6px 12px;border-bottom:1px solid #e8e0d4;">${item.name}</td>
              <td style="padding:6px 12px;border-bottom:1px solid #e8e0d4;text-align:center;">× ${item.quantity}</td>
              <td style="padding:6px 12px;border-bottom:1px solid #e8e0d4;text-align:right;">NT$${(item.price * item.quantity).toFixed(0)}</td>
            </tr>`
        )
        .join("");

      const itemLinesText = input.items
        .map((item) => `  • ${item.name} × ${item.quantity}  NT$${(item.price * item.quantity).toFixed(0)}`)
        .join("\n");

      // HTML email template for store notification
      const storeEmailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>新訂單通知</title></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f0e8;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:oklch(0.265 0.015 55);padding:28px 32px;">
      <h1 style="color:#f5f0e8;margin:0;font-size:20px;font-weight:400;letter-spacing:0.05em;">迎利茶葉 — 新訂單通知</h1>
      <p style="color:#c8b89a;margin:8px 0 0;font-size:13px;">訂單編號 #${orderId}｜${orderTime}</p>
    </div>
    <div style="padding:28px 32px;">
      <h2 style="font-size:14px;color:#6b5a3e;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px;border-bottom:1px solid #e8e0d4;padding-bottom:10px;">客戶資料</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
        <tr><td style="padding:4px 0;color:#8a7560;width:100px;">姓名</td><td style="padding:4px 0;color:#2d2416;">${input.fullName} ${genderLabel}</td></tr>
        <tr><td style="padding:4px 0;color:#8a7560;">聯絡電話</td><td style="padding:4px 0;color:#2d2416;">${input.phone}</td></tr>
        ${input.email ? `<tr><td style="padding:4px 0;color:#8a7560;">Email</td><td style="padding:4px 0;color:#2d2416;">${input.email}</td></tr>` : ""}
      </table>

      <h2 style="font-size:14px;color:#6b5a3e;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px;border-bottom:1px solid #e8e0d4;padding-bottom:10px;">配送方式</h2>
      <p style="font-size:14px;color:#2d2416;margin:0 0 4px;"><strong>${deliveryLabel}</strong></p>
      <p style="font-size:14px;color:#5a4a35;margin:0 0 ${input.note ? "4px" : "24px"};">${deliveryDetail}</p>
      ${input.note ? `<p style="font-size:13px;color:#8a7560;margin:4px 0 24px;">備註：${input.note}</p>` : ""}

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
      <div style="text-align:right;font-size:18px;color:#2d2416;font-weight:600;border-top:2px solid #2d2416;padding-top:8px;">總計（貨到付款）：NT$${input.totalAmount.toFixed(0)}</div>
    </div>
    <div style="background:#f5f0e8;padding:16px 32px;text-align:center;">
      <p style="font-size:12px;color:#8a7560;margin:0;">請盡快確認並安排出貨，預計三到五個工作日到貨。</p>
    </div>
  </div>
</body>
</html>`;

      // HTML email template for customer confirmation
      const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>訂單確認通知</title></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f0e8;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:oklch(0.265 0.015 55);padding:28px 32px;">
      <h1 style="color:#f5f0e8;margin:0;font-size:20px;font-weight:400;letter-spacing:0.05em;">迎利茶葉 — 訂單確認通知</h1>
      <p style="color:#c8b89a;margin:8px 0 0;font-size:13px;">訂單編號 #${orderId}｜${orderTime}</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="font-size:15px;color:#2d2416;margin:0 0 24px;">親愛的 ${input.fullName} ${genderLabel}，您好！<br><br>感謝您向迎利茶葉訂購，我們已收到您的訂單，<strong>預計三到五個工作日到貨</strong>。</p>

      <h2 style="font-size:14px;color:#6b5a3e;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px;border-bottom:1px solid #e8e0d4;padding-bottom:10px;">配送方式</h2>
      <p style="font-size:14px;color:#2d2416;margin:0 0 4px;"><strong>${deliveryLabel}</strong></p>
      <p style="font-size:14px;color:#5a4a35;margin:0 0 ${input.note ? "4px" : "24px"};">${deliveryDetail}</p>
      ${input.note ? `<p style="font-size:13px;color:#8a7560;margin:4px 0 24px;">備註：${input.note}</p>` : ""}

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
      <div style="text-align:right;font-size:18px;color:#2d2416;font-weight:600;border-top:2px solid #2d2416;padding-top:8px;">總計（貨到付款）：NT$${input.totalAmount.toFixed(0)}</div>
    </div>
    <div style="background:#f5f0e8;padding:20px 32px;text-align:center;">
      <p style="font-size:13px;color:#5a4a35;margin:0 0 8px;">如有任何問題，歡迎聯絡我們</p>
      <a href="mailto:yinglitea@gmail.com" style="font-size:13px;color:#6b5a3e;">yinglitea@gmail.com</a>
      <p style="font-size:12px;color:#8a7560;margin:12px 0 0;">迎利茶葉 敬上</p>
    </div>
  </div>
</body>
</html>`;

      // Send emails via Resend
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          console.warn("[Order] RESEND_API_KEY not configured, skipping email");
        } else {
          const resend = new Resend(resendApiKey);

          // 1. Store notification (yinglitea@gmail.com)
          const storeResult = await resend.emails.send({
            from: FROM_EMAIL,
            to: [STORE_EMAIL],
            subject: `【迎利茶】新訂單 #${orderId} — ${input.fullName} ${genderLabel}`,
            html: storeEmailHtml,
            text: `迎利茶 — 新訂單通知\n訂單編號：#${orderId}\n下單時間：${orderTime}\n\n姓名：${input.fullName} ${genderLabel}\n電話：${input.phone}\n${input.email ? "Email：" + input.email + "\n" : ""}${deliveryLabel}\n${deliveryDetail}\n${input.note ? "備註：" + input.note + "\n" : ""}\n訂購商品：\n${itemLinesText}\n\n小計：NT$${subtotal.toFixed(0)}\n運費：${shippingLabel}\n總計：NT$${input.totalAmount.toFixed(0)}（貨到付款）`,
          });
          if (storeResult.error) {
            console.warn("[Order] Store email failed:", storeResult.error);
          } else {
            console.log(`[Order] Store email sent for order #${orderId}`, storeResult.data?.id);
          }

          // 2. Customer confirmation (if email provided)
          if (input.email) {
            const customerResult = await resend.emails.send({
              from: FROM_EMAIL,
              to: [input.email],
              subject: `【迎利茶葉】訂單確認通知 #${orderId}`,
              html: customerEmailHtml,
              text: `親愛的 ${input.fullName} ${genderLabel}，您好！\n\n感謝您向迎利茶葉訂購，我們已收到您的訂單，預計三到五個工作日到貨。\n\n訂單編號：#${orderId}\n${deliveryLabel}\n${deliveryDetail}\n${input.note ? "備註：" + input.note + "\n" : ""}\n訂購商品：\n${itemLinesText}\n\n小計：NT$${subtotal.toFixed(0)}\n運費：${shippingLabel}\n總計：NT$${input.totalAmount.toFixed(0)}（貨到付款）\n\n如有問題請聯絡：yinglitea@gmail.com\n\n迎利茶葉 敬上`,
            });
            if (customerResult.error) {
              console.warn("[Order] Customer email failed:", customerResult.error);
            } else {
              console.log(`[Order] Customer email sent to ${input.email}`, customerResult.data?.id);
            }
          }
        }
      } catch (emailErr) {
        // Email failure should NOT block the order confirmation
        console.error("[Order] Email error:", emailErr);
      }

      return {
        success: true,
        orderId,
        message: "訂單已成功送出！我們將盡快與您確認。",
      };
    }),
});
