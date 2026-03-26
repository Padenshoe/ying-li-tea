/*
 * YING-LI TEA — HERO SECTION
 * Design: Full-bleed image with centered text floating over misty background.
 * Light background image → dark charcoal text with subtle overlay.
 * Scroll-triggered reveal animations.
 */

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/hero-bg-PeHWnXQBhUnfWdqsUAhVr8.webp";

export default function HeroSection() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Soft warm overlay — light image so use subtle cream overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(250,250,247,0.25) 0%, rgba(250,250,247,0.55) 60%, rgba(250,250,247,0.85) 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 container flex flex-col items-center text-center px-6">
        {/* Eyebrow */}
        <span
          className="eyebrow mb-6 animate-fade-in"
          style={{ animationDelay: "0.2s", opacity: 0, animation: "fadeInUp 0.8s ease-out 0.2s forwards" }}
        >
          Est. Taiwan
        </span>

        {/* Brand Name */}
        <h1
          className="font-['Playfair_Display'] font-400 leading-none mb-4"
          style={{
            fontSize: "clamp(4rem, 12vw, 9rem)",
            color: "oklch(0.265 0.015 55)",
            letterSpacing: "-0.02em",
            opacity: 0,
            animation: "fadeInUp 0.9s ease-out 0.4s forwards",
          }}
        >
          Ying-Li
        </h1>

        {/* Tagline */}
        <p
          className="font-['Playfair_Display'] italic font-400 mb-8"
          style={{
            fontSize: "clamp(1rem, 3vw, 1.5rem)",
            color: "oklch(0.400 0.015 55)",
            letterSpacing: "0.02em",
            opacity: 0,
            animation: "fadeInUp 0.9s ease-out 0.6s forwards",
          }}
        >
          Taiwanese Tea, Calm in Every Cup
        </p>

        {/* Divider */}
        <span
          className="divider-short mb-8"
          style={{ opacity: 0, animation: "fadeInUp 0.9s ease-out 0.7s forwards" }}
        />

        {/* Brand Intro */}
        <p
          className="font-['Lato'] font-300 max-w-lg mb-10 leading-relaxed"
          style={{
            fontSize: "1rem",
            color: "oklch(0.380 0.015 55)",
            opacity: 0,
            animation: "fadeInUp 0.9s ease-out 0.8s forwards",
          }}
        >
          Ying-Li brings you the finest teas originating from the misty mountains of Taiwan —
          crafted for those who seek stillness in every sip.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4"
          style={{ opacity: 0, animation: "fadeInUp 0.9s ease-out 1.0s forwards" }}
        >
          <button
            onClick={() => scrollTo("#products")}
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
            Shop Now
          </button>
          <button
            onClick={() => scrollTo("#about")}
            className="px-8 py-3.5 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase border transition-all duration-300"
            style={{
              color: "oklch(0.265 0.015 55)",
              borderColor: "oklch(0.265 0.015 55)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "oklch(0.265 0.015 55)";
              (e.currentTarget as HTMLElement).style.color = "#FAFAF7";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "oklch(0.265 0.015 55)";
            }}
          >
            Explore Our Tea
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0, animation: "fadeInUp 0.9s ease-out 1.3s forwards" }}
        >
          <span className="eyebrow" style={{ color: "oklch(0.520 0.020 60)" }}>Scroll</span>
          <div
            className="w-px h-10 animate-pulse"
            style={{ background: "linear-gradient(to bottom, oklch(0.730 0.070 75), transparent)" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
