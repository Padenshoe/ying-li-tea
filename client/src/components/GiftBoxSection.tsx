/*
 * YING-LI TEA — GIFT BOX SECTION
 * Design: Mirrored layout of FeaturedSection (text left, 3-image slideshow right).
 * Shows the three gift box products (GB01/GB02/GB03).
 */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/";

const GIFTBOX_IMAGES = [
  CDN + "DSC03096_014aba20.webp",
  CDN + "DSC03098_15431a66.webp",
  CDN + "DSC03099_f9b61c50.webp",
];

const GIFTBOX_LABELS = [
  { name: "精選茶葉禮盒", desc: "半斤裝" },
  { name: "拾遇茶葉禮盒", desc: "半斤裝雙罐組" },
  { name: "圓善茶葉禮盒", desc: "一斤裝四罐組" },
];

export default function GiftBoxSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [, navigate] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GIFTBOX_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
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

  return (
    <section
      ref={sectionRef}
      className="py-0 overflow-hidden"
      style={{ background: "oklch(0.985 0.006 80)" }}
    >
      <div className="grid md:grid-cols-2 min-h-[650px] md:min-h-[780px]">
        {/* Text — Left */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-24 order-2 md:order-1">
          <span
            className="eyebrow reveal mb-4"
            style={{ color: "oklch(0.730 0.070 75)" }}
          >
            禮盒系列
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
            精緻茶葉禮盒
          </h2>

          <p
            className="font-['Lato'] font-300 leading-loose reveal mb-8"
            style={{ fontSize: "1rem", color: "oklch(0.520 0.020 60)", maxWidth: "38ch" }}
          >
            嚴選台灣高山茶葉，搭配典雅禮盒包裝，無論是節慶送禮或自用珍藏，皆能展現對茶的用心與品味。
          </p>

          {/* Current image label */}
          <div className="reveal mb-8">
            <div
              className="inline-flex flex-col gap-1 border-l pl-4"
              style={{ borderColor: "oklch(0.870 0.018 130)" }}
            >
              <span className="eyebrow" style={{ color: "oklch(0.380 0.070 145)" }}>
                {GIFTBOX_LABELS[currentIndex].name}
              </span>
              <span
                className="font-['Playfair_Display'] font-400"
                style={{ fontSize: "1rem", color: "oklch(0.265 0.015 55)" }}
              >
                {GIFTBOX_LABELS[currentIndex].desc} — NT$480
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 mb-10 reveal">
            {[
              { label: "包裝形式", value: "精緻禮盒" },
              { label: "產地", value: "台灣" },
              { label: "適合", value: "節慶送禮" },
            ].map((detail) => (
              <div
                key={detail.label}
                className="flex flex-col gap-1 border-l pl-4"
                style={{ borderColor: "oklch(0.870 0.018 130)" }}
              >
                <span className="eyebrow" style={{ color: "oklch(0.380 0.070 145)" }}>
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
              onClick={() => navigate("/products?focus=GB01")}
              className="px-7 py-3 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300"
              style={{ background: "oklch(0.420 0.055 140)", color: "#FAFAF7" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.350 0.055 140)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.420 0.055 140)";
              }}
            >
              選購禮盒
            </button>
          </div>
        </div>

        {/* Slideshow — Right */}
        <div
          className="relative overflow-hidden order-1 md:order-2"
          style={{ minHeight: "480px", background: "#F5F1E8" }}
        >
          {GIFTBOX_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${GIFTBOX_LABELS[i].name} ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              style={{ opacity: i === currentIndex ? 1 : 0 }}
            />
          ))}

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
            {GIFTBOX_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === currentIndex ? "oklch(0.380 0.070 145)" : "rgba(255,255,255,0.6)",
                  transform: i === currentIndex ? "scale(1.3)" : "scale(1)",
                }}
                aria-label={`切換至第 ${i + 1} 張照片`}
              />
            ))}
          </div>

          {/* Subtle left-edge overlay to blend into the text section */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, transparent 70%, oklch(0.985 0.006 80) 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
