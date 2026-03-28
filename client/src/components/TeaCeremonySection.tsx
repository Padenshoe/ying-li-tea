/*
 * YING-LI TEA — TEA CEREMONY SECTION
 * Design: Full-width image showcase with overlay text
 * Showcases the serene tea tasting experience
 */
import { useEffect, useRef } from "react";

const TEA_CEREMONY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC02931_e578eeb9.webp";

export default function TeaCeremonySection() {
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
      id="tea-ceremony"
      ref={sectionRef}
      className="relative py-0 overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${TEA_CEREMONY_IMG})` }}
      />

      {/* Light Overlay — image is bright so use lighter overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.25)" }} />

      {/* Content */}
      <div className="relative z-10 container py-24 md:py-32 flex flex-col items-center text-center gap-8">
        <div className="reveal">
          <span
            className="eyebrow"
            style={{ color: "oklch(0.265 0.015 55)", letterSpacing: "0.18em" }}
          >
            The Ying-Li Experience
          </span>
        </div>

        <h2
          className="font-['Playfair_Display'] font-400 reveal"
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#1A1A1A",
            maxWidth: "30ch",
            lineHeight: 1.2,
            textShadow: "0 1px 3px rgba(255,255,255,0.3)",
          }}
        >
          Savor the Moment
        </h2>

        <p
          className="font-['Lato'] font-300 reveal max-w-2xl"
          style={{
            fontSize: "1.0625rem",
            color: "#2A2A2A",
            lineHeight: 1.7,
            textShadow: "0 1px 2px rgba(255,255,255,0.2)",
          }}
        >
          Step into our serene tea tasting space. Discover the ritual of gongfu tea, learn the subtle differences between our high-altitude oolong selections, and experience the calm that comes with every sip.
        </p>

        <div className="reveal flex flex-col sm:flex-row gap-4 mt-4">
          <a
            href="#storefront"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector("#storefront");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300"
            style={{
              background: "oklch(0.500 0.060 145)",
              color: "#FAFAF7",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "oklch(0.420 0.060 145)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "oklch(0.500 0.060 145)";
            }}
          >
            Visit Our Space
          </a>
          <a
            href="#products"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector("#products");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase border transition-all duration-300"
            style={{
              color: "#1A1A1A",
              borderColor: "#1A1A1A",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(26,26,26,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            Explore Teas
          </a>
        </div>
      </div>
    </section>
  );
}
