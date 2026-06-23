import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { Resend } from "resend";

const FROM_EMAIL = "迎利茶葉 <info@yinglitea.co>";
const STORE_EMAIL = "yinglitea@gmail.com";

export const contactRouter = router({
  /**
   * Submit a customer inquiry.
   * Available to all visitors (no login required).
   * Sends an email notification to yinglitea@gmail.com via Resend.
   */
  submitInquiry: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required").max(100),
        email: z.string().email("Invalid email address").max(320),
        message: z.string().min(10, "Message must be at least 10 characters").max(2000),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, message } = input;

      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        console.warn("[Contact] RESEND_API_KEY not set — cannot send email");
        return { success: true };
      }

      const resend = new Resend(resendApiKey);
      const now = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: [STORE_EMAIL],
          replyTo: email,
          subject: `【迎利茶葉】網站訊息：${name}`,
          html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>網站訊息通知</title></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f0e8;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:oklch(0.265 0.015 55);padding:28px 32px;">
      <h1 style="color:#f5f0e8;margin:0;font-size:20px;font-weight:400;letter-spacing:0.05em;">迎利茶葉 — 網站訊息通知</h1>
      <p style="color:#c8b89a;margin:8px 0 0;font-size:13px;">${now}</p>
    </div>
    <div style="padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
        <tr><td style="padding:6px 0;color:#8a7560;width:80px;">姓名</td><td style="padding:6px 0;color:#2d2416;">${name}</td></tr>
        <tr><td style="padding:6px 0;color:#8a7560;">Email</td><td style="padding:6px 0;color:#2d2416;"><a href="mailto:${email}" style="color:#6b5a3e;">${email}</a></td></tr>
      </table>
      <h2 style="font-size:14px;color:#6b5a3e;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 12px;border-bottom:1px solid #e8e0d4;padding-bottom:8px;">訊息內容</h2>
      <div style="font-size:14px;color:#2d2416;line-height:1.8;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    </div>
    <div style="background:#f5f0e8;padding:16px 32px;text-align:center;">
      <p style="font-size:12px;color:#8a7560;margin:0;">直接回覆此郵件即可回覆給 ${name}</p>
    </div>
  </div>
</body></html>`,
        });

        return { success: true };
      } catch (error) {
        console.error("[Contact] Failed to send inquiry email:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send your message. Please try again later.",
        });
      }
    }),
});
