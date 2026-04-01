/*
 * YING-LI TEA — 結帳頁面
 * 自訂表單：姓名、性別、電話、配送方式（宅配/7-11 店到店）、地址/門市
 * 貨到付款，送出後通知店主
 */
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const inputBase =
  "w-full font-['Lato'] font-300 text-sm rounded px-4 py-3 outline-none transition-all duration-300 bg-[oklch(0.975_0.004_95)] text-[oklch(0.265_0.015_55)]";
const labelBase =
  "block text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase mb-1.5";
const accentGreen = "oklch(0.500 0.060 145)";
const borderDefault = "1px solid oklch(0.840 0.015 90)";
const borderFocus = `1px solid ${accentGreen}`;
const borderError = "1px solid oklch(0.700 0.200 27)";

interface FormState {
  fullName: string;
  gender: "male" | "female" | "other" | "";
  phone: string;
  deliveryMethod: "home" | "711" | "";
  address: string;
  storeCode: string;
  note: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <span className="text-xs font-['Lato'] mt-1 block" style={{ color: "oklch(0.700 0.200 27)" }}>
      {msg}
    </span>
  );
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { t } = useLanguage();
  const { formatPrice, convertPrice } = useCurrency();
  const [, navigate] = useLocation();

  const [form, setForm] = useState<FormState>({
    fullName: "",
    gender: "",
    phone: "",
    deliveryMethod: "",
    address: "",
    storeCode: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const submitOrder = trpc.order.submitOrder.useMutation();

  // ── Validation ────────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = "請填寫姓名";
    if (!form.gender) errs.gender = "請選擇性別";
    if (!form.phone.trim() || form.phone.trim().length < 8) errs.phone = "請填寫有效電話號碼";
    if (!form.deliveryMethod) errs.deliveryMethod = "請選擇配送方式";
    if (form.deliveryMethod === "home" && !form.address.trim())
      errs.address = "宅配需填寫收件地址";
    if (form.deliveryMethod === "711" && !form.storeCode.trim())
      errs.storeCode = "請填寫 7-11 門市名稱";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("購物車是空的，請先加入商品");
      return;
    }
    if (!validate()) return;

    try {
      const result = await submitOrder.mutateAsync({
        fullName: form.fullName.trim(),
        gender: form.gender as "male" | "female" | "other",
        phone: form.phone.trim(),
        deliveryMethod: form.deliveryMethod as "home" | "711",
        address: form.deliveryMethod === "home" ? form.address.trim() : undefined,
        storeCode: form.deliveryMethod === "711" ? form.storeCode.trim() : undefined,
        note: form.note.trim() || undefined,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          nameKey: item.nameKey,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: total,
      });

      setOrderId(result.orderId);
      setSubmitted(true);
      clearCart();
    } catch (err: any) {
      toast.error("訂單送出失敗，請稍後再試", {
        description: err?.message ?? "未知錯誤",
      });
    }
  }

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
        <Navbar />
        <main className="container pt-32 pb-24 max-w-xl mx-auto text-center">
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
            訂單已送出！
          </h1>
          <p
            className="font-['Lato'] font-300 leading-relaxed mb-2"
            style={{ fontSize: "1rem", color: "oklch(0.520 0.020 60)" }}
          >
            感謝您的訂購，我們已收到您的訂單。
          </p>
          {orderId && (
            <p
              className="font-['Lato'] font-600 mb-6"
              style={{ fontSize: "1rem", color: accentGreen }}
            >
              訂單編號：#{orderId}
            </p>
          )}
          <p
            className="font-['Lato'] font-300 leading-relaxed mb-10"
            style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
          >
            我們將盡快與您聯繫確認出貨事宜。如有疑問請來信{" "}
            <a
              href="mailto:yinglitea@gmail.com"
              style={{ color: accentGreen }}
            >
              yinglitea@gmail.com
            </a>
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

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
        <Navbar />
        <main className="container pt-32 pb-24 max-w-xl mx-auto text-center">
          <p
            className="font-['Lato'] font-300 mb-6"
            style={{ fontSize: "1rem", color: "oklch(0.520 0.020 60)" }}
          >
            購物車是空的，請先加入商品再結帳。
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300"
            style={{ background: accentGreen, color: "#FAFAF7" }}
          >
            返回選購
          </Link>
        </main>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
      <Navbar />

      <main className="container pt-28 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <span
              className="eyebrow block mb-3"
              style={{ color: accentGreen }}
            >
              結帳
            </span>
            <h1
              className="font-['Playfair_Display'] font-400"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "oklch(0.265 0.015 55)" }}
            >
              填寫訂購資料
            </h1>
            <p
              className="font-['Lato'] font-300 mt-2"
              style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
            >
              所有訂單均採貨到付款，請確認資料後送出。
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* ── Left: Form fields ── */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* Section: 客戶資料 */}
                <div
                  className="rounded-xl p-6"
                  style={{ background: "#FAFAF7", border: "1px solid oklch(0.870 0.018 130)" }}
                >
                  <h2
                    className="font-['Lato'] font-600 text-sm tracking-[0.08em] uppercase mb-5"
                    style={{ color: "oklch(0.265 0.015 55)" }}
                  >
                    客戶資料
                  </h2>

                  {/* Full name */}
                  <div className="mb-4">
                    <label htmlFor="fullName" className={labelBase} style={{ color: accentGreen }}>
                      姓名 *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      placeholder="例：陳小明"
                      className={inputBase}
                      style={{ border: errors.fullName ? borderError : borderDefault }}
                      onFocus={(e) => { (e.currentTarget as HTMLElement).style.border = borderFocus; }}
                      onBlur={(e) => { (e.currentTarget as HTMLElement).style.border = errors.fullName ? borderError : borderDefault; }}
                    />
                    <FieldError msg={errors.fullName} />
                  </div>

                  {/* Gender */}
                  <div className="mb-4">
                    <label className={labelBase} style={{ color: accentGreen }}>
                      性別 *
                    </label>
                    <div className="flex gap-3">
                      {([
                        { value: "male", label: "先生" },
                        { value: "female", label: "女士" },
                        { value: "other", label: "其他" },
                      ] as const).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => set("gender", opt.value)}
                          className="flex-1 py-2.5 text-sm font-['Lato'] font-400 rounded transition-all duration-200"
                          style={{
                            border: form.gender === opt.value ? `1.5px solid ${accentGreen}` : borderDefault,
                            background: form.gender === opt.value ? `${accentGreen}18` : "transparent",
                            color: form.gender === opt.value ? accentGreen : "oklch(0.520 0.020 60)",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <FieldError msg={errors.gender} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className={labelBase} style={{ color: accentGreen }}>
                      聯絡電話 *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="例：0912-345-678"
                      className={inputBase}
                      style={{ border: errors.phone ? borderError : borderDefault }}
                      onFocus={(e) => { (e.currentTarget as HTMLElement).style.border = borderFocus; }}
                      onBlur={(e) => { (e.currentTarget as HTMLElement).style.border = errors.phone ? borderError : borderDefault; }}
                    />
                    <FieldError msg={errors.phone} />
                  </div>
                </div>

                {/* Section: 配送方式 */}
                <div
                  className="rounded-xl p-6"
                  style={{ background: "#FAFAF7", border: "1px solid oklch(0.870 0.018 130)" }}
                >
                  <h2
                    className="font-['Lato'] font-600 text-sm tracking-[0.08em] uppercase mb-5"
                    style={{ color: "oklch(0.265 0.015 55)" }}
                  >
                    配送方式
                  </h2>

                  {/* Delivery method selector */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-5">
                    {([
                      {
                        value: "home",
                        title: "宅配（貨到付款）",
                        desc: "送到您指定的地址，收貨時付款",
                      },
                      {
                        value: "711",
                        title: "7-11 店到店（貨到付款）",
                        desc: "取貨時在門市付款，僅限 7-ELEVEN",
                      },
                    ] as const).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          set("deliveryMethod", opt.value);
                          // Clear the other field
                          if (opt.value === "home") set("storeCode", "");
                          else set("address", "");
                        }}
                        className="text-left p-4 rounded-lg transition-all duration-200"
                        style={{
                          border:
                            form.deliveryMethod === opt.value
                              ? `1.5px solid ${accentGreen}`
                              : borderDefault,
                          background:
                            form.deliveryMethod === opt.value
                              ? `${accentGreen}10`
                              : "transparent",
                        }}
                      >
                        <div
                          className="font-['Lato'] font-600 text-sm mb-1"
                          style={{
                            color:
                              form.deliveryMethod === opt.value
                                ? accentGreen
                                : "oklch(0.265 0.015 55)",
                          }}
                        >
                          {opt.title}
                        </div>
                        <div
                          className="font-['Lato'] font-300 text-xs leading-relaxed"
                          style={{ color: "oklch(0.550 0.020 60)" }}
                        >
                          {opt.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                  <FieldError msg={errors.deliveryMethod} />

                  {/* Home delivery address */}
                  {form.deliveryMethod === "home" && (
                    <div className="mt-2">
                      <label htmlFor="address" className={labelBase} style={{ color: accentGreen }}>
                        收件地址 *
                      </label>
                      <input
                        id="address"
                        type="text"
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        placeholder="例：台北市中正區忠孝東路一段1號"
                        className={inputBase}
                        style={{ border: errors.address ? borderError : borderDefault }}
                        onFocus={(e) => { (e.currentTarget as HTMLElement).style.border = borderFocus; }}
                        onBlur={(e) => { (e.currentTarget as HTMLElement).style.border = errors.address ? borderError : borderDefault; }}
                      />
                      <FieldError msg={errors.address} />
                    </div>
                  )}

                  {/* 7-11 store */}
                  {form.deliveryMethod === "711" && (
                    <div className="mt-2">
                      <label htmlFor="storeCode" className={labelBase} style={{ color: accentGreen }}>
                        7-11 門市名稱 *
                      </label>
                      <input
                        id="storeCode"
                        type="text"
                        value={form.storeCode}
                        onChange={(e) => set("storeCode", e.target.value)}
                        placeholder="例：台北忠孝門市"
                        className={inputBase}
                        style={{ border: errors.storeCode ? borderError : borderDefault }}
                        onFocus={(e) => { (e.currentTarget as HTMLElement).style.border = borderFocus; }}
                        onBlur={(e) => { (e.currentTarget as HTMLElement).style.border = errors.storeCode ? borderError : borderDefault; }}
                      />
                      <p
                        className="text-xs font-['Lato'] font-300 mt-1"
                        style={{ color: "oklch(0.550 0.020 60)" }}
                      >
                        請填寫您要取貨的 7-ELEVEN 門市全名，例如「台北忠孝門市」
                      </p>
                      <FieldError msg={errors.storeCode} />
                    </div>
                  )}
                </div>

                {/* Section: 備註 */}
                <div
                  className="rounded-xl p-6"
                  style={{ background: "#FAFAF7", border: "1px solid oklch(0.870 0.018 130)" }}
                >
                  <h2
                    className="font-['Lato'] font-600 text-sm tracking-[0.08em] uppercase mb-4"
                    style={{ color: "oklch(0.265 0.015 55)" }}
                  >
                    備註（選填）
                  </h2>
                  <textarea
                    value={form.note}
                    onChange={(e) => set("note", e.target.value)}
                    placeholder="如有特殊需求或說明，請在此填寫"
                    rows={3}
                    className={`${inputBase} resize-none`}
                    style={{ border: borderDefault }}
                    onFocus={(e) => { (e.currentTarget as HTMLElement).style.border = borderFocus; }}
                    onBlur={(e) => { (e.currentTarget as HTMLElement).style.border = borderDefault; }}
                  />
                </div>
              </div>

              {/* ── Right: Order summary ── */}
              <div className="lg:col-span-1">
                <div
                  className="rounded-xl overflow-hidden sticky top-28"
                  style={{ border: "1px solid oklch(0.870 0.018 130)", background: "#FAFAF7" }}
                >
                  {/* Header */}
                  <div
                    className="px-6 py-4"
                    style={{ background: "oklch(0.975 0.006 90)", borderBottom: "1px solid oklch(0.870 0.018 130)" }}
                  >
                    <h3
                      className="font-['Lato'] font-600 text-sm tracking-[0.08em] uppercase"
                      style={{ color: "oklch(0.265 0.015 55)" }}
                    >
                      訂單摘要
                    </h3>
                  </div>

                  {/* Items */}
                  <div className="px-6 py-4 flex flex-col gap-3">
                    {items.map((item) => {
                      const displayName = item.nameKey ? t(item.nameKey) : item.name;
                      return (
                        <div key={item.id} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-['Lato'] font-600 flex-shrink-0"
                              style={{ background: accentGreen, color: "#FAFAF7" }}
                            >
                              {item.quantity}
                            </span>
                            <span
                              className="font-['Lato'] font-400 text-sm truncate"
                              style={{ color: "oklch(0.265 0.015 55)" }}
                            >
                              {displayName}
                            </span>
                          </div>
                          <span
                            className="font-['Lato'] font-400 text-sm flex-shrink-0"
                            style={{ color: "oklch(0.520 0.020 60)" }}
                          >
                            {formatPrice(convertPrice(item.price * item.quantity))}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Totals */}
                  <div
                    className="px-6 py-4 flex flex-col gap-2"
                    style={{ borderTop: "1px solid oklch(0.870 0.018 130)" }}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-['Lato'] font-300" style={{ color: "oklch(0.520 0.020 60)" }}>
                        小計
                      </span>
                      <span className="font-['Lato'] font-400" style={{ color: "oklch(0.265 0.015 55)" }}>
                        {formatPrice(convertPrice(total))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-['Lato'] font-300" style={{ color: "oklch(0.520 0.020 60)" }}>
                        運費
                      </span>
                      <span className="font-['Lato'] font-400" style={{ color: accentGreen }}>
                        免費
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-['Lato'] font-300" style={{ color: "oklch(0.520 0.020 60)" }}>
                        付款方式
                      </span>
                      <span className="font-['Lato'] font-400" style={{ color: "oklch(0.265 0.015 55)" }}>
                        貨到付款
                      </span>
                    </div>
                    <div
                      className="flex justify-between pt-3 mt-1"
                      style={{ borderTop: "1px solid oklch(0.870 0.018 130)" }}
                    >
                      <span className="font-['Lato'] font-600 text-sm" style={{ color: "oklch(0.265 0.015 55)" }}>
                        總計
                      </span>
                      <span
                        className="font-['Playfair_Display'] font-400 text-xl"
                        style={{ color: accentGreen }}
                      >
                        {formatPrice(convertPrice(total))}
                      </span>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="px-6 pb-6">
                    <button
                      type="submit"
                      disabled={submitOrder.isPending}
                      className="w-full py-3.5 text-xs font-['Lato'] font-500 tracking-[0.15em] uppercase transition-all duration-300 rounded border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ background: accentGreen, color: "#FAFAF7" }}
                      onMouseEnter={(e) => {
                        if (!submitOrder.isPending)
                          (e.currentTarget as HTMLElement).style.opacity = "0.85";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.opacity = "1";
                      }}
                    >
                      {submitOrder.isPending ? "送出中…" : "確認送出訂單"}
                    </button>
                    <p
                      className="text-xs font-['Lato'] font-300 text-center mt-3"
                      style={{ color: "oklch(0.550 0.020 60)" }}
                    >
                      送出後我們將以電話或 Email 確認訂單
                    </p>
                  </div>
                </div>

                {/* Back link */}
                <div className="mt-4 text-center">
                  <Link
                    to="/"
                    className="text-xs font-['Lato'] font-400 tracking-[0.08em] transition-colors duration-300"
                    style={{ color: accentGreen }}
                  >
                    ← 繼續選購
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
