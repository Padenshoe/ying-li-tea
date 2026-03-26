/*
 * YING-LI TEA — FEATURED PRODUCT SECTION
 * Design: Full-width asymmetric layout. Large image left, text right.
 * Cream background. Highlights Oolong Cold Brew as the hero product.
 */
import { useEffect, useRef } from "react";

const COLD_BREW_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-cold-brew-agse5jexCShDqGcKJ96SoK.webp";

export default function FeaturedSection() {
  const sectionRef = useRef<HTMLElement>(null);

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

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="py-0 overflow-hidden"
      style={{ background: "oklch(0.990 0.004 95)" }}
    >
      <div className="grid md:grid-cols-2 min-h-[600px] md:min-h-[700px]">
        {/* Image — Left */}
        <div className="relative overflow-hidden" style={{ minHeight: "400px" }}>
          <img
            src={COLD_BREW_IMG}
            alt="Oolong Cold Brew Tea — Ying-Li's signature product"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            style={{ objectPosition: "center top" }}
          />
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
            Featured Product
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
            Oolong Cold Brew Tea
          </h2>

          <p
            className="font-['Lato'] font-300 leading-loose reveal mb-8"
            style={{ fontSize: "1rem", color: "oklch(0.520 0.020 60)", maxWidth: "38ch" }}
          >
            A smooth, refreshing Taiwanese oolong crafted for cold brewing.
            Light, floral, and effortlessly elegant — this is Ying-Li's signature tea.
            Simply steep overnight and wake up to calm in a glass.
          </p>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 mb-10 reveal">
            {[
              { label: "Origin", value: "Taiwan" },
              { label: "Brew", value: "Cold" },
              { label: "Character", value: "Floral" },
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
              onClick={() => scrollTo("#products")}
              className="px-7 py-3 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300"
              style={{ background: "oklch(0.500 0.060 145)", color: "#FAFAF7" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.420 0.060 145)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.500 0.060 145)";
              }}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
