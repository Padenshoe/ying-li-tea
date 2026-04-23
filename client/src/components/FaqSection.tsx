/*
 * YING-LI TEA — FAQ SECTION
 * Design: Clean accordion on warm white background.
 * Minimal expand/collapse with thin divider lines.
 * Elegant, readable, no clutter.
 */
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const faqKeys = [
  { qKey: "faq.q1", aKey: "faq.a1" },
  { qKey: "faq.q2", aKey: "faq.a2" },
  { qKey: "faq.q3", aKey: "faq.a3" },
  { qKey: "faq.q4", aKey: "faq.a4" },
  { qKey: "faq.q5", aKey: "faq.a5" },
  { qKey: "faq.q6", aKey: "faq.a6" },
];

export default function FaqSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 80);
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
      id="faq"
      ref={sectionRef}
      className="py-24 md:py-36"
      style={{ background: "oklch(0.990 0.004 95)" }}
    >
      <div className="container">
        <div className="grid md:grid-cols-5 gap-12 md:gap-20">
          {/* Left — Header */}
          <div className="md:col-span-2 flex flex-col gap-5 md:sticky md:top-28 self-start">
            <span className="eyebrow reveal">{t("faq.label")}</span>
            <div className="divider-short reveal" />
            <h2
              className="font-['Playfair_Display'] font-400 reveal"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "oklch(0.265 0.015 55)",
                lineHeight: 1.2,
              }}
            >
              {t("faq.title")}
            </h2>
            <p
              className="font-['Lato'] font-300 leading-loose reveal"
              style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
            >
              {t("faq.description")}
            </p>
          </div>

          {/* Right — Accordion */}
          <div className="md:col-span-3 flex flex-col">
            {faqKeys.map((faq, idx) => (
              <div
                key={idx}
                className="reveal border-t"
                style={{
                  borderColor: "oklch(0.870 0.018 130)",
                  transitionDelay: `${idx * 60}ms`,
                }}
              >
                <button
                  className="w-full flex items-center justify-between py-6 text-left gap-4 group"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  aria-expanded={openIndex === idx}
                >
                  <span
                    className="font-['Playfair_Display'] font-400 transition-colors duration-300"
                    style={{
                      fontSize: "1.0625rem",
                      color: openIndex === idx
                        ? "oklch(0.500 0.060 145)"
                        : "oklch(0.265 0.015 55)",
                    }}
                  >
                    {t(faq.qKey)}
                  </span>
                  {/* Plus / Minus icon */}
                  <span
                    className="flex-shrink-0 w-5 h-5 relative"
                    style={{ color: "oklch(0.500 0.060 145)" }}
                  >
                    <span
                      className="absolute top-1/2 left-0 w-full h-px transition-all duration-300"
                      style={{ background: "currentColor", transform: "translateY(-50%)" }}
                    />
                    <span
                      className="absolute top-0 left-1/2 h-full w-px transition-all duration-300"
                      style={{
                        background: "currentColor",
                        transform: `translateX(-50%) scaleY(${openIndex === idx ? 0 : 1})`,
                        transformOrigin: "center",
                      }}
                    />
                  </span>
                </button>

                {/* Answer */}
                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{ maxHeight: openIndex === idx ? "300px" : "0" }}
                >
                  <p
                    className="font-['Lato'] font-300 leading-loose pb-6 whitespace-pre-line"
                    style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
                  >
                    {t(faq.aKey)}
                  </p>
                </div>
              </div>
            ))}
            {/* Bottom border */}
            <div className="divider-line" style={{ borderColor: "oklch(0.870 0.018 130)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
