/*
 * YING-LI TEA — ABOUT SECTION
 * Design: Full-width background image with overlay content
 * Content: Taiwan oolong specialization, multiple regions, certifications
 */
import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ABOUT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC02931_e578eeb9.webp";

export default function AboutSection() {
  const { t } = useLanguage();
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
            <div
              className="divider-short mb-5 reveal"
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
              Our Heritage
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
                {t("about.description")}
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
                  Tea Regions
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
                ].map((item: any) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span
                      className="eyebrow"
                      style={{ color: "oklch(0.730 0.070 75)" }}
                    >
                      {t(`about.${item.label.toLowerCase().replace(" ", "")}`)}
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
