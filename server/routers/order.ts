/**
 * YING-LI TEA — ORDER ROUTER
 * Handles custom COD orders (non-Stripe).
 * submitOrder: saves to customOrders table and sends email to yinglitea@gmail.com
 */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { customOrders } from "../../drizzle/schema";
import { invokeLLM } from "../_core/llm";

const OWNER_EMAIL = "neil34689@gmail.com";
const STORE_EMAIL = "yinglitea@gmail.com";

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

      // Build email body
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

      const itemLines = input.items
        .map(
          (item) =>
            `  • ${item.name} × ${item.quantity}  NT$${(item.price * item.quantity).toFixed(0)}`
        )
        .join("\n");

      const customerEmailLine = input.email ? `Email：${input.email}` : "";

      // Owner notification email body
      const emailBody = `
迎利茶 — 新訂單通知
═══════════════════════════════

訂單編號：#${orderId}
下單時間：${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}

── 客戶資料 ──────────────
姓名：${input.fullName}
性別：${genderLabel}
聯絡電話：${input.phone}
${customerEmailLine ? customerEmailLine + "\n" : ""}
── 配送方式 ──────────────
${deliveryLabel}
${deliveryDetail}
${input.note ? `\n備註：${input.note}` : ""}

── 訂購商品 ──────────────
${itemLines}

小計：NT$${subtotal.toFixed(0)}
運費：${shippingLabel}
總計：NT$${input.totalAmount.toFixed(0)}（貨到付款）

═══════════════════════════════
請盡快確認並安排出貨。預計三到五個工作日到貨。
      `.trim();

      // Customer confirmation email body
      const customerEmailBody = `
親愛的 ${input.fullName} ${genderLabel}，您好！

感謝您向迎利茶葉訂購，我們已收到您的訂單，預計三到五個工作日到貨。

═══════════════════════════════
訂單編號：#${orderId}
下單時間：${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}

── 配送方式 ──────────────
${deliveryLabel}
${deliveryDetail}
${input.note ? `\n備註：${input.note}` : ""}

── 訂購商品 ──────────────
${itemLines}

小計：NT$${subtotal.toFixed(0)}
運費：${shippingLabel}
總計：NT$${input.totalAmount.toFixed(0)}（貨到付款）

═══════════════════════════════
如有任何問題，歡迎以 Email 聯絡我們：yinglitea@gmail.com

迎利茶葉 敬上
      `.trim();

      // Send emails (owner notification + customer confirmation)
      try {
        const forgeApiUrl = process.env.BUILT_IN_FORGE_API_URL;
        const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;

        if (forgeApiUrl && forgeApiKey) {
          const sendEmail = async (to: string, subject: string, text: string) => {
            const res = await fetch(`${forgeApiUrl}/v1/notification/email`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${forgeApiKey}`,
              },
              body: JSON.stringify({
                to,
                subject,
                text,
                html: text.replace(/\n/g, "<br>").replace(/═+/g, "<hr>"),
              }),
            });
            if (!res.ok) {
              const errText = await res.text();
              console.warn(`[Order] Email to ${to} failed:`, res.status, errText);
            } else {
              console.log(`[Order] Email sent to ${to} for order #${orderId}`);
            }
          };

          // 1. Owner notification (neil34689@gmail.com)
          await sendEmail(
            OWNER_EMAIL,
            `【迎利茶】新訂單 #${orderId} — ${input.fullName} ${genderLabel}`,
            emailBody
          );

          // 2. Store copy (yinglitea@gmail.com)
          await sendEmail(
            STORE_EMAIL,
            `【迎利茶】新訂單 #${orderId} 副本 — ${input.fullName} ${genderLabel}`,
            emailBody
          );

          // 3. Customer confirmation (if email provided)
          if (input.email) {
            await sendEmail(
              input.email,
              `【迎利茶葉】訂單確認通知 #${orderId}`,
              customerEmailBody
            );
          }
        } else {
          console.warn("[Order] Forge API not configured, skipping email");
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
