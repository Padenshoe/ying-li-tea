/*
 * YING-LI TEA — CONTACT & FOOTER
 * Design: Warm charcoal background (dark section) for contrast.
 * Light cream text on dark background.
 * Minimal contact info, social links, copyright.
 * Includes Logo in footer.
 */
import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/logo-with-text_660e5e0b.png";

export default function ContactFooter() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

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
            {/* Left — Heading */}
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
            </div>

            {/* Right — Contact Info */}
            <div className="flex flex-col gap-8 justify-center">
              {/* Email */}
              <div className="reveal flex flex-col gap-2">
                <span
                  className="eyebrow"
                  style={{ color: "oklch(0.730 0.070 75)" }}
                >
                  {t("contact.email")}
                </span>
                <a
                  href="mailto:yinglitea@gmail.com"
                  className="font-['Playfair_Display'] font-400 transition-colors duration-300"
                  style={{ fontSize: "1.125rem", color: "oklch(0.962 0.008 90)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "oklch(0.730 0.070 75)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "oklch(0.962 0.008 90)";
                  }}
                >
                  yinglitea@gmail.com
                </a>
              </div>

              {/* Divider */}
              <div
                className="reveal divider-line"
                style={{ background: "oklch(0.400 0.015 55)" }}
              />

              {/* Instagram */}
              <div className="reveal flex flex-col gap-2">
                <span
                  className="eyebrow"
                  style={{ color: "oklch(0.730 0.070 75)" }}
                >
                  {t("contact.instagram")}
                </span>
                <a
                  href="https://instagram.com/yinglitea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-['Playfair_Display'] font-400 transition-colors duration-300"
                  style={{ fontSize: "1.125rem", color: "oklch(0.962 0.008 90)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "oklch(0.730 0.070 75)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "oklch(0.962 0.008 90)";
                  }}
                >
                  @yinglitea
                </a>
              </div>

              {/* Divider */}
              <div
                className="reveal divider-line"
                style={{ background: "oklch(0.400 0.015 55)" }}
              />

              {/* Social Links Placeholder */}
              <div className="reveal flex flex-col gap-2">
                <span
                  className="eyebrow"
                  style={{ color: "oklch(0.730 0.070 75)" }}
                >
                  {t("contact.followUs")}
                </span>
                <div className="flex gap-5 mt-1">
                  {["Instagram", "Facebook", "Pinterest"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-xs font-['Lato'] font-400 tracking-[0.12em] uppercase transition-colors duration-300"
                      style={{ color: "oklch(0.600 0.010 60)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "oklch(0.730 0.070 75)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "oklch(0.600 0.010 60)";
                      }}
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
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
            <img
              src={LOGO}
              alt="Ying-Li Logo"
              className="w-8 h-auto"
            />
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
            {[{label: "Home", key: "nav.home"}, {label: "About", key: "nav.about"}, {label: "Shop", key: "nav.shop"}, {label: "FAQ", key: "nav.faq"}].map((item) => (
              <a
                key={item.label}
                href={`#${item.label.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.querySelector(`#${item.label === "Shop" ? "products" : item.label.toLowerCase()}`);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs font-['Lato'] font-400 tracking-[0.12em] uppercase transition-colors duration-300"
                style={{ color: "oklch(0.500 0.010 90)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "oklch(0.730 0.070 75)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "oklch(0.500 0.010 90)";
                }}
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
