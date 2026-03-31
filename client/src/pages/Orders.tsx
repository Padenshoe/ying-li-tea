/*
 * YING-LI TEA — ORDER LOOKUP PAGE
 * Visitors enter their order number and last name to retrieve their order.
 * No login required. Matches case-insensitively on last name.
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";

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

const inputBase =
  "w-full font-['Lato'] font-300 text-sm rounded px-4 py-3 outline-none transition-all duration-300";

export default function Orders() {
  const { language, t } = useLanguage();
  const { formatPrice, convertPrice } = useCurrency();

  // Form state
  const [orderId, setOrderId] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<{ orderId?: string; lastName?: string }>({});

  // Parsed numeric ID used as query input — only set after a valid form submit
  const [queryInput, setQueryInput] = useState<{ orderId: number; lastName: string } | null>(null);

  const {
    data: order,
    isLoading,
    error,
    isFetching,
  } = trpc.stripe.lookupOrder.useQuery(queryInput!, {
    enabled: !!queryInput,
    retry: false,
  });

  // ── Validation ───────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: typeof formErrors = {};
    const parsed = parseInt(orderId, 10);
    if (!orderId.trim() || isNaN(parsed) || parsed <= 0) {
      errs.orderId =
        language === "zh" ? "請輸入有效的訂單編號" : "Please enter a valid order number";
    }
    if (!lastName.trim()) {
      errs.lastName =
        language === "zh" ? "請輸入您的姓氏" : "Please enter your last name";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setQueryInput({ orderId: parseInt(orderId, 10), lastName: lastName.trim() });
  }

  function handleReset() {
    setOrderId("");
    setLastName("");
    setSubmitted(false);
    setQueryInput(null);
    setFormErrors({});
  }

  const isNotFound =
    error?.data?.code === "NOT_FOUND" ||
    (error && !isLoading);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
      <Navbar />

      <main className="container pt-28 pb-24 max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-10">
          <span
            className="eyebrow block mb-3"
            style={{ color: "oklch(0.500 0.060 145)" }}
          >
            {language === "zh" ? "訂單查詢" : "Order Lookup"}
          </span>
          <h1
            className="font-['Playfair_Display'] font-400"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "oklch(0.265 0.015 55)" }}
          >
            {language === "zh" ? "查詢您的訂單" : "Find Your Order"}
          </h1>
          <p
            className="font-['Lato'] font-300 mt-3 leading-relaxed"
            style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
          >
            {language === "zh"
              ? "請輸入您的訂單編號和姓氏以查看訂單詳情。"
              : "Enter your order number and last name to view your order details."}
          </p>
        </div>

        {/* Back to shop */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-['Lato'] font-400 mb-10 transition-colors duration-300"
          style={{ color: "oklch(0.500 0.060 145)" }}
        >
          ← {language === "zh" ? "返回商店" : "Back to Shop"}
        </Link>

        {/* Lookup form */}
        <div
          className="rounded-xl p-8 mb-8"
          style={{ background: "#FAFAF7", border: "1px solid oklch(0.870 0.018 130)" }}
        >
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Order number */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="order-id"
                className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase"
                style={{ color: "oklch(0.500 0.060 145)" }}
              >
                {language === "zh" ? "訂單編號" : "Order Number"} *
              </label>
              <input
                id="order-id"
                type="number"
                min="1"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  if (formErrors.orderId)
                    setFormErrors((p) => ({ ...p, orderId: undefined }));
                  if (submitted) handleReset();
                }}
                placeholder={language === "zh" ? "例：1042" : "e.g. 1042"}
                className={inputBase}
                style={{
                  background: "oklch(0.975 0.004 95)",
                  color: "oklch(0.265 0.015 55)",
                  border: formErrors.orderId
                    ? "1px solid oklch(0.700 0.200 27)"
                    : "1px solid oklch(0.840 0.015 90)",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.border =
                    "1px solid oklch(0.500 0.060 145)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.border = formErrors.orderId
                    ? "1px solid oklch(0.700 0.200 27)"
                    : "1px solid oklch(0.840 0.015 90)";
                }}
              />
              {formErrors.orderId && (
                <span className="text-xs font-['Lato']" style={{ color: "oklch(0.700 0.200 27)" }}>
                  {formErrors.orderId}
                </span>
              )}
            </div>

            {/* Last name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="last-name"
                className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase"
                style={{ color: "oklch(0.500 0.060 145)" }}
              >
                {language === "zh" ? "姓氏" : "Last Name"} *
              </label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (formErrors.lastName)
                    setFormErrors((p) => ({ ...p, lastName: undefined }));
                  if (submitted) handleReset();
                }}
                placeholder={language === "zh" ? "例：陳" : "e.g. Chen"}
                className={inputBase}
                style={{
                  background: "oklch(0.975 0.004 95)",
                  color: "oklch(0.265 0.015 55)",
                  border: formErrors.lastName
                    ? "1px solid oklch(0.700 0.200 27)"
                    : "1px solid oklch(0.840 0.015 90)",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.border =
                    "1px solid oklch(0.500 0.060 145)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.border = formErrors.lastName
                    ? "1px solid oklch(0.700 0.200 27)"
                    : "1px solid oklch(0.840 0.015 90)";
                }}
              />
              {formErrors.lastName && (
                <span className="text-xs font-['Lato']" style={{ color: "oklch(0.700 0.200 27)" }}>
                  {formErrors.lastName}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || isFetching}
              className="w-full py-3 text-xs font-['Lato'] font-500 tracking-[0.15em] uppercase transition-all duration-300 border-none cursor-pointer rounded disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              style={{ background: "oklch(0.500 0.060 145)", color: "#FAFAF7" }}
              onMouseEnter={(e) => {
                if (!isLoading && !isFetching)
                  (e.currentTarget as HTMLElement).style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
            >
              {isLoading || isFetching
                ? language === "zh" ? "查詢中…" : "Looking up…"
                : language === "zh" ? "查詢訂單" : "Look Up Order"}
            </button>
          </form>
        </div>

        {/* Not found / error state */}
        {submitted && !isLoading && !isFetching && isNotFound && (
          <div
            className="p-6 rounded-xl flex items-start gap-3"
            style={{ background: "oklch(0.970 0.010 27)", border: "1px solid oklch(0.900 0.040 27)" }}
          >
            <span style={{ color: "oklch(0.577 0.245 27)", fontSize: "1.25rem", lineHeight: 1 }}>✕</span>
            <div>
              <p className="font-['Lato'] font-600 text-sm" style={{ color: "oklch(0.577 0.245 27)" }}>
                {language === "zh" ? "找不到訂單" : "Order Not Found"}
              </p>
              <p className="font-['Lato'] font-300 text-sm mt-1" style={{ color: "oklch(0.520 0.020 60)" }}>
                {language === "zh"
                  ? "請確認訂單編號和姓氏是否正確，然後再試一次。"
                  : "Please double-check your order number and last name, then try again."}
              </p>
            </div>
          </div>
        )}

        {/* Order result */}
        {submitted && !isLoading && !isFetching && order && (() => {
          const items = parseItems(order.items);
          const date = new Date(order.createdAt).toLocaleDateString(
            language === "zh" ? "zh-TW" : "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          );

          return (
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid oklch(0.870 0.018 130)", background: "#FAFAF7" }}
            >
              {/* Order header */}
              <div
                className="flex flex-wrap items-start justify-between gap-4 px-6 py-5"
                style={{ background: "oklch(0.975 0.006 90)", borderBottom: "1px solid oklch(0.870 0.018 130)" }}
              >
                <div>
                  <span className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase block mb-1" style={{ color: "oklch(0.550 0.020 60)" }}>
                    {language === "zh" ? "訂單編號" : "Order Number"}
                  </span>
                  <span className="font-['Lato'] font-600 text-base" style={{ color: "oklch(0.265 0.015 55)" }}>
                    #{order.id}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase block mb-1" style={{ color: "oklch(0.550 0.020 60)" }}>
                    {language === "zh" ? "日期" : "Date"}
                  </span>
                  <span className="font-['Lato'] font-400 text-sm" style={{ color: "oklch(0.265 0.015 55)" }}>
                    {date}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase block mb-1" style={{ color: "oklch(0.550 0.020 60)" }}>
                    {language === "zh" ? "總計" : "Total"}
                  </span>
                  <span className="font-['Lato'] font-600 text-base" style={{ color: "oklch(0.500 0.060 145)" }}>
                    {formatPrice(convertPrice(parseFloat(order.totalAmount)))}
                  </span>
                </div>
                <div className="flex items-end pb-0.5">
                  <StatusBadge status={order.status} language={language} />
                </div>
              </div>

              {/* Items */}
              <div className="px-6 py-5">
                <p className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase mb-4" style={{ color: "oklch(0.550 0.020 60)" }}>
                  {language === "zh" ? "訂購商品" : "Items Ordered"}
                </p>
                <div className="flex flex-col gap-3">
                  {items.map((item, idx) => {
                    const nameKey = item.nameKey ?? PRODUCT_NAME_KEYS[String(item.productId)];
                    const displayName = nameKey ? t(nameKey) : item.name;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-4 py-2"
                        style={{
                          borderBottom:
                            idx < items.length - 1
                              ? "1px solid oklch(0.920 0.010 90)"
                              : "none",
                        }}
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

                {/* Totals summary */}
                <div
                  className="mt-5 pt-4 flex justify-between items-center"
                  style={{ borderTop: "1px solid oklch(0.870 0.018 130)" }}
                >
                  <span className="font-['Lato'] font-400 text-sm" style={{ color: "oklch(0.520 0.020 60)" }}>
                    {language === "zh" ? "訂單總計" : "Order Total"}
                  </span>
                  <span className="font-['Playfair_Display'] font-400 text-lg" style={{ color: "oklch(0.500 0.060 145)" }}>
                    {formatPrice(convertPrice(parseFloat(order.totalAmount)))}
                  </span>
                </div>
              </div>

              {/* Look up another order */}
              <div
                className="px-6 py-4 flex justify-end"
                style={{ borderTop: "1px solid oklch(0.870 0.018 130)", background: "oklch(0.975 0.006 90)" }}
              >
                <button
                  onClick={handleReset}
                  className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase transition-colors duration-300"
                  style={{ color: "oklch(0.500 0.060 145)", background: "none", border: "none", cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  {language === "zh" ? "查詢其他訂單 →" : "Look up another order →"}
                </button>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}
