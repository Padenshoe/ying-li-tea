/*
 * YING-LI TEA — 訂單確認頁面
 * 顯示訂單編號、商品、配送方式、貨到付款說明
 * 路由：/order-confirmation?orderId=123&method=home
 */
import { useEffect } from "react";
import { useSearch } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import Navbar from "@/components/Navbar";
import { Link } from "wouter";

// Extend Window interface for GTM dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

const accentGreen = "oklch(0.500 0.060 145)";

interface OrderData {
  orderId: number;
  method: "home" | "711";
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  storeCode?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal?: number;
  shippingFee?: number;
  totalAmount: number;
}

export default function OrderConfirmation() {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const search = useSearch();

  // Parse query params — order data is stored in sessionStorage to avoid URL length limits
  // useSearch() returns the query string (e.g. "orderId=123") without the leading "?"
  const params = new URLSearchParams(search || "");
  const orderId = params.get("orderId");

  let orderData: OrderData | null = null;
  const storedData = sessionStorage.getItem('yingli_order_confirmation');
  if (storedData) {
    try {
      orderData = JSON.parse(storedData);
      // Only use stored data if it matches the current orderId
      if (orderData && String(orderData.orderId) !== String(orderId)) {
        orderData = null;
      }
    } catch (e) {
      console.error("Failed to parse stored order data:", e);
    }
  }

  const method = orderData?.method ?? null;

  // Push purchase event to GTM dataLayer once order data is confirmed
  useEffect(() => {
    if (!orderId || !orderData) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'purchase',
      order_id: String(orderId),
      value: orderData.totalAmount,
      user_email: orderData.email ?? '',
    });
  }, [orderId, orderData?.totalAmount, orderData?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!orderId || !method || !orderData) {
    return (
      <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
        <Navbar />
        <main className="container pt-32 pb-24 max-w-xl mx-auto text-center">
          <p
            className="font-['Lato'] font-300 mb-6"
            style={{ fontSize: "1rem", color: "oklch(0.520 0.020 60)" }}
          >
            訂單資訊遺失，請返回首頁重新下單。
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300"
            style={{ background: accentGreen, color: "#FAFAF7" }}
          >
            返回首頁
          </Link>
        </main>
      </div>
    );
  }

  const deliveryLabel = method === "home" ? "宅配（貨到付款）" : "7-11 店到店（貨到付款）";
  const deliveryDetail =
    method === "home" ? `收件地址：${orderData.address}` : `7-11 門市：${orderData.storeCode}`;

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
      <Navbar />

      <main className="container pt-28 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Success header */}
          <div className="text-center mb-12">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: `${accentGreen}22`, border: `2px solid ${accentGreen}` }}
            >
              <span style={{ color: accentGreen, fontSize: "1.75rem" }}>✓</span>
            </div>
            <h1
              className="font-['Playfair_Display'] font-400 mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "oklch(0.265 0.015 55)" }}
            >
              訂單成功！
            </h1>
            <p
              className="font-['Lato'] font-300 leading-relaxed mb-2"
              style={{ fontSize: "1rem", color: "oklch(0.520 0.020 60)" }}
            >
              感謝您的訂購，我們已收到您的訂單，預計三到五個工作日到貨。
            </p>
            <p
              className="font-['Lato'] font-600"
              style={{ fontSize: "1rem", color: accentGreen }}
            >
              訂單編號：#{orderId}
            </p>
          </div>

          {/* Order details */}
          <div
            className="rounded-xl p-8 mb-8"
            style={{ background: "#FAFAF7", border: "1px solid oklch(0.870 0.018 130)" }}
          >
            <h2
              className="font-['Lato'] font-600 text-sm tracking-[0.08em] uppercase mb-6"
              style={{ color: "oklch(0.265 0.015 55)" }}
            >
              訂單摘要
            </h2>

            {/* Customer info */}
            <div className="mb-6 pb-6" style={{ borderBottom: "1px solid oklch(0.870 0.018 130)" }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p
                    className="text-xs font-['Lato'] font-400 tracking-[0.08em] uppercase mb-1"
                    style={{ color: "oklch(0.550 0.020 60)" }}
                  >
                    收件人
                  </p>
                  <p
                    className="font-['Lato'] font-500 text-sm"
                    style={{ color: "oklch(0.265 0.015 55)" }}
                  >
                    {orderData.fullName}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs font-['Lato'] font-400 tracking-[0.08em] uppercase mb-1"
                    style={{ color: "oklch(0.550 0.020 60)" }}
                  >
                    聯絡電話
                  </p>
                  <p
                    className="font-['Lato'] font-500 text-sm"
                    style={{ color: "oklch(0.265 0.015 55)" }}
                  >
                    {orderData.phone}
                  </p>
                </div>
              </div>
              {orderData.email && (
                <div className="mt-4">
                  <p
                    className="text-xs font-['Lato'] font-400 tracking-[0.08em] uppercase mb-1"
                    style={{ color: "oklch(0.550 0.020 60)" }}
                  >
                    確認信已寄至
                  </p>
                  <p
                    className="font-['Lato'] font-500 text-sm"
                    style={{ color: accentGreen }}
                  >
                    {orderData.email}
                  </p>
                </div>
              )}
            </div>

            {/* Delivery info */}
            <div className="mb-6 pb-6" style={{ borderBottom: "1px solid oklch(0.870 0.018 130)" }}>
              <p
                className="text-xs font-['Lato'] font-400 tracking-[0.08em] uppercase mb-2"
                style={{ color: "oklch(0.550 0.020 60)" }}
              >
                配送方式
              </p>
              <p
                className="font-['Lato'] font-600 text-sm mb-1"
                style={{ color: accentGreen }}
              >
                {deliveryLabel}
              </p>
              <p
                className="font-['Lato'] font-400 text-sm"
                style={{ color: "oklch(0.265 0.015 55)" }}
              >
                {deliveryDetail}
              </p>
            </div>

            {/* Items */}
            <div className="mb-6 pb-6" style={{ borderBottom: "1px solid oklch(0.870 0.018 130)" }}>
              <p
                className="text-xs font-['Lato'] font-400 tracking-[0.08em] uppercase mb-3"
                style={{ color: "oklch(0.550 0.020 60)" }}
              >
                訂購商品
              </p>
              <div className="space-y-2">
                {orderData.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-['Lato'] font-600 flex-shrink-0"
                        style={{ background: accentGreen, color: "#FAFAF7" }}
                      >
                        {item.quantity}
                      </span>
                      <span
                        className="font-['Lato'] font-400 text-sm"
                        style={{ color: "oklch(0.265 0.015 55)" }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span
                      className="font-['Lato'] font-400 text-sm"
                      style={{ color: "oklch(0.520 0.020 60)" }}
                    >
                      NT${(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-['Lato'] font-300" style={{ color: "oklch(0.520 0.020 60)" }}>
                  小計
                </span>
                <span className="font-['Lato'] font-400" style={{ color: "oklch(0.265 0.015 55)" }}>
                  NT${(orderData.subtotal ?? orderData.totalAmount).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-['Lato'] font-300" style={{ color: "oklch(0.520 0.020 60)" }}>
                  運費
                </span>
                <span className="font-['Lato'] font-400" style={{ color: (orderData.shippingFee ?? 0) === 0 ? accentGreen : "oklch(0.265 0.015 55)" }}>
                  {(orderData.shippingFee ?? 0) === 0 ? "免費" : `NT$${orderData.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between pt-3 mt-1" style={{ borderTop: "1px solid oklch(0.870 0.018 130)" }}>
                <span className="font-['Lato'] font-600 text-sm" style={{ color: "oklch(0.265 0.015 55)" }}>
                  總計（貨到付款）
                </span>
                <span
                  className="font-['Playfair_Display'] font-400 text-xl"
                  style={{ color: accentGreen }}
                >
                  NT${orderData.totalAmount.toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment instructions */}
          <div
            className="rounded-xl p-8 mb-8"
            style={{ background: `${accentGreen}08`, border: `1px solid ${accentGreen}33` }}
          >
            <h3
              className="font-['Lato'] font-600 text-sm tracking-[0.08em] uppercase mb-4"
              style={{ color: accentGreen }}
            >
              💳 貨到付款說明
            </h3>
            <div className="space-y-3">
              <p
                className="font-['Lato'] font-400 text-sm leading-relaxed"
                style={{ color: "oklch(0.265 0.015 55)" }}
              >
                您選擇的是<strong>貨到付款</strong>方式，這表示：
              </p>
              <ul
                className="space-y-2 text-sm font-['Lato'] font-400"
                style={{ color: "oklch(0.265 0.015 55)" }}
              >
                <li>✓ 商品送達時再支付現金</li>
                <li>✓ 無需提前線上付款</li>
                <li>✓ 收貨時可驗收商品品質</li>
                {method === "home" && <li>✓ 宅配員會致電確認送達時間</li>}
                {method === "711" && <li>✓ 到門市領取時在櫃台付款</li>}
              </ul>
            </div>
          </div>

          {/* Next steps */}
          <div
            className="rounded-xl p-8 mb-8"
            style={{ background: "#FAFAF7", border: "1px solid oklch(0.870 0.018 130)" }}
          >
            <h3
              className="font-['Lato'] font-600 text-sm tracking-[0.08em] uppercase mb-4"
              style={{ color: "oklch(0.265 0.015 55)" }}
            >
              📞 後續步驟
            </h3>
            <p
              className="font-['Lato'] font-400 text-sm leading-relaxed mb-4"
              style={{ color: "oklch(0.520 0.020 60)" }}
            >
              我們已收到您的訂單，預計三到五個工作日到貨。如有任何問題，歡迎直接聯絡我們：
            </p>
            <p
              className="font-['Lato'] font-400 text-sm"
              style={{ color: accentGreen }}
            >
              📧 <a href="mailto:yinglitea@gmail.com" style={{ textDecoration: "underline" }}>yinglitea@gmail.com</a>
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-block px-8 py-3 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300 rounded"
              style={{ background: accentGreen, color: "#FAFAF7" }}
            >
              返回首頁
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
}
