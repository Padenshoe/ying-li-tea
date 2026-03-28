/*
 * YING-LI TEA — NAVBAR COMPONENT
 * Design: Zen Modernism — minimal, transparent on hero, frosted on scroll
 * Colors: warm white bg, charcoal text, moss green accent
 * Now includes Logo image with text and language toggle
 */
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/logo-with-text_660e5e0b.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("nav.home"), href: "#home" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.shop"), href: "#products" },
    { label: t("nav.faq"), href: "#faq" },
  ];

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || window.innerWidth < 768
          ? "bg-[#FAFAF7]/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(107,127,94,0.15)]"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); scrollTo("#home"); }}
          className="flex items-center gap-2 group"
        >
          <img
            src={LOGO}
            alt="Ying-Li Logo"
            className="w-16 md:w-20 h-auto transition-transform duration-300 group-hover:scale-110"
          />
        </a>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="text-sm font-['Lato'] font-400 tracking-wide transition-colors duration-300 hover:text-[oklch(0.500_0.060_145)]"
                style={{ color: "oklch(0.400 0.015 55)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Section: Language Toggle + Shop Now */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "oklch(0.950 0.005 90)" }}>
            <button
              onClick={() => setLanguage("en")}
              className="px-2 py-1 text-xs font-['Lato'] font-500 rounded transition-all duration-200"
              style={{
                background: language === "en" ? "oklch(0.500 0.060 145)" : "transparent",
                color: language === "en" ? "#FAFAF7" : "oklch(0.520 0.020 60)",
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("zh")}
              className="px-2 py-1 text-xs font-['Lato'] font-500 rounded transition-all duration-200"
              style={{
                background: language === "zh" ? "oklch(0.500 0.060 145)" : "transparent",
                color: language === "zh" ? "#FAFAF7" : "oklch(0.520 0.020 60)",
              }}
            >
              中文
            </button>
          </div>

          {/* Desktop CTA */}
          <a
            href="#products"
            onClick={(e) => { e.preventDefault(); scrollTo("#products"); }}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2 text-xs font-['Lato'] font-400 tracking-[0.15em] uppercase transition-all duration-300 border"
            style={{
              color: "oklch(0.500 0.060 145)",
              borderColor: "oklch(0.500 0.060 145)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "oklch(0.500 0.060 145)";
              (e.currentTarget as HTMLElement).style.color = "#FAFAF7";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = "oklch(0.500 0.060 145)";
            }}
          >
            {t("nav.shopNow")}
          </a>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-px w-6 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              style={{ background: "oklch(0.265 0.015 55)" }}
            />
            <span
              className={`block h-px w-6 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              style={{ background: "oklch(0.265 0.015 55)" }}
            />
            <span
              className={`block h-px w-6 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              style={{ background: "oklch(0.265 0.015 55)" }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-400 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ background: "oklch(0.990 0.004 95)" }}
      >
        <div className="px-4 md:px-6 py-6 flex flex-col gap-3 max-h-[calc(100vh-80px)] overflow-y-auto">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className="text-sm font-['Lato'] font-400 tracking-wide py-2 border-b"
              style={{
                color: "oklch(0.400 0.015 55)",
                borderColor: "oklch(0.870 0.018 130)",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#products"
            onClick={(e) => { e.preventDefault(); scrollTo("#products"); }}
            className="mt-4 w-full flex items-center justify-center px-5 py-3 text-xs font-['Lato'] tracking-[0.15em] uppercase border rounded"
            style={{
              color: "oklch(0.500 0.060 145)",
              borderColor: "oklch(0.500 0.060 145)",
            }}
          >
            {t("nav.shopNow")}
          </a>
        </div>
      </div>
    </nav>
  );
}
