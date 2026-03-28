import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { notifyOwner } from "../_core/notification";

export const contactRouter = router({
  /**
   * Submit a customer inquiry.
   * Available to all visitors (no login required).
   * Sends a notification to the store owner via the Manus notification API.
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

      const title = `New inquiry from ${name}`;
      const content = `**Name:** ${name}\n**Email:** ${email}\n\n**Message:**\n${message}`;

      try {
        const sent = await notifyOwner({ title, content });
        if (!sent) {
          // Notification service is temporarily unavailable — still return success
          // so the customer is not left with an error for a backend issue.
          console.warn("[Contact] notifyOwner returned false — notification may not have been delivered");
        }
        return { success: true };
      } catch (error) {
        console.error("[Contact] Failed to send inquiry notification:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send your message. Please try again later.",
        });
      }
    }),
});
