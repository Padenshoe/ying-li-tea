/*
 * YING-LI TEA — ABOUT SECTION
 * Design: 60/40 text-image split layout. Cream background.
 * Asymmetric — text left, image right with slight overlap/offset.
 * Dark charcoal text on cream background.
 */
import { useEffect, useRef } from "react";

const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/about-tea-garden-NihENfQ8snfuTVrHW3CU2N.webp";
const CEREMONY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/tea-ceremony-7zSkk3hEEDz5r88KAHQevX.webp";

export default function AboutSection() {
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
      id="about"
      ref={sectionRef}
      className="py-24 md:py-36"
      style={{ background: "oklch(0.962 0.008 90)" }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <span className="eyebrow reveal">Our Story</span>
          <div className="divider-short mt-3 mb-5 reveal" />
          <h2
            className="font-['Playfair_Display'] font-400 reveal"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "oklch(0.265 0.015 55)",
              maxWidth: "20ch",
              lineHeight: 1.15,
            }}
          >
            Rooted in Taiwan,<br />
            <em>Crafted for Calm</em>
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-5 gap-12 md:gap-16 items-start">
          {/* Text Column — 3/5 */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <p
              className="font-['Lato'] font-300 leading-loose reveal"
              style={{ fontSize: "1.0625rem", color: "oklch(0.380 0.015 55)" }}
            >
              Ying-Li was born from a deep respect for Taiwan's extraordinary tea heritage.
              Nestled among high-altitude mountains and wrapped in perpetual mist, Taiwan has
              cultivated some of the world's most celebrated teas for centuries — and it is
              from this living tradition that Ying-Li draws its spirit.
            </p>
            <p
              className="font-['Lato'] font-300 leading-loose reveal"
              style={{ fontSize: "1.0625rem", color: "oklch(0.380 0.015 55)" }}
            >
              We believe that great tea is an act of simplicity. It asks nothing of you except
              a moment of stillness. Our teas are selected for their purity, their fragrance,
              and their ability to bring a quiet clarity to the everyday.
            </p>
            <p
              className="font-['Lato'] font-300 leading-loose reveal"
              style={{ fontSize: "1.0625rem", color: "oklch(0.380 0.015 55)" }}
            >
              From the floral lightness of high-mountain oolong to the smooth depth of a
              cold brew, every Ying-Li tea is an invitation to slow down — and to savour
              what is truly good.
            </p>

            {/* Values Row */}
            <div className="grid grid-cols-2 gap-6 mt-4 reveal">
              {[
                { label: "Origin", value: "Taiwan" },
                { label: "Philosophy", value: "Simplicity" },
                { label: "Character", value: "Refined" },
                { label: "Experience", value: "Timeless" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span
                    className="eyebrow"
                    style={{ color: "oklch(0.500 0.060 145)" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="font-['Playfair_Display'] font-400 text-lg"
                    style={{ color: "oklch(0.265 0.015 55)" }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Column — 2/5 */}
          <div className="md:col-span-2 flex flex-col gap-4 reveal">
            <div className="overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <img
                src={ABOUT_IMG}
                alt="Misty Taiwanese tea garden at dawn"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img
                src={CEREMONY_IMG}
                alt="Traditional Taiwanese gongfu tea ceremony"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
