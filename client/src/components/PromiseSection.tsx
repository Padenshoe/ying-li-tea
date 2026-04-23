/*
 * YING-LI TEA — PROMISE SECTION (迎利的承諾)
 * Design: Light warm background, three commitment points with decorative markers.
 * Placed between About and Featured/Product sections.
 */
import { useEffect, useRef } from "react";

const promises = [
  {
    zh: "二十年茶行背景，不是網路新創品牌",
    en: "20 years of tea business heritage — not a new online startup",
  },
  {
    zh: "透明定價——什麼價格買什麼等級的茶，清楚標示",
    en: "Transparent pricing — every grade clearly labelled so you know what you're paying for",
  },
  {
    zh: "歡迎來店試喝，不買沒關係",
    en: "Walk in for a free tasting — no purchase necessary",
  },
];

export default function PromiseSection() {
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

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28"
      style={{ background: "oklch(0.975 0.008 90)" }}
    >
      <div className="container">
        {/* Header */}
        <div className="mb-14 md:mb-16">
          <div
            className="divider-short mb-5 reveal"
            style={{ background: "oklch(0.730 0.070 75)" }}
          />
          <h2
            className="font-['Playfair_Display'] font-400 reveal"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              color: "oklch(0.265 0.015 55)",
              lineHeight: 1.2,
            }}
          >
            迎利的承諾
          </h2>
        </div>

        {/* Promise Items */}
        <div className="flex flex-col gap-0">
          {promises.map((item, idx) => (
            <div
              key={idx}
              className="reveal flex items-start gap-5 py-7"
              style={{
                borderBottom: idx < promises.length - 1
                  ? "1px solid oklch(0.870 0.018 130)"
                  : "none",
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              {/* Decorative marker */}
              <span
                className="flex-shrink-0 mt-1 font-['Playfair_Display'] font-400 select-none"
                style={{
                  fontSize: "1.25rem",
                  color: "oklch(0.730 0.070 75)",
                  lineHeight: 1,
                }}
              >
                ✦
              </span>
              <div className="flex flex-col gap-1">
                <p
                  className="font-['Lato'] font-400"
                  style={{
                    fontSize: "clamp(1rem, 2.2vw, 1.125rem)",
                    color: "oklch(0.265 0.015 55)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.zh}
                </p>
                <p
                  className="font-['Lato'] font-300"
                  style={{
                    fontSize: "0.875rem",
                    color: "oklch(0.520 0.020 60)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
