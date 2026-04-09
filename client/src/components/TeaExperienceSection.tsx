/*
 * YING-LI TEA — TEA EXPERIENCE SECTION
 * Design: Split layout showcasing the in-store tea ceremony experience.
 * Left: branded tea photo (DSC03057 — glass teapots with golden oolong + 迎利 cup)
 * Right: tea snack photo (DSC03062) + matcha cake action shot (DSC03043)
 * Below: short description of the in-store experience
 */
import { useEffect, useRef } from "react";

const TEA_CEREMONY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC03057_28c23a64.jpg";
const TEA_WITH_SNACKS = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC03062_b539642f.jpg";
const MATCHA_CAKE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC03043_2206f9fb.jpg";

export default function TeaExperienceSection() {
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
      id="experience"
      ref={sectionRef}
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: "oklch(0.975 0.008 80)" }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 reveal">
          <span
            className="eyebrow"
            style={{ color: "oklch(0.500 0.060 145)", letterSpacing: "0.18em" }}
          >
            茶室體驗
          </span>
          <h2
            className="font-['Playfair_Display'] font-400 mt-3"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "oklch(0.200 0.020 60)",
              lineHeight: 1.2,
            }}
          >
            一杯好茶，一份心意
          </h2>
          <p
            className="font-['Lato'] font-300 mt-4 max-w-2xl"
            style={{ fontSize: "1rem", color: "oklch(0.450 0.020 60)", lineHeight: 1.7 }}
          >
            在迎利，每一杯茶都是一次精心準備的體驗。搭配手工茶點，讓您在品茶的同時，感受台灣茶文化的溫度與深度。
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Left: Large tea ceremony photo */}
          <div
            className="reveal relative overflow-hidden rounded-sm"
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src={TEA_CEREMONY}
              alt="迎利烏龍茶茶具"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div
              className="absolute bottom-0 left-0 right-0 p-5"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)" }}
            >
              <p
                className="font-['Playfair_Display'] font-400 text-base"
                style={{ color: "#FAFAF7" }}
              >
                金黃烏龍 · 迎利品牌茶具
              </p>
            </div>
          </div>

          {/* Right: Two stacked photos */}
          <div className="flex flex-col gap-5">
            <div
              className="reveal relative overflow-hidden rounded-sm flex-1"
              style={{ minHeight: "200px" }}
            >
              <img
                src={TEA_WITH_SNACKS}
                alt="迎利茶與茶點"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
              >
                <p className="font-['Lato'] font-300 text-sm" style={{ color: "rgba(250,250,247,0.9)" }}>
                  茶湯搭配茶點
                </p>
              </div>
            </div>
            <div
              className="reveal relative overflow-hidden rounded-sm flex-1"
              style={{ minHeight: "200px" }}
            >
              <img
                src={MATCHA_CAKE}
                alt="迎利抹茶蛋糕"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
              >
                <p className="font-['Lato'] font-300 text-sm" style={{ color: "rgba(250,250,247,0.9)" }}>
                  手工抹茶蛋糕
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 reveal">
          {[
            { icon: "🍵", title: "現泡品茶", desc: "選購前先試飲，找到最適合您的茶" },
            { icon: "🎂", title: "手工茶點", desc: "搭配茶葉特製的手工甜點" },
            { icon: "📦", title: "精緻包裝", desc: "送禮自用兩相宜的茶葉禮盒" },
            { icon: "🏔️", title: "高山產地", desc: "直接來自台灣六大高山茶區" },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center gap-2 p-4"
              style={{
                background: "rgba(255,255,255,0.7)",
                borderRadius: "2px",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span
                className="font-['Playfair_Display'] font-400 text-sm"
                style={{ color: "oklch(0.200 0.020 60)" }}
              >
                {item.title}
              </span>
              <span
                className="font-['Lato'] font-300 text-xs leading-relaxed"
                style={{ color: "oklch(0.450 0.020 60)" }}
              >
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
