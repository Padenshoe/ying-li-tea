/*
 * YING-LI TEA — ABOUT SECTION
 * Design: Full-width background image with overlay content
 * Content: Taiwan oolong specialization, multiple regions, certifications
 */
import { useEffect, useRef } from "react";

const ABOUT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC02931_e578eeb9.webp";

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
      className="relative py-24 md:py-36 overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ABOUT_BG})` }}
      />

      {/* Dark Overlay for text contrast */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />

      {/* Content */}
      <div className="relative z-10">
        <div className="container">
          {/* Section Header */}
          <div className="mb-16 md:mb-20">
            <span
              className="eyebrow reveal"
              style={{ color: "oklch(0.730 0.070 75)" }}
            >
              About Ying-Li
            </span>
            <div
              className="divider-short mt-3 mb-5 reveal"
              style={{ background: "oklch(0.730 0.070 75)" }}
            />
            <h2
              className="font-['Playfair_Display'] font-400 reveal"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "#FAFAF7",
                maxWidth: "20ch",
                lineHeight: 1.15,
              }}
            >
              Taiwan's Premier<br />
              <em>Oolong Tea</em>
            </h2>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Left — Text */}
            <div className="flex flex-col gap-6">
              <p
                className="font-['Lato'] font-300 leading-loose reveal"
                style={{ fontSize: "1.0625rem", color: "oklch(0.900 0.010 90)" }}
              >
                Ying-Li specializes exclusively in authentic Taiwanese oolong tea, sourced from the island's most renowned high-altitude regions. Every tea is officially certified and carefully selected to showcase the unique terroir and masterful craftsmanship that define Taiwan's tea heritage.
              </p>
              <p
                className="font-['Lato'] font-300 leading-loose reveal"
                style={{ fontSize: "1.0625rem", color: "oklch(0.900 0.010 90)" }}
              >
                From entry-level selections to premium single-origin oolong, we offer teas across all price points and elevations. Our collection includes traditional loose leaf, convenient cold brew, and beautifully crafted gift boxes — each one a gateway to Taiwan's tea culture.
              </p>
              <p
                className="font-['Lato'] font-300 leading-loose reveal"
                style={{ fontSize: "1.0625rem", color: "oklch(0.900 0.010 90)" }}
              >
                Whether you're exploring the floral notes of Alishan or the robust character of Dayuling, every Ying-Li tea is an invitation to discover the mountains, the mist, and the moment of stillness in every cup.
              </p>
            </div>

            {/* Right — Tea Regions & Features */}
            <div className="flex flex-col gap-8">
              {/* Tea Regions */}
              <div className="reveal">
                <h3
                  className="font-['Playfair_Display'] font-400 mb-4"
                  style={{
                    fontSize: "1.1rem",
                    color: "#FAFAF7",
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
                      style={{ borderBottom: "1px solid rgba(250,250,247,0.2)" }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: "oklch(0.730 0.070 75)" }}
                      />
                      <span
                        className="font-['Lato'] font-300 text-sm"
                        style={{ color: "oklch(0.900 0.010 90)" }}
                      >
                        {origin}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-6 reveal">
                {[
                  { label: "Certification", value: "Official" },
                  { label: "Specialization", value: "Oolong" },
                  { label: "Range", value: "All Elevations" },
                  { label: "Formats", value: "Loose & Cold Brew" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span
                      className="eyebrow"
                      style={{ color: "oklch(0.730 0.070 75)" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="font-['Playfair_Display'] font-400 text-lg"
                      style={{ color: "#FAFAF7" }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
