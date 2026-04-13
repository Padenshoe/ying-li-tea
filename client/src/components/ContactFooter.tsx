/*
 * YING-LI TEA — CONTACT & FOOTER
 * Design: Warm charcoal background (dark section) for contrast.
 * Light cream text on dark background.
 * Contact info, real address with interactive Google Maps embed,
 * and a functional inquiry form that notifies the store owner.
 */
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/logo-with-text_660e5e0b.png";

// Real Ying-Li Tea location in Taichung, Taiwan
const STORE_ADDRESS_EN = "No. 135, Yongchun E Rd, Nantun District, Taichung City, Taiwan 40855";
const STORE_ADDRESS_ZH = "台灣台中市南屯區永春東路135號";
const STORE_PHONE = "+886 4 3704 2800";
const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/%E8%BF%8E%E5%88%A9%E8%8C%B6%E8%91%89+%E8%8C%B6%E8%91%89%E9%80%81%E7%A6%AE/@24.1347331,120.6523198,17z";
const MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3641.0!2d120.6523198!3d24.1347331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d3da9bb8229%3A0x6cc77d197ddb462!2z6L-I5Yip6Iy25pmu!5e0!3m2!1szh-TW!2stw!4v1700000000000!5m2!1szh-TW!2stw";

// ── Input / Textarea shared style helpers ────────────────────────────────────
const inputBase =
  "w-full font-['Lato'] font-300 text-sm rounded px-4 py-3 outline-none transition-all duration-300";

export default function ContactFooter() {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  // Form state
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.contact.submitInquiry.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      toast.success(language === "zh" ? "訊息已發送！我們會盡快回覆您。" : "Message sent! We'll get back to you soon.");
    },
    onError: () => {
      toast.error(language === "zh" ? "發送失敗，請稍後再試。" : "Failed to send. Please try again later.");
    },
  });

  // Intersection observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const storeAddress = language === "zh" ? STORE_ADDRESS_ZH : STORE_ADDRESS_EN;

  // ── Validation ───────────────────────────────────────────────────────────
  function validate() {
    const e: typeof errors = {};
    if (!form.name.trim()) {
      e.name = language === "zh" ? "請輸入您的姓名" : "Name is required";
    }
    if (!form.email.trim()) {
      e.email = language === "zh" ? "請輸入電郵地址" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = language === "zh" ? "請輸入有效的電郵地址" : "Please enter a valid email address";
    }
    if (!form.message.trim()) {
      e.message = language === "zh" ? "請輸入您的訊息" : "Message is required";
    } else if (form.message.trim().length < 10) {
      e.message = language === "zh" ? "訊息至少需要10個字元" : "Message must be at least 10 characters";
    }
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    submitMutation.mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
  }

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitted) setSubmitted(false);
  }

  return (
    <>
      {/* Contact Section */}
      <section
        id="contact"
        ref={sectionRef}
        className="py-24 md:py-36"
        style={{ background: "oklch(0.265 0.015 55)" }}
      >
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            {/* Left — Heading + Map + Contact Info */}
            <div className="flex flex-col gap-6">
              <span
                className="eyebrow reveal"
                style={{ color: "oklch(0.730 0.070 75)" }}
              >
                {t("contact.label")}
              </span>
              <div
                className="divider-short reveal"
                style={{ background: "oklch(0.730 0.070 75)" }}
              />
              <h2
                className="font-['Playfair_Display'] font-400 reveal"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  color: "oklch(0.962 0.008 90)",
                  lineHeight: 1.15,
                }}
              >
                {t("contact.title")}
              </h2>
              <p
                className="font-['Lato'] font-300 leading-loose reveal"
                style={{ fontSize: "0.9375rem", color: "oklch(0.780 0.010 60)" }}
              >
                {t("contact.description")}
              </p>

              {/* Interactive Google Map */}
              <div className="reveal mt-2 rounded-lg overflow-hidden" style={{ border: "1px solid oklch(0.380 0.015 55)" }}>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group"
                  aria-label="View on Google Maps"
                >
                  <iframe
                    title="Ying-Li Tea Location"
                    src={MAPS_EMBED_URL}
                    width="100%"
                    height="240"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "oklch(0.265 0.015 55 / 0.6)" }}
                  >
                    <span
                      className="font-['Lato'] font-400 tracking-[0.1em] uppercase text-sm px-4 py-2 rounded"
                      style={{ color: "oklch(0.962 0.008 90)", background: "oklch(0.400 0.060 75)" }}
                    >
                      {language === "zh" ? "在 Google 地圖上查看" : "View on Google Maps"}
                    </span>
                  </div>
                </a>
              </div>

              {/* Address */}
              <div className="reveal flex flex-col gap-2">
                <span className="eyebrow" style={{ color: "oklch(0.730 0.070 75)" }}>
                  {language === "zh" ? "地址" : "Address"}
                </span>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-['Lato'] font-300 leading-relaxed transition-colors duration-300"
                  style={{ fontSize: "0.9375rem", color: "oklch(0.840 0.008 90)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.730 0.070 75)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.840 0.008 90)"; }}
                >
                  {storeAddress}
                </a>
              </div>

              <div className="reveal divider-line" style={{ background: "oklch(0.400 0.015 55)" }} />

              {/* Phone */}
              <div className="reveal flex flex-col gap-2">
                <span className="eyebrow" style={{ color: "oklch(0.730 0.070 75)" }}>
                  {language === "zh" ? "電話" : "Phone"}
                </span>
                <a
                  href={`tel:${STORE_PHONE}`}
                  className="font-['Playfair_Display'] font-400 transition-colors duration-300"
                  style={{ fontSize: "1.125rem", color: "oklch(0.962 0.008 90)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.730 0.070 75)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.962 0.008 90)"; }}
                >
                  {STORE_PHONE}
                </a>
              </div>

              <div className="reveal divider-line" style={{ background: "oklch(0.400 0.015 55)" }} />

              {/* Email */}
              <div className="reveal flex flex-col gap-2">
                <span className="eyebrow" style={{ color: "oklch(0.730 0.070 75)" }}>
                  {t("contact.email")}
                </span>
                <a
                  href="mailto:yinglitea@gmail.com"
                  className="font-['Playfair_Display'] font-400 transition-colors duration-300"
                  style={{ fontSize: "1.125rem", color: "oklch(0.962 0.008 90)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.730 0.070 75)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.962 0.008 90)"; }}
                >
                  yinglitea@gmail.com
                </a>
              </div>

              <div className="reveal divider-line" style={{ background: "oklch(0.400 0.015 55)" }} />

              {/* Social Links */}
              <div className="reveal flex flex-col gap-2">
                <span className="eyebrow" style={{ color: "oklch(0.730 0.070 75)" }}>
                  {t("contact.followUs")}
                </span>
                <div className="flex gap-5 mt-1">
                  <a
                    href="https://www.instagram.com/yinglitea/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-['Lato'] font-400 tracking-[0.12em] uppercase transition-colors duration-300"
                    style={{ color: "oklch(0.600 0.010 60)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.730 0.070 75)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.600 0.010 60)"; }}
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.facebook.com/yinglitea?locale=zh_TW"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-['Lato'] font-400 tracking-[0.12em] uppercase transition-colors duration-300"
                    style={{ color: "oklch(0.600 0.010 60)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.730 0.070 75)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.600 0.010 60)"; }}
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>

            {/* Right — Contact Form */}
            <div className="flex flex-col gap-6 justify-start">
              <div className="reveal">
                <span className="eyebrow block mb-3" style={{ color: "oklch(0.730 0.070 75)" }}>
                  {language === "zh" ? "發送訊息" : "Send a Message"}
                </span>
                <div className="divider-short mb-6" style={{ background: "oklch(0.730 0.070 75)" }} />
                <h3
                  className="font-['Playfair_Display'] font-400 mb-2"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "oklch(0.962 0.008 90)", lineHeight: 1.2 }}
                >
                  {language === "zh" ? "有任何問題嗎？" : "Have a Question?"}
                </h3>
                <p
                  className="font-['Lato'] font-300 leading-loose mb-6"
                  style={{ fontSize: "0.9375rem", color: "oklch(0.780 0.010 60)" }}
                >
                  {language === "zh"
                    ? "填寫以下表格，我們將盡快回覆您。"
                    : "Fill out the form below and we'll get back to you as soon as possible."}
                </p>
              </div>

              {/* Success state */}
              {submitted && (
                <div
                  className="reveal p-5 rounded-lg flex items-start gap-3"
                  style={{ background: "oklch(0.500 0.060 145 / 0.15)", border: "1px solid oklch(0.500 0.060 145 / 0.4)" }}
                >
                  <span style={{ color: "oklch(0.700 0.060 145)", fontSize: "1.25rem" }}>✓</span>
                  <div>
                    <p className="font-['Lato'] font-600 text-sm" style={{ color: "oklch(0.700 0.060 145)" }}>
                      {language === "zh" ? "訊息已發送！" : "Message Sent!"}
                    </p>
                    <p className="font-['Lato'] font-300 text-sm mt-1" style={{ color: "oklch(0.780 0.010 60)" }}>
                      {language === "zh" ? "感謝您的來信，我們會盡快回覆。" : "Thank you for reaching out. We'll be in touch soon."}
                    </p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="reveal flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-name"
                    className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase"
                    style={{ color: "oklch(0.730 0.070 75)" }}
                  >
                    {language === "zh" ? "姓名" : "Name"} *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder={language === "zh" ? "您的姓名" : "Your name"}
                    className={inputBase}
                    style={{
                      background: "oklch(0.320 0.015 55)",
                      color: "oklch(0.962 0.008 90)",
                      border: errors.name ? "1px solid oklch(0.700 0.200 27)" : "1px solid oklch(0.400 0.015 55)",
                    }}
                    onFocus={(e) => { (e.currentTarget as HTMLElement).style.border = "1px solid oklch(0.730 0.070 75)"; }}
                    onBlur={(e) => { (e.currentTarget as HTMLElement).style.border = errors.name ? "1px solid oklch(0.700 0.200 27)" : "1px solid oklch(0.400 0.015 55)"; }}
                  />
                  {errors.name && (
                    <span className="text-xs font-['Lato']" style={{ color: "oklch(0.700 0.200 27)" }}>
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-email"
                    className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase"
                    style={{ color: "oklch(0.730 0.070 75)" }}
                  >
                    {language === "zh" ? "電郵" : "Email"} *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder={language === "zh" ? "您的電郵地址" : "your@email.com"}
                    className={inputBase}
                    style={{
                      background: "oklch(0.320 0.015 55)",
                      color: "oklch(0.962 0.008 90)",
                      border: errors.email ? "1px solid oklch(0.700 0.200 27)" : "1px solid oklch(0.400 0.015 55)",
                    }}
                    onFocus={(e) => { (e.currentTarget as HTMLElement).style.border = "1px solid oklch(0.730 0.070 75)"; }}
                    onBlur={(e) => { (e.currentTarget as HTMLElement).style.border = errors.email ? "1px solid oklch(0.700 0.200 27)" : "1px solid oklch(0.400 0.015 55)"; }}
                  />
                  {errors.email && (
                    <span className="text-xs font-['Lato']" style={{ color: "oklch(0.700 0.200 27)" }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-['Lato'] font-400 tracking-[0.1em] uppercase"
                    style={{ color: "oklch(0.730 0.070 75)" }}
                  >
                    {language === "zh" ? "訊息" : "Message"} *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder={language === "zh" ? "請輸入您的訊息…" : "Tell us how we can help…"}
                    className={`${inputBase} resize-none`}
                    style={{
                      background: "oklch(0.320 0.015 55)",
                      color: "oklch(0.962 0.008 90)",
                      border: errors.message ? "1px solid oklch(0.700 0.200 27)" : "1px solid oklch(0.400 0.015 55)",
                    }}
                    onFocus={(e) => { (e.currentTarget as HTMLElement).style.border = "1px solid oklch(0.730 0.070 75)"; }}
                    onBlur={(e) => { (e.currentTarget as HTMLElement).style.border = errors.message ? "1px solid oklch(0.700 0.200 27)" : "1px solid oklch(0.400 0.015 55)"; }}
                  />
                  {errors.message && (
                    <span className="text-xs font-['Lato']" style={{ color: "oklch(0.700 0.200 27)" }}>
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full py-3 text-xs font-['Lato'] font-500 tracking-[0.15em] uppercase transition-all duration-300 border-none cursor-pointer rounded disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "oklch(0.500 0.060 145)", color: "#FAFAF7" }}
                  onMouseEnter={(e) => { if (!submitMutation.isPending) (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  {submitMutation.isPending
                    ? (language === "zh" ? "發送中…" : "Sending…")
                    : (language === "zh" ? "發送訊息" : "Send Message")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{ background: "oklch(0.220 0.012 55)", borderTop: "1px solid oklch(0.320 0.012 55)" }}
      >
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand with Logo */}
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="Ying-Li Logo" className="w-8 h-auto" />
            <div className="flex flex-col gap-0.5">
              <span
                className="font-['Playfair_Display'] font-400 text-lg tracking-wide"
                style={{ color: "oklch(0.840 0.008 90)" }}
              >
                Ying-Li
              </span>
              <span
                className="eyebrow"
                style={{ color: "oklch(0.500 0.010 90)", letterSpacing: "0.18em" }}
              >
                Taiwanese Tea
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex gap-6">
            {[
              { label: "Home",  key: "nav.home"  },
              { label: "About", key: "nav.about" },
              { label: "Shop",  key: "nav.shop"  },
              { label: "FAQ",   key: "nav.faq"   },
            ].map((item) => (
              <a
                key={item.label}
                href={`#${item.label.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.querySelector(
                    `#${item.label === "Shop" ? "products" : item.label.toLowerCase()}`
                  );
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs font-['Lato'] font-400 tracking-[0.12em] uppercase transition-colors duration-300"
                style={{ color: "oklch(0.500 0.010 90)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.730 0.070 75)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.500 0.010 90)"; }}
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p
            className="text-xs font-['Lato'] font-300 tracking-wide"
            style={{ color: "oklch(0.440 0.010 90)" }}
          >
            © {new Date().getFullYear()} Ying-Li. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
