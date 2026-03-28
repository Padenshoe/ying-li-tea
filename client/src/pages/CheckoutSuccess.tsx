/*
 * YING-LI TEA — CHECKOUT SUCCESS PAGE
 * Displays after successful Stripe payment
 */
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutSuccess() {
  // Use window.location.search to reliably read query params after Stripe redirect
  const sessionId = new URLSearchParams(window.location.search).get('session_id') || '';
  const { language } = useLanguage();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const getOrder = trpc.stripe.getOrder.useQuery(
    { sessionId: sessionId || "" },
    { enabled: !!sessionId }
  );

  useEffect(() => {
    if (getOrder.data) {
      setOrderDetails(getOrder.data);
    }
  }, [getOrder.data]);

  const isLoading = !!sessionId && getOrder.isLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin mx-auto mb-4" style={{ color: "oklch(0.500 0.060 145)" }} />
          <p className="font-['Lato']" style={{ color: "oklch(0.552 0.016 285.938)" }}>
            {language === "en" ? "Loading order details..." : "載入訂單詳情..."}
          </p>
        </div>
      </div>
    );
  }

  if (getOrder.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
        <div className="text-center max-w-md">
          <h1 className="font-['Playfair_Display'] text-3xl mb-4" style={{ color: "oklch(0.265 0.015 55)" }}>
            {language === "en" ? "Error" : "錯誤"}
          </h1>
          <p className="font-['Lato'] mb-6" style={{ color: "oklch(0.552 0.016 285.938)" }}>
            {language === "en" ? "Unable to retrieve order details" : "無法取得訂單詳情"}
          </p>
          <Link href="/" className="inline-block px-6 py-3 rounded font-['Lato'] font-500" style={{ background: "oklch(0.500 0.060 145)", color: "#FAFAF7" }}>
            {language === "en" ? "Return to Home" : "返回首頁"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-12 md:py-24">
      <div className="container max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <CheckCircle size={64} style={{ color: "oklch(0.500 0.060 145)" }} className="mx-auto mb-4" />
        </div>

        {/* Success Message */}
        <div className="text-center mb-12">
          <h1
            className="font-['Playfair_Display'] font-400 mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "oklch(0.265 0.015 55)",
              letterSpacing: "-0.01em",
            }}
          >
            {language === "en" ? "Order Confirmed" : "訂單已確認"}
          </h1>
          <p
            className="font-['Lato'] text-lg"
            style={{ color: "oklch(0.552 0.016 285.938)" }}
          >
            {language === "en"
              ? "Thank you for your purchase! Your order has been successfully processed."
              : "感謝您的購買！您的訂單已成功處理。"}
          </p>
        </div>

        {/* Order Details */}
        <div
          className="p-8 rounded mb-8"
          style={{ background: "oklch(0.967 0.001 286.375)", border: "1px solid oklch(0.870 0.018 130)" }}
        >
          <h2
            className="font-['Lato'] font-600 mb-6"
            style={{ color: "oklch(0.265 0.015 55)" }}
          >
            {language === "en" ? "Order Summary" : "訂單摘要"}
          </h2>

          <div className="space-y-4 mb-6 pb-6" style={{ borderBottom: "1px solid oklch(0.870 0.018 130)" }}>
            <div className="flex justify-between">
              <span className="font-['Lato']" style={{ color: "oklch(0.552 0.016 285.938)" }}>
                {language === "en" ? "Order ID" : "訂單編號"}
              </span>
              <span className="font-['Lato'] font-500" style={{ color: "oklch(0.265 0.015 55)" }}>
                {orderDetails?.stripeCheckoutSessionId?.slice(0, 12)}...
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-['Lato']" style={{ color: "oklch(0.552 0.016 285.938)" }}>
                {language === "en" ? "Status" : "狀態"}
              </span>
              <span className="font-['Lato'] font-500" style={{ color: "oklch(0.500 0.060 145)" }}>
                {orderDetails?.status === "completed"
                  ? language === "en"
                    ? "Completed"
                    : "已完成"
                  : language === "en"
                  ? "Pending"
                  : "待處理"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-['Lato']" style={{ color: "oklch(0.552 0.016 285.938)" }}>
                {language === "en" ? "Total Amount" : "總金額"}
              </span>
              <span className="font-['Lato'] font-500" style={{ color: "oklch(0.265 0.015 55)" }}>
                ${parseFloat(orderDetails?.totalAmount || "0").toFixed(2)}
              </span>
            </div>

            {orderDetails?.customerEmail && (
              <div className="flex justify-between">
                <span className="font-['Lato']" style={{ color: "oklch(0.552 0.016 285.938)" }}>
                  {language === "en" ? "Email" : "電郵"}
                </span>
                <span className="font-['Lato'] font-500" style={{ color: "oklch(0.265 0.015 55)" }}>
                  {orderDetails.customerEmail}
                </span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div>
            <h3
              className="font-['Lato'] font-600 mb-4"
              style={{ color: "oklch(0.265 0.015 55)" }}
            >
              {language === "en" ? "Items" : "商品"}
            </h3>
            <div className="space-y-2">
              {orderDetails?.items && JSON.parse(orderDetails.items).map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span className="font-['Lato']" style={{ color: "oklch(0.552 0.016 285.938)" }}>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-['Lato'] font-500" style={{ color: "oklch(0.265 0.015 55)" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
            {language === "en" ? "What's Next?" : "接下來呢？"}
          </h3>
          <ul className="space-y-2 font-['Lato']" style={{ color: "oklch(0.552 0.016 285.938)" }}>
            <li>
              • {language === "en"
                ? "You will receive a confirmation email shortly"
                : "您將很快收到確認電郵"}
            </li>
            <li>
              • {language === "en"
                ? "Your order will be processed and shipped within 3-5 business days"
                : "您的訂單將在3-5個工作日內處理並發貨"}
            </li>
            <li>
              • {language === "en"
                ? "You can track your shipment using the tracking number provided"
                : "您可以使用提供的追蹤號碼追蹤您的貨物"}
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
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
            {language === "en" ? "Continue Shopping" : "繼續購物"}
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
