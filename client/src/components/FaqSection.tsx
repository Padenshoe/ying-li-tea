/*
 * YING-LI TEA — FAQ SECTION
 * Design: Clean accordion on warm white background.
 * Minimal expand/collapse with thin divider lines.
 * Elegant, readable, no clutter.
 */
import { useState, useEffect, useRef } from "react";

const faqs = [
  {
    q: "Where does Ying-Li tea come from?",
    a: "Our teas are inspired by and sourced from Taiwan, known for its rich tea culture and exceptional tea craftsmanship. Taiwan's high-altitude mountains and misty climate produce some of the world's most prized oolong teas.",
  },
  {
    q: "What is oolong cold brew tea?",
    a: "Oolong cold brew tea is a refreshing way to enjoy tea by steeping it in cold water over time — typically 6 to 12 hours in the refrigerator. This slow, cold extraction creates a smooth, naturally sweet, and less bitter flavor that is perfect for warm days or whenever you want a calm, refreshing drink.",
  },
  {
    q: "How do I brew the tea bags?",
    a: "Steep one tea bag in freshly boiled water (around 90°C / 194°F) for 3 to 5 minutes, depending on your preferred strength. For a lighter, more delicate cup, steep for less time. You can also let it cool and serve over ice for a refreshing iced tea.",
  },
  {
    q: "Can I cold brew the tea bags?",
    a: "Yes — our tea bags work beautifully for cold brewing. Simply place one or two tea bags in a pitcher of cold water and refrigerate for 6 to 12 hours. The result is a lighter, smoother tea with a naturally sweet and floral character.",
  },
  {
    q: "Are more tea flavors coming?",
    a: "Yes, we plan to expand our collection with more Taiwanese tea varieties in the future. We are exploring the full depth of Taiwan's tea landscape — from high-mountain green teas to roasted oolongs. Stay connected with us to be the first to know.",
  },
];

export default function FaqSection() {
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
            <span className="eyebrow reveal">Questions</span>
            <div className="divider-short reveal" />
            <h2
              className="font-['Playfair_Display'] font-400 reveal"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "oklch(0.265 0.015 55)",
                lineHeight: 1.2,
              }}
            >
              Frequently<br />
              <em>Asked</em>
            </h2>
            <p
              className="font-['Lato'] font-300 leading-loose reveal"
              style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
            >
              Everything you need to know about Ying-Li tea and how to enjoy it.
            </p>
          </div>

          {/* Right — Accordion */}
          <div className="md:col-span-3 flex flex-col">
            {faqs.map((faq, idx) => (
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
                    {faq.q}
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
                    className="font-['Lato'] font-300 leading-loose pb-6"
                    style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
                  >
                    {faq.a}
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
