/*
 * YING-LI TEA — STOREFRONT SECTION
 * Design: Photo gallery grid showcasing the physical tea shop.
 * Left: large exterior sign photo + text overlay
 * Right: 2x2 grid of interior photos
 */
import { useEffect, useRef } from "react";

const EXTERIOR_SIGN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC03071_8de47b67.jpg";
const INTERIOR_COUNTER_DAY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC02971_a5b35621.jpg";
const INTERIOR_COUNTER_NIGHT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC03005_585dd919.jpg";
const INTERIOR_FULL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC03113_53d08a45.jpg";

export default function StorefrontSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="storefront"
      ref={sectionRef}
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: "oklch(0.990 0.004 95)" }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 reveal">
          <span
            className="eyebrow"
            style={{ color: "oklch(0.500 0.060 145)", letterSpacing: "0.18em" }}
          >
            親臨迎利
          </span>
          <h2
            className="font-['Playfair_Display'] font-400 mt-3"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "oklch(0.200 0.020 60)",
              lineHeight: 1.2,
            }}
          >
            走進迎利的茶空間
          </h2>
          <p
            className="font-['Lato'] font-300 mt-4 max-w-2xl"
            style={{ fontSize: "1rem", color: "oklch(0.450 0.020 60)", lineHeight: 1.7 }}
          >
            踏入我們溫馨的茶空間，親自體驗台灣認證烏龍茶的完整系列——從日常平實之選到稀有的頂級茶葉。品茶、學茶，找到屬於您的那杯完美茶湯。
          </p>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {/* Left: Large exterior sign photo */}
          <div className="reveal relative overflow-hidden rounded-sm" style={{ aspectRatio: "3/4" }}>
            <img
              src={EXTERIOR_SIGN}
              alt="迎利茶招牌"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div
              className="absolute bottom-0 left-0 right-0 p-6"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" }}
            >
              <p
                className="font-['Playfair_Display'] font-400 text-lg"
                style={{ color: "#FAFAF7" }}
              >
                茶葉選購 · 現泡品茶
              </p>
              <p
                className="font-['Lato'] font-300 text-sm mt-1"
                style={{ color: "rgba(250,250,247,0.8)" }}
              >
                迎利 Ying-Li Tea
              </p>
            </div>
          </div>

          {/* Right: 2×2 grid of interior photos */}
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {[
              { src: INTERIOR_COUNTER_DAY, alt: "迎利茶吧台（日間）", caption: "服務吧台" },
              { src: INTERIOR_COUNTER_NIGHT, alt: "迎利茶吧台（夜間）", caption: "夜間氛圍" },
              { src: INTERIOR_FULL, alt: "迎利茶室全景", caption: "茶葉展示" },
              { src: EXTERIOR_SIGN, alt: "迎利茶招牌特寫", caption: "品牌識別" },
            ].map((photo, i) => (
              <div
                key={i}
                className="reveal relative overflow-hidden rounded-sm"
                style={{ aspectRatio: "1/1" }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-2"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                >
                  <p
                    className="font-['Lato'] font-300 text-xs"
                    style={{ color: "rgba(250,250,247,0.9)" }}
                  >
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 reveal">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector("#contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300 inline-block"
            style={{
              background: "oklch(0.500 0.060 145)",
              color: "#FAFAF7",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "oklch(0.420 0.060 145)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "oklch(0.500 0.060 145)";
            }}
          >
            聯絡我們
          </a>
          <a
            href="#products"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector("#products");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase border transition-all duration-300 inline-block"
            style={{
              color: "oklch(0.200 0.020 60)",
              borderColor: "oklch(0.200 0.020 60)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            線上選購
          </a>
        </div>
      </div>
    </section>
  );
}
