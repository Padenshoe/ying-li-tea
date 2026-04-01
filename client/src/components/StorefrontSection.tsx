/*
 * YING-LI TEA — STOREFRONT SECTION
 * Design: Full-width image showcase with overlay text
 * Showcases the physical tea shop experience
 */
import { useEffect, useRef } from "react";

const STOREFRONT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC03078_01a281d1.webp";

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
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="storefront"
      ref={sectionRef}
      className="relative py-0 overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${STOREFRONT_IMG})` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} />

      {/* Content */}
      <div className="relative z-10 container py-24 md:py-32 flex flex-col items-center text-center gap-8">
        <div className="reveal">
          <span
            className="eyebrow"
            style={{ color: "oklch(0.730 0.070 75)", letterSpacing: "0.18em" }}
          >
            親臨迎利
          </span>
        </div>

        <h2
          className="font-['Playfair_Display'] font-400 reveal"
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#FAFAF7",
            maxWidth: "30ch",
            lineHeight: 1.2,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          親臨迎利茶的溫暖
        </h2>

        <p
          className="font-['Lato'] font-300 reveal max-w-2xl"
          style={{
            fontSize: "1.0625rem",
            color: "#E8DFD0",
            lineHeight: 1.7,
            textShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        >
          踏入我們溫馨的茶空間，親自體驗台灣認證烏龍茶的完整系列——從日常平實之選到稀有的頂級茶葉。品茶、學茶，找到屬於您的那杯完美茶湯。
        </p>

        <div className="reveal flex flex-col sm:flex-row gap-4 mt-4">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector("#contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300"
            style={{
              background: "oklch(0.730 0.070 75)",
              color: "#1A1A1A",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "oklch(0.800 0.070 75)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "oklch(0.730 0.070 75)";
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
            className="px-8 py-3.5 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase border transition-all duration-300"
            style={{
              color: "#FAFAF7",
              borderColor: "#FAFAF7",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(250,250,247,0.15)";
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
