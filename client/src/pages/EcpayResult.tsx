/*
 * YING-LI TEA — ECPay 付款結果頁面
 * ECPay OrderResultURL 導向此頁（GET 帶 MerchantTradeNo 等參數）
 * 此頁輪詢後端確認付款狀態（因 ReturnURL 是後端 callback，前端需 poll）
 */
import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import Navbar from "@/components/Navbar";
import MiniFooter from "@/components/MiniFooter";
import { trpc } from "@/lib/trpc";

const accentGreen = "oklch(0.380 0.070 145)";

export default function EcpayResult() {
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const merchantTradeNo =
    params.get("MerchantTradeNo") ||
    sessionStorage.getItem("yingli_ecpay_trade_no") ||
    "";

  const [pollCount, setPollCount] = useState(0);
  const maxPolls = 10;

  const { data, isLoading, error, refetch } = trpc.ecpay.getOrderStatus.useQuery(
    { merchantTradeNo },
    {
      enabled: !!merchantTradeNo,
      refetchInterval: false,
    }
  );

  // Poll every 2s until paid/failed or max polls reached
  useEffect(() => {
    if (!merchantTradeNo) return;
    if (data?.status === "paid" || data?.status === "failed") return;
    if (pollCount >= maxPolls) return;

    const timer = setTimeout(() => {
      setPollCount((c) => c + 1);
      refetch();
    }, 2000);

    return () => clearTimeout(timer);
  }, [data, pollCount, merchantTradeNo, refetch]);

  // Read cart data from sessionStorage
  const cartDataRaw = sessionStorage.getItem("yingli_ecpay_cart");
  const cartData = cartDataRaw ? JSON.parse(cartDataRaw) : null;

  const isPaid = data?.status === "paid";
  const isFailed = data?.status === "failed";
  const isPending = !isPaid && !isFailed;

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.970 0.012 80)" }}>
      <Navbar />
      <main className="container pt-32 pb-24 max-w-2xl mx-auto">
        {/* Loading / Pending */}
        {(isLoading || (isPending && pollCount < maxPolls)) && (
          <div className="text-center py-20">
            <div
              className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-6"
              style={{ borderColor: `${accentGreen} transparent transparent transparent` }}
            />
            <p className="font-['Lato'] font-300 text-sm" style={{ color: "oklch(0.520 0.020 60)" }}>
              正在確認付款狀態，請稍候...
            </p>
          </div>
        )}

        {/* Timeout — still pending after max polls */}
        {isPending && pollCount >= maxPolls && !isLoading && (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: "#FAFAF7", border: "1px solid oklch(0.870 0.018 130)" }}
          >
            <div className="text-4xl mb-4">⏳</div>
            <h1
              className="font-['Playfair_Display'] font-400 text-2xl mb-3"
              style={{ color: "oklch(0.265 0.015 55)" }}
            >
              付款確認中
            </h1>
            <p className="font-['Lato'] font-300 text-sm mb-6" style={{ color: "oklch(0.520 0.020 60)" }}>
              您的付款正在處理中，請稍後再確認。如已完成付款，訂單將在數分鐘內確認。
              <br />
              訂單編號：<strong>{merchantTradeNo}</strong>
            </p>
            <p className="font-['Lato'] font-300 text-xs mb-6" style={{ color: "oklch(0.550 0.020 60)" }}>
              如有疑問請聯絡 yinglitea@gmail.com
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300 rounded"
              style={{ background: accentGreen, color: "#FAFAF7" }}
            >
              返回首頁
            </Link>
          </div>
        )}

        {/* Success */}
        {isPaid && (
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid oklch(0.870 0.018 130)", background: "#FAFAF7" }}
          >
            {/* Header */}
            <div
              className="px-8 py-6"
              style={{ background: "oklch(0.265 0.015 55)" }}
            >
              <div className="text-3xl mb-2">✓</div>
              <h1
                className="font-['Playfair_Display'] font-400 text-2xl"
                style={{ color: "oklch(0.960 0.010 90)" }}
              >
                付款成功！
              </h1>
              <p className="font-['Lato'] font-300 text-sm mt-1" style={{ color: "oklch(0.780 0.015 80)" }}>
                訂單編號：{merchantTradeNo}
                {data?.paymentDate && ` ｜ ${data.paymentDate}`}
              </p>
            </div>

            <div className="px-8 py-6">
              <p className="font-['Lato'] font-300 text-sm mb-6" style={{ color: "oklch(0.520 0.020 60)" }}>
                感謝您的訂購！我們已收到您的付款，<strong>預計1至3個工作日到貨</strong>。
                {cartData?.fullName && ` 確認通知將發送至您填寫的 Email。`}
              </p>

              {/* Order items */}
              {cartData?.items && (
                <div className="mb-6">
                  <h2
                    className="font-['Lato'] font-600 text-xs tracking-[0.1em] uppercase mb-3"
                    style={{ color: "oklch(0.380 0.060 145)" }}
                  >
                    訂購商品
                  </h2>
                  <div className="flex flex-col gap-2">
                    {cartData.items.map((item: { name: string; quantity: number; price: number }, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="font-['Lato'] font-300" style={{ color: "oklch(0.265 0.015 55)" }}>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-['Lato'] font-400" style={{ color: "oklch(0.520 0.020 60)" }}>
                          NT${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="flex justify-between pt-3 mt-2 text-sm font-['Lato'] font-600"
                    style={{ borderTop: "1px solid oklch(0.870 0.018 130)", color: "oklch(0.265 0.015 55)" }}
                  >
                    <span>總計</span>
                    <span style={{ color: accentGreen }}>
                      NT${cartData.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/"
                  className="flex-1 text-center py-3 text-xs font-['Lato'] font-500 tracking-[0.15em] uppercase transition-all duration-300 rounded"
                  style={{ background: accentGreen, color: "#FAFAF7" }}
                >
                  繼續購物
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Failed */}
        {isFailed && (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: "#FAFAF7", border: "1px solid oklch(0.870 0.018 130)" }}
          >
            <div className="text-4xl mb-4">✕</div>
            <h1
              className="font-['Playfair_Display'] font-400 text-2xl mb-3"
              style={{ color: "oklch(0.265 0.015 55)" }}
            >
              付款未完成
            </h1>
            <p className="font-['Lato'] font-300 text-sm mb-2" style={{ color: "oklch(0.520 0.020 60)" }}>
              {data?.rtnMsg || "付款過程中發生問題，請重新嘗試。"}
            </p>
            <p className="font-['Lato'] font-300 text-xs mb-6" style={{ color: "oklch(0.550 0.020 60)" }}>
              如有疑問請聯絡 yinglitea@gmail.com
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/checkout"
                className="px-8 py-3 text-xs font-['Lato'] font-500 tracking-[0.15em] uppercase transition-all duration-300 rounded"
                style={{ background: accentGreen, color: "#FAFAF7" }}
              >
                重新結帳
              </Link>
              <Link
                to="/"
                className="px-8 py-3 text-xs font-['Lato'] font-400 tracking-[0.15em] uppercase transition-all duration-300 rounded"
                style={{ border: `1px solid ${accentGreen}`, color: accentGreen }}
              >
                返回首頁
              </Link>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="text-center py-20">
            <p className="font-['Lato'] font-300 text-sm" style={{ color: "oklch(0.700 0.200 27)" }}>
              無法取得訂單狀態，請聯絡客服。
            </p>
          </div>
        )}
      </main>
      <MiniFooter />
    </div>
  );
}
