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

const SHIPPING_THRESHOLD = 2000; // TWD
const SHIPPING_FEE = 130; // TWD

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

  const submitOrder = trpc.order.submitOrder.useMutation();

  // Shipping fee: 7-11 always free; home delivery free if total >= NT$2000
  const shippingFee = (deliveryMethod: string) => {
    if (deliveryMethod === "711") return 0;
    return total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  };
  const currentShipping = shippingFee(form.deliveryMethod);
  const grandTotal = total + currentShipping;

  // ── Validation ────────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = t("checkout.errNameRequired");
    if (!form.gender) errs.gender = t("checkout.errGenderRequired");
    if (!form.phone.trim() || form.phone.trim().length < 8) errs.phone = t("checkout.errPhoneInvalid");
    if (!form.deliveryMethod) errs.deliveryMethod = t("checkout.errDeliveryRequired");
    if (form.deliveryMethod === "home" && !form.address.trim())
      errs.address = t("checkout.errAddressRequired");
    if (form.deliveryMethod === "711" && !form.storeCode.trim())
      errs.storeCode = t("checkout.errStoreRequired");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error(t("checkout.errCartEmpty"));
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
        totalAmount: grandTotal,
        shippingFee: currentShipping,
      });

      // Navigate to confirmation page with order data
      const confirmationData = {
        orderId: result.orderId,
        method: form.deliveryMethod,
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        storeCode: form.storeCode,
        items: items.map((item) => ({
          name: item.nameKey ? t(item.nameKey) : item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: total,
        shippingFee: currentShipping,
        totalAmount: grandTotal,
      };
      const encodedData = encodeURIComponent(JSON.stringify(confirmationData));
      navigate(`/order-confirmation?orderId=${result.orderId}&method=${form.deliveryMethod}&data=${encodedData}`);
      clearCart();
    } catch (err: any) {
      toast.error(t("checkout.errSubmitFailed"), {
        description: err?.message ?? t("checkout.errUnknown"),
      });
    }
  }

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
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
            {t("checkout.emptyCart")}
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300"
            style={{ background: accentGreen, color: "#FAFAF7" }}
          >
            {t("checkout.backToShop")}
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
              {t("checkout.badge")}
            </span>
            <h1
              className="font-['Playfair_Display'] font-400"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "oklch(0.265 0.015 55)" }}
            >
              {t("checkout.title")}
            </h1>
            <p
              className="font-['Lato'] font-300 mt-2"
              style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
            >
              {t("checkout.subtitle")}
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
                    {t("checkout.customerInfo")}
                  </h2>

                  {/* Full name */}
                  <div className="mb-4">
                    <label htmlFor="fullName" className={labelBase} style={{ color: accentGreen }}>
                      {t("checkout.fullName")} *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      placeholder={t("checkout.fullNamePlaceholder")}
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
                      {t("checkout.gender")} *
                    </label>
                    <div className="flex gap-3">
                      {([
                        { value: "male", label: t("checkout.genderMale") },
                        { value: "female", label: t("checkout.genderFemale") },
                        { value: "other", label: t("checkout.genderOther") },
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
                      {t("checkout.phone")} *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder={t("checkout.phonePlaceholder")}
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
                    {t("checkout.deliveryMethod")}
                  </h2>

                  {/* Delivery method selector */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-5">
                    {([
                      {
                        value: "home",
                        title: t("checkout.deliveryHomeTitle"),
                        desc: t("checkout.deliveryHomeDesc"),
                      },
                      {
                        value: "711",
                        title: t("checkout.delivery711Title"),
                        desc: t("checkout.delivery711Desc"),
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
                        {t("checkout.address")} *
                      </label>
                      <input
                        id="address"
                        type="text"
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        placeholder={t("checkout.addressPlaceholder")}
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
                        {t("checkout.storeCode")} *
                      </label>
                      <input
                        id="storeCode"
                        type="text"
                        value={form.storeCode}
                        onChange={(e) => set("storeCode", e.target.value)}
                        placeholder={t("checkout.storeCodePlaceholder")}
                        className={inputBase}
                        style={{ border: errors.storeCode ? borderError : borderDefault }}
                        onFocus={(e) => { (e.currentTarget as HTMLElement).style.border = borderFocus; }}
                        onBlur={(e) => { (e.currentTarget as HTMLElement).style.border = errors.storeCode ? borderError : borderDefault; }}
                      />
                      <p
                        className="text-xs font-['Lato'] font-300 mt-1"
                        style={{ color: "oklch(0.550 0.020 60)" }}
                      >
                        {t("checkout.storeCodeHelp")}
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
                    {t("checkout.note")}
                  </h2>
                  <textarea
                    value={form.note}
                    onChange={(e) => set("note", e.target.value)}
                    placeholder={t("checkout.notePlaceholder")}
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
                      {t("checkout.summary")}
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
                        {t("checkout.subtotal")}
                      </span>
                      <span className="font-['Lato'] font-400" style={{ color: "oklch(0.265 0.015 55)" }}>
                        {formatPrice(convertPrice(total))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-['Lato'] font-300" style={{ color: "oklch(0.520 0.020 60)" }}>
                        {t("checkout.shipping")}
                      </span>
                      <span className="font-['Lato'] font-400" style={{ color: currentShipping === 0 ? accentGreen : "oklch(0.265 0.015 55)" }}>
                        {currentShipping === 0
                          ? t("checkout.shippingFree")
                          : `NT$${currentShipping}`}
                      </span>
                    </div>
                    {form.deliveryMethod === "home" && total < 2000 && (
                      <p className="text-xs font-['Lato'] font-300" style={{ color: "oklch(0.550 0.020 60)" }}>
                        滿 NT$2,000 免運（還差 NT${(2000 - total).toLocaleString()}）
                      </p>
                    )}
                    {form.deliveryMethod === "home" && total >= 2000 && (
                      <p className="text-xs font-['Lato'] font-300" style={{ color: accentGreen }}>
                        ✓ 已達免運門溻！
                      </p>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="font-['Lato'] font-300" style={{ color: "oklch(0.520 0.020 60)" }}>
                        {t("checkout.paymentMethod")}
                      </span>
                      <span className="font-['Lato'] font-400" style={{ color: "oklch(0.265 0.015 55)" }}>
                        {t("checkout.paymentCod")}
                      </span>
                    </div>
                    <div
                      className="flex justify-between pt-3 mt-1"
                      style={{ borderTop: "1px solid oklch(0.870 0.018 130)" }}
                    >
                      <span className="font-['Lato'] font-600 text-sm" style={{ color: "oklch(0.265 0.015 55)" }}>
                        {t("checkout.total")}
                      </span>
                      <span
                        className="font-['Playfair_Display'] font-400 text-xl"
                        style={{ color: accentGreen }}
                      >
                        NT${grandTotal.toLocaleString()}
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
                      {submitOrder.isPending ? t("checkout.submitting") : t("checkout.submit")}
                    </button>
                    <p
                      className="text-xs font-['Lato'] font-300 text-center mt-3"
                      style={{ color: "oklch(0.550 0.020 60)" }}
                    >
                      {t("checkout.submitHint")}
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
                    {t("checkout.continueShopping")}
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
