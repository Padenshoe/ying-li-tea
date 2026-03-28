/*
 * YING-LI TEA — CHECKOUT CANCEL PAGE
 * Displays when user cancels Stripe payment
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutCancel() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-12 md:py-24">
      <div className="container max-w-2xl">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <AlertCircle size={64} style={{ color: "oklch(0.577 0.245 27.325)" }} className="mx-auto mb-4" />
        </div>

        {/* Cancel Message */}
        <div className="text-center mb-12">
          <h1
            className="font-['Playfair_Display'] font-400 mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "oklch(0.265 0.015 55)",
              letterSpacing: "-0.01em",
            }}
          >
            {language === "en" ? "Payment Cancelled" : "付款已取消"}
          </h1>
          <p
            className="font-['Lato'] text-lg"
            style={{ color: "oklch(0.552 0.016 285.938)" }}
          >
            {language === "en"
              ? "Your payment has been cancelled. Your items remain in your cart."
              : "您的付款已取消。您的商品仍在購物車中。"}
          </p>
        </div>

        {/* Information Box */}
        <div
          className="p-8 rounded mb-8"
          style={{ background: "oklch(0.967 0.001 286.375)", border: "1px solid oklch(0.870 0.018 130)" }}
        >
          <h2
            className="font-['Lato'] font-600 mb-4"
            style={{ color: "oklch(0.265 0.015 55)" }}
          >
            {language === "en" ? "What Happened?" : "發生了什麼？"}
          </h2>
          <p
            className="font-['Lato'] mb-4"
            style={{ color: "oklch(0.552 0.016 285.938)" }}
          >
            {language === "en"
              ? "You cancelled the payment process during checkout. No charges have been made to your account."
              : "您在結帳過程中取消了付款。您的帳戶未被收費。"}
          </p>
          <p
            className="font-['Lato']"
            style={{ color: "oklch(0.552 0.016 285.938)" }}
          >
            {language === "en"
              ? "Your shopping cart has been preserved with all your items. You can return to checkout whenever you're ready."
              : "您的購物車已保存所有商品。您可以隨時返回結帳。"}
          </p>
        </div>

        {/* Next Steps */}
        <div
          className="p-6 rounded mb-8"
          style={{ background: "oklch(0.950 0.010 145 / 0.3)", border: "1px solid oklch(0.500 0.060 145 / 0.3)" }}
        >
          <h3
            className="font-['Lato'] font-600 mb-3"
            style={{ color: "oklch(0.265 0.015 55)" }}
          >
            {language === "en" ? "Next Steps" : "接下來"}
          </h3>
          <ul className="space-y-2 font-['Lato']" style={{ color: "oklch(0.552 0.016 285.938)" }}>
            <li>
              • {language === "en"
                ? "Review your cart items and quantities"
                : "檢查您的購物車商品和數量"}
            </li>
            <li>
              • {language === "en"
                ? "Update your payment method if needed"
                : "如需要，更新您的付款方式"}
            </li>
            <li>
              • {language === "en"
                ? "Try the checkout process again"
                : "重新嘗試結帳流程"}
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <a
              className="px-8 py-3 rounded font-['Lato'] font-500 text-center transition-all duration-300"
              style={{
                background: "oklch(0.500 0.060 145)",
                color: "#FAFAF7",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
            >
              {language === "en" ? "Back to Shopping" : "返回購物"}
            </a>
          </Link>
          <a
            href="mailto:yinglitea@gmail.com"
            className="px-8 py-3 rounded font-['Lato'] font-500 text-center transition-all duration-300"
            style={{
              background: "transparent",
              border: "1px solid oklch(0.500 0.060 145)",
              color: "oklch(0.500 0.060 145)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "oklch(0.500 0.060 145 / 0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            {language === "en" ? "Contact Support" : "聯絡支援"}
          </a>
        </div>
      </div>
    </div>
  );
}
