/*
 * YING-LI TEA — ABOUT SECTION
 * Design: 60/40 text-image split layout. Cream background.
 * Content: Taiwan oolong specialization, multiple regions, certifications
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
          <span className="eyebrow reveal">About Ying-Li</span>
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
            Taiwan's Premier<br />
            <em>Oolong Tea</em>
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
              Ying-Li specializes exclusively in authentic Taiwanese oolong tea, sourced from the island's most renowned high-altitude regions. Every tea is officially certified and carefully selected to showcase the unique terroir and masterful craftsmanship that define Taiwan's tea heritage.
            </p>
            <p
              className="font-['Lato'] font-300 leading-loose reveal"
              style={{ fontSize: "1.0625rem", color: "oklch(0.380 0.015 55)" }}
            >
              From entry-level selections to premium single-origin oolong, we offer teas across all price points and elevations. Our collection includes traditional loose leaf, convenient cold brew, and beautifully crafted gift boxes — each one a gateway to Taiwan's tea culture.
            </p>
            <p
              className="font-['Lato'] font-300 leading-loose reveal"
              style={{ fontSize: "1.0625rem", color: "oklch(0.380 0.015 55)" }}
            >
              Whether you're exploring the floral notes of Alishan or the robust character of Dayuling, every Ying-Li tea is an invitation to discover the mountains, the mist, and the moment of stillness in every cup.
            </p>

            {/* Tea Regions */}
            <div className="reveal mt-6">
              <h3
                className="font-['Playfair_Display'] font-400 mb-4"
                style={{
                  fontSize: "1.1rem",
                  color: "oklch(0.265 0.015 55)",
                  letterSpacing: "0.05em",
                }}
              >
                Our Tea Regions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "杉林溪 Shanlinxi",
                  "阿里山 Alishan",
                  "翠峰 Cuifeng",
                  "梨山 Lishan",
                  "福壽山 Fushoushan",
                  "大禹嶺 Dayuling",
                ].map((origin) => (
                  <div
                    key={origin}
                    className="flex items-center gap-2 py-2"
                    style={{ borderBottom: "1px solid oklch(0.870 0.018 130)" }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: "oklch(0.500 0.060 145)" }}
                    />
                    <span
                      className="font-['Lato'] font-300 text-sm"
                      style={{ color: "oklch(0.400 0.015 55)" }}
                    >
                      {origin}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-6 mt-6 reveal">
              {[
                { label: "Certification", value: "Official" },
                { label: "Specialization", value: "Oolong" },
                { label: "Range", value: "All Elevations" },
                { label: "Formats", value: "Loose & Cold Brew" },
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
