/*
 * YING-LI TEA — ORDER HISTORY PAGE
 * Displays the authenticated user's past orders with date, items, and total.
 * Requires login; unauthenticated users are redirected to the login page.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import { getLoginUrl } from "@/const";

// Fallback map: product ID → nameKey for legacy items without nameKey
const PRODUCT_NAME_KEYS: Record<string, string> = {
  "1": "product.premium",
  "2": "product.coldBrew",
  "3": "product.entry",
  "4": "product.gift",
  "5": "product.specialty",
  "6": "product.loose",
};

interface OrderItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  nameKey?: string;
}

function parseItems(raw: string): OrderItem[] {
  try {
    return JSON.parse(raw) as OrderItem[];
  } catch {
    return [];
  }
}

function StatusBadge({ status, language }: { status: string; language: string }) {
  const labels: Record<string, { en: string; zh: string; color: string }> = {
    completed: { en: "Completed", zh: "已完成", color: "oklch(0.500 0.060 145)" },
    pending:   { en: "Pending",   zh: "待處理",  color: "oklch(0.650 0.120 80)"  },
    failed:    { en: "Failed",    zh: "失敗",    color: "oklch(0.577 0.245 27)"  },
    cancelled: { en: "Cancelled", zh: "已取消",  color: "oklch(0.552 0.016 285)" },
  };
  const info = labels[status] ?? { en: status, zh: status, color: "oklch(0.552 0.016 285)" };
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs font-['Lato'] font-600 tracking-wide"
      style={{ background: `${info.color}22`, color: info.color, border: `1px solid ${info.color}44` }}
    >
      {language === "zh" ? info.zh : info.en}
    </span>
  );
}

export default function Orders() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const { formatPrice, convertPrice } = useCurrency();

  const { data: orders, isLoading: ordersLoading, error } = trpc.stripe.getOrderHistory.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "oklch(0.500 0.060 145)", borderTopColor: "transparent" }} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
        <Navbar />
        <div className="container pt-32 pb-24 flex flex-col items-center gap-6 text-center">
          <h1
            className="font-['Playfair_Display'] font-400"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "oklch(0.265 0.015 55)" }}
          >
            {language === "zh" ? "請先登入" : "Please Sign In"}
          </h1>
          <p className="font-['Lato'] font-300 max-w-md" style={{ color: "oklch(0.520 0.020 60)" }}>
            {language === "zh"
              ? "您需要登入才能查看訂單記錄。"
              : "You need to be signed in to view your order history."}
          </p>
          <a
            href={getLoginUrl()}
            className="px-8 py-3 text-sm font-['Lato'] font-500 tracking-[0.12em] uppercase transition-all duration-300"
            style={{ background: "oklch(0.500 0.060 145)", color: "#FAFAF7", borderRadius: "2px" }}
          >
            {language === "zh" ? "登入" : "Sign In"}
          </a>
        </div>
      </div>
    );
  }

  // ── Main content ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
      <Navbar />

      <main className="container pt-28 pb-24">
        {/* Page header */}
        <div className="mb-10">
          <span
            className="eyebrow block mb-3"
            style={{ color: "oklch(0.500 0.060 145)" }}
          >
            {language === "zh" ? "帳戶" : "Account"}
          </span>
          <h1
            className="font-['Playfair_Display'] font-400"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "oklch(0.265 0.015 55)" }}
          >
            {language === "zh" ? "訂單記錄" : "Order History"}
          </h1>
          {user?.name && (
            <p className="font-['Lato'] font-300 mt-2" style={{ color: "oklch(0.520 0.020 60)" }}>
              {language === "zh" ? `歡迎，${user.name}` : `Welcome back, ${user.name}`}
            </p>
          )}
        </div>

        {/* Back to shop link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-['Lato'] font-400 mb-10 transition-colors duration-300"
          style={{ color: "oklch(0.500 0.060 145)" }}
        >
          ← {language === "zh" ? "繼續購物" : "Continue Shopping"}
        </Link>

        {/* Loading state */}
        {ordersLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "oklch(0.500 0.060 145)", borderTopColor: "transparent" }} />
          </div>
        )}

        {/* Error state */}
        {error && !ordersLoading && (
          <div
            className="p-6 rounded-lg text-center"
            style={{ background: "oklch(0.970 0.010 27)", border: "1px solid oklch(0.900 0.040 27)" }}
          >
            <p className="font-['Lato'] font-400" style={{ color: "oklch(0.577 0.245 27)" }}>
              {language === "zh" ? "無法載入訂單。請稍後再試。" : "Unable to load orders. Please try again later."}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!ordersLoading && !error && orders && orders.length === 0 && (
          <div
            className="py-24 flex flex-col items-center gap-6 text-center rounded-lg"
            style={{ background: "oklch(0.980 0.005 90)", border: "1px solid oklch(0.900 0.010 90)" }}
          >
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "oklch(0.730 0.040 90)" }}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <div>
              <h2
                className="font-['Playfair_Display'] font-400 text-xl mb-2"
                style={{ color: "oklch(0.265 0.015 55)" }}
              >
                {language === "zh" ? "尚無訂單" : "No Orders Yet"}
              </h2>
              <p className="font-['Lato'] font-300 text-sm max-w-xs" style={{ color: "oklch(0.520 0.020 60)" }}>
                {language === "zh"
                  ? "您的訂單記錄將在此顯示。"
                  : "Your order history will appear here once you make a purchase."}
              </p>
            </div>
            <Link
              to="/"
              className="px-8 py-3 text-xs font-['Lato'] font-500 tracking-[0.15em] uppercase transition-all duration-300 border"
              style={{ color: "oklch(0.500 0.060 145)", borderColor: "oklch(0.500 0.060 145)", borderRadius: "2px" }}
            >
              {language === "zh" ? "立即購買" : "Shop Now"}
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!ordersLoading && !error && orders && orders.length > 0 && (
          <div className="flex flex-col gap-6">
            {[...orders].reverse().map((order) => {
              const items = parseItems(order.items);
              const date = new Date(order.createdAt).toLocaleDateString(
                language === "zh" ? "zh-TW" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              );
              const convertedTotal = convertPrice(parseFloat(order.totalAmount));

              return (
                <div
                  key={order.id}
                  className="rounded-lg overflow-hidden"
                  style={{ border: "1px solid oklch(0.870 0.018 130)", background: "#FAFAF7" }}
                >
                  {/* Order header */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
                    style={{ background: "oklch(0.975 0.006 90)", borderBottom: "1px solid oklch(0.870 0.018 130)" }}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase" style={{ color: "oklch(0.550 0.020 60)" }}>
                        {language === "zh" ? "訂單編號" : "Order ID"}
                      </span>
                      <span className="font-['Lato'] font-600 text-sm" style={{ color: "oklch(0.265 0.015 55)" }}>
                        #{order.id}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase" style={{ color: "oklch(0.550 0.020 60)" }}>
                        {language === "zh" ? "日期" : "Date"}
                      </span>
                      <span className="font-['Lato'] font-400 text-sm" style={{ color: "oklch(0.265 0.015 55)" }}>
                        {date}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase" style={{ color: "oklch(0.550 0.020 60)" }}>
                        {language === "zh" ? "總計" : "Total"}
                      </span>
                      <span className="font-['Lato'] font-600 text-sm" style={{ color: "oklch(0.500 0.060 145)" }}>
                        {formatPrice(convertedTotal)}
                      </span>
                    </div>
                    <StatusBadge status={order.status} language={language} />
                  </div>

                  {/* Order items */}
                  <div className="px-6 py-4">
                    <p className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase mb-3" style={{ color: "oklch(0.550 0.020 60)" }}>
                      {language === "zh" ? "商品" : "Items"}
                    </p>
                    <div className="flex flex-col gap-3">
                      {items.map((item, idx) => {
                        const nameKey = item.nameKey ?? PRODUCT_NAME_KEYS[String(item.productId)];
                        const displayName = nameKey ? t(nameKey) : item.name;
                        const convertedItemPrice = convertPrice(item.price);
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-4 py-2"
                            style={{ borderBottom: idx < items.length - 1 ? "1px solid oklch(0.920 0.010 90)" : "none" }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-['Lato'] font-600 flex-shrink-0"
                                style={{ background: "oklch(0.500 0.060 145)", color: "#FAFAF7" }}
                              >
                                {item.quantity}
                              </span>
                              <span className="font-['Lato'] font-400 text-sm truncate" style={{ color: "oklch(0.265 0.015 55)" }}>
                                {displayName}
                              </span>
                            </div>
                            <span className="font-['Lato'] font-400 text-sm flex-shrink-0" style={{ color: "oklch(0.520 0.020 60)" }}>
                              {formatPrice(convertPrice(item.price * item.quantity))}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
