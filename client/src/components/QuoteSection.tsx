/*
 * YING-LI TEA — QUOTE SECTION
 * Design: Full-width centered quote on a soft moss green background.
 * Large italic serif quote, elegant and minimal.
 * Provides visual contrast between product and FAQ sections.
 */
import { useEffect, useRef } from "react";

export default function QuoteSection() {
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
      ref={sectionRef}
      className="py-20 md:py-28"
      style={{ background: "oklch(0.962 0.008 90)" }}
    >
      <div className="container flex flex-col items-center text-center gap-6">
        <span
          className="divider-short reveal"
          style={{ background: "oklch(0.730 0.070 75)", margin: "0 auto" }}
        />
        <blockquote
          className="font-['Noto_Serif_TC'] font-400 reveal"
          style={{
            fontSize: "clamp(1.25rem, 3.5vw, 2.25rem)",
            color: "oklch(0.265 0.015 55)",
            maxWidth: "24ch",
            lineHeight: 1.6,
          }}
        >
          茶葉的價値，應該讓你看得見。
        </blockquote>
        <span
          className="eyebrow reveal"
          style={{ color: "oklch(0.500 0.060 145)" }}
        >
          — 迎利的理念
        </span>
      </div>
    </section>
  );
}
