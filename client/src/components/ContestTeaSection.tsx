/*
 * YING-LI TEA — CONTEST TEA SECTION
 * Design: Asymmetric layout — slideshow left, text right.
 * Showcases the three award-winning contest teas (CT01/CT02/CT03).
 * Gold/amber color palette to convey prestige and authenticity.
 */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

const CONTEST_IMAGES = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/contest-lishan-top_a9b95b8b.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/contest-renai-top_e4843144.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/contest-heping-3star_d5b058e0.webp",
];

const CONTEST_ITEMS = [
  {
    id: "CT01",
    award: "頭等獎",
    name: "梨山茶王頭等獎禮盒",
    origin: "台中和平區",
    altitude: "2,000 公尺以上",
    weight: "150g × 2入・木質禮盒",
    price: "NT$10,000",
    badge: "2025 梨山茶品評鑑定比賽",
  },
  {
    id: "CT02",
    award: "頭等獎",
    name: "仁愛鄉農會高山茶王頭等獎",
    origin: "南投仁愛鄉",
    altitude: "1,800 公尺",
    weight: "75g × 2（共四兩）",
    price: "NT$3,000",
    badge: "仁愛鄉農會比賽茶",
  },
  {
    id: "CT03",
    award: "三星獎",
    name: "和平區梨山茶王三星獎",
    origin: "台中和平區",
    altitude: "2,000 公尺以上",
    weight: "150g（四兩）",
    price: "NT$2,500",
    badge: "2025 梨山茶品評鑑定比賽",
  },
];

export default function ContestTeaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [, navigate] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CONTEST_IMAGES.length);
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

  const current = CONTEST_ITEMS[currentIndex];

  return (
    <section
      ref={sectionRef}
      className="py-0 overflow-hidden"
      style={{ background: "oklch(0.975 0.010 75)" }}
    >
      <div className="grid md:grid-cols-2 min-h-[650px] md:min-h-[780px]">
        {/* Slideshow — Left */}
        <div
          className="relative overflow-hidden order-1"
          style={{ minHeight: "480px", background: "oklch(0.200 0.020 55)" }}
        >
          {CONTEST_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${CONTEST_ITEMS[i].name}`}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              style={{ opacity: i === currentIndex ? 1 : 0 }}
            />
          ))}

          {/* Award ribbon overlay */}
          <div className="absolute top-5 left-0 z-10">
            <div
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold shadow-lg"
              style={{
                background: "linear-gradient(90deg, oklch(0.650 0.130 65) 0%, oklch(0.780 0.120 75) 100%)",
                color: "oklch(0.150 0.020 55)",
                borderRadius: "0 6px 6px 0",
              }}
            >
              <span>🏆</span>
              <span>{current.award}</span>
              <span className="font-normal opacity-80">· 農會認證</span>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
            {CONTEST_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === currentIndex ? "oklch(0.780 0.120 75)" : "rgba(255,255,255,0.5)",
                  transform: i === currentIndex ? "scale(1.3)" : "scale(1)",
                }}
                aria-label={`切換至第 ${i + 1} 張照片`}
              />
            ))}
          </div>

          {/* Right-edge blend */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent 70%, oklch(0.975 0.010 75) 100%)",
            }}
          />
        </div>

        {/* Text — Right */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-24 order-2">
          {/* Section label */}
          <span
            className="eyebrow reveal mb-4"
            style={{ color: "oklch(0.620 0.110 65)" }}
          >
            農會認證比賽茶
          </span>
          <div className="divider-short reveal mb-6" style={{ borderColor: "oklch(0.780 0.120 75)" }} />

          <h2
            className="font-['Playfair_Display'] font-400 reveal mb-4"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              color: "oklch(0.215 0.020 55)",
              lineHeight: 1.2,
            }}
          >
            政府標章認證<br />得獎茶葉
          </h2>

          <p
            className="font-['Lato'] font-300 leading-loose reveal mb-8"
            style={{ fontSize: "1rem", color: "oklch(0.480 0.025 60)", maxWidth: "38ch" }}
          >
            每款均附農會認證標章與 QRcode，可追溯產地來源，是台灣茶品質最高等級的保證。
          </p>

          {/* Current item info */}
          <div className="reveal mb-6">
            <div
              className="inline-flex flex-col gap-1.5 border-l pl-4"
              style={{ borderColor: "oklch(0.780 0.120 75)" }}
            >
              <span className="eyebrow" style={{ color: "oklch(0.620 0.110 65)" }}>
                {current.badge}・{current.award}
              </span>
              <span
                className="font-['Playfair_Display'] font-400"
                style={{ fontSize: "1.05rem", color: "oklch(0.215 0.020 55)" }}
              >
                {current.name}
              </span>
              <span
                style={{ fontSize: "0.85rem", color: "oklch(0.480 0.025 60)" }}
              >
                {current.weight} — {current.price}
              </span>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-3 gap-4 mb-10 reveal">
            {[
              { label: "產地", value: current.origin },
              { label: "海拔", value: current.altitude },
              { label: "認證", value: "政府標章" },
            ].map((detail) => (
              <div
                key={detail.label}
                className="flex flex-col gap-1 border-l pl-4"
                style={{ borderColor: "oklch(0.870 0.060 75)" }}
              >
                <span className="eyebrow" style={{ color: "oklch(0.620 0.110 65)" }}>
                  {detail.label}
                </span>
                <span
                  className="font-['Playfair_Display'] font-400"
                  style={{ fontSize: "0.95rem", color: "oklch(0.265 0.015 55)" }}
                >
                  {detail.value}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex gap-4 reveal">
            <button
              onClick={() => navigate("/products?focus=CT01")}
              className="px-7 py-3 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300"
              style={{ background: "oklch(0.550 0.110 65)", color: "#FAFAF7" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.450 0.110 65)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.550 0.110 65)";
              }}
            >
              選購比賽茶
            </button>
            <button
              onClick={() => navigate(`/products/${current.id}`)}
              className="px-7 py-3 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300 border"
              style={{
                borderColor: "oklch(0.780 0.120 75)",
                color: "oklch(0.550 0.110 65)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.960 0.020 75)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              查看詳情
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
