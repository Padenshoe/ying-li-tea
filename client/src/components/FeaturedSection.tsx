/*
 * YING-LI TEA — FEATURED PRODUCT SECTION
 * Design: Full-width asymmetric layout. Rotating gift box carousel left, text right.
 * Cream background. Highlights Tea Gift Box as the hero product.
 */
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

const GIFT_BOX_IMAGES = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/茶包禮盒1_f7114db0.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/茶包禮盒2_6c03d7a5.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/茶包封面_0c270434.jpg",
];

export default function FeaturedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % GIFT_BOX_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 120);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const [, navigate] = useLocation();

  return (
    <section
      ref={sectionRef}
      className="py-0 overflow-hidden"
      style={{ background: "oklch(0.990 0.004 95)" }}
    >
      <div className="grid md:grid-cols-2 min-h-[650px] md:min-h-[780px]">
        {/* Image Carousel — Left */}
        <div className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: "480px", background: "#F5F1E8" }}>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Images with fade transition */}
            {GIFT_BOX_IMAGES.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Tea Gift Box - View ${idx + 1}`}
                className="absolute w-[95%] h-auto object-contain transition-opacity duration-1000"
                style={{
                  maxHeight: "90%",
                  opacity: idx === currentImageIndex ? 1 : 0,
                  pointerEvents: idx === currentImageIndex ? "auto" : "none",
                }}
              />
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {GIFT_BOX_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: idx === currentImageIndex ? "oklch(0.500 0.060 145)" : "oklch(0.800 0.020 95)",
                }}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>

          {/* Subtle overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, transparent 70%, oklch(0.990 0.004 95) 100%)" }}
          />
        </div>

        {/* Text — Right */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-24">
          <span
            className="eyebrow reveal mb-4"
            style={{ color: "oklch(0.730 0.070 75)" }}
          >
            {t("featured.label")}
          </span>
          <div className="divider-short reveal mb-6" />

          <h2
            className="font-['Playfair_Display'] font-400 reveal mb-4"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              color: "oklch(0.265 0.015 55)",
              lineHeight: 1.2,
            }}
          >
            {t("featured.title")}
          </h2>

          <p
            className="font-['Lato'] font-300 leading-loose reveal mb-8"
            style={{ fontSize: "1rem", color: "oklch(0.520 0.020 60)", maxWidth: "38ch" }}
          >
            {t("featured.description")}
          </p>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 mb-10 reveal">
            {[
              { label: t("featured.format"), value: t("featured.giftBox") },
              { label: t("featured.origin"), value: t("featured.taiwan") },
              { label: t("featured.perfectFor"), value: t("featured.gifting") },
            ].map((detail) => (
              <div key={detail.label} className="flex flex-col gap-1 border-l pl-4" style={{ borderColor: "oklch(0.870 0.018 130)" }}>
                <span className="eyebrow" style={{ color: "oklch(0.500 0.060 145)" }}>
                  {detail.label}
                </span>
                <span
                  className="font-['Playfair_Display'] font-400"
                  style={{ fontSize: "1rem", color: "oklch(0.265 0.015 55)" }}
                >
                  {detail.value}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex gap-4 reveal">
            <button
              onClick={() => navigate("/products")}
              className="px-7 py-3 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300"
              style={{ background: "oklch(0.500 0.060 145)", color: "#FAFAF7" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.420 0.060 145)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.500 0.060 145)";
              }}
            >
              {t("hero.shopNow")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
