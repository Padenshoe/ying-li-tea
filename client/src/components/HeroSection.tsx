/*
 * YING-LI TEA — HERO SECTION
 * Design: Full-bleed display wall image with centered text and logo.
 * Dark wood background → white/cream text with strong contrast.
 * Logo positioned prominently in the center.
 */

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC03082_6e053fb9.webp";
const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/logo-with-text_660e5e0b.png";

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
      
      {/* Dark overlay for text contrast — wood is dark so use subtle dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.55) 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 container flex flex-col items-center text-center px-6">
        {/* Logo */}
        <img
          src={LOGO}
          alt="Ying-Li Logo"
          className="w-56 md:w-80 mb-8 animate-fade-in drop-shadow-lg"
          style={{ animationDelay: "0.1s", opacity: 0, animation: "fadeInUp 0.8s ease-out 0.1s forwards", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
        />

        {/* Brand Name — hidden since it's now in the logo */}
        <h1
          className="font-['Playfair_Display'] font-400 leading-none mb-4 hidden"
          style={{
            fontSize: "clamp(3.5rem, 11vw, 8rem)",
            color: "#FAFAF7",
            letterSpacing: "-0.02em",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            opacity: 0,
            animation: "fadeInUp 0.9s ease-out 0.3s forwards",
          }}
        >
          Ying-Li
        </h1>

        {/* Tagline */}
        <p
          className="font-['Playfair_Display'] italic font-400 mb-8"
          style={{
            fontSize: "clamp(0.9rem, 2.5vw, 1.4rem)",
            color: "#F2EDE4",
            letterSpacing: "0.02em",
            textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            opacity: 0,
            animation: "fadeInUp 0.9s ease-out 0.5s forwards",
          }}
        >
          Taiwanese Tea, Calm in Every Cup
        </p>

        {/* Divider */}
        <span
          className="divider-short mb-8"
          style={{
            background: "#C4A96A",
            opacity: 0,
            animation: "fadeInUp 0.9s ease-out 0.6s forwards",
          }}
        />

        {/* Brand Intro */}
        <p
          className="font-['Lato'] font-300 max-w-lg mb-10 leading-relaxed"
          style={{
            fontSize: "1rem",
            color: "#E8DFD0",
            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
            opacity: 0,
            animation: "fadeInUp 0.9s ease-out 0.7s forwards",
          }}
        >
          Ying-Li brings you the finest teas originating from the misty mountains of Taiwan —
          crafted for those who seek stillness in every sip.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4"
          style={{ opacity: 0, animation: "fadeInUp 0.9s ease-out 0.9s forwards" }}
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
              color: "#FAFAF7",
              borderColor: "#FAFAF7",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(250,250,247,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            Explore Our Tea
          </button>
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
