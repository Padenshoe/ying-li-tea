/*
 * YING-LI TEA — NAVBAR COMPONENT
 * Design: Zen Modernism — minimal, transparent on hero, frosted on scroll
 * Colors: warm white bg, charcoal text, moss green accent
 * Now includes Logo image with text, language toggle, currency toggle, and shopping cart
 */
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { Link, useLocation } from "wouter";
import { Globe, ShoppingBag } from "lucide-react";

const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/logo-with-text_660e5e0b.png";

// Fallback map: product ID → nameKey for items stored before nameKey was added
const PRODUCT_NAME_KEYS: Record<string, string> = {
  "1": "product.premium",
  "2": "product.coldBrew",
  "3": "product.entry",
  "4": "product.gift",
  "5": "product.specialty",
  "6": "product.loose",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { formatPrice, convertPrice } = useCurrency();
  const { items, removeItem, total } = useCart();
  const [, navigate] = useLocation();

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
    setCartOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const convertedTotal = convertPrice(total);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || window.innerWidth < 768
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(107,127,94,0.15)]"
          : "bg-white"
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

        {/* Right Section: Language Toggle + Currency Toggle + Cart + Shop Now */}
        <div className="flex items-center gap-3">
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

          {/* Shopping Cart Icon */}
          <div className="relative">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2 rounded-lg transition-all duration-300 hover:bg-gray-100"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} style={{ color: "oklch(0.500 0.060 145)" }} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-['Lato'] font-600 flex items-center justify-center text-white"
                  style={{ background: "oklch(0.500 0.060 145)" }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Cart Dropdown — fixed on mobile so it never overflows viewport */}
            {cartOpen && (
              <div
                className="rounded-lg shadow-lg p-4 z-50"
                style={{
                  position: "fixed",
                  top: "4.5rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "min(24rem, calc(100vw - 2rem))",
                  maxHeight: "calc(100vh - 6rem)",
                  overflowY: "auto",
                  background: "#FAFAF7",
                  border: "1px solid oklch(0.870 0.018 130)",
                }}
              >
                {items.length === 0 ? (
                  <p className="text-center font-['Lato'] text-sm" style={{ color: "oklch(0.552 0.016 285.938)" }}>
                    {language === "en" ? "Your cart is empty" : "您的購物車是空的"}
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3 items-start" style={{ borderBottom: "1px solid oklch(0.870 0.018 130)", paddingBottom: "0.75rem" }}>
                          {/* Product Image */}
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          
                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <p className="font-['Lato'] font-500 text-sm truncate" style={{ color: "oklch(0.265 0.015 55)" }}>
                              {t(item.nameKey ?? PRODUCT_NAME_KEYS[item.id] ?? item.name)}
                            </p>
                            <p className="font-['Lato'] text-xs" style={{ color: "oklch(0.552 0.016 285.938)" }}>
                              {formatPrice(convertPrice(item.price))} × {item.quantity}
                            </p>
                            <p className="font-['Lato'] text-xs font-600 mt-1" style={{ color: "oklch(0.500 0.060 145)" }}>
                              {formatPrice(convertPrice(item.price * item.quantity))}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"
                            style={{ color: "oklch(0.577 0.245 27.325)" }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3 mb-4" style={{ borderColor: "oklch(0.870 0.018 130)" }}>
                      <div className="flex justify-between mb-3">
                        <span className="font-['Lato'] font-600" style={{ color: "oklch(0.265 0.015 55)" }}>
                          {language === "en" ? "Total" : "總計"}
                        </span>
                        <span className="font-['Lato'] font-600" style={{ color: "oklch(0.500 0.060 145)" }}>
                          {formatPrice(convertedTotal)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCartOpen(false);
                        navigate("/cart");
                      }}
                      className="block w-full text-center py-2 rounded font-['Lato'] font-500 text-sm transition-all duration-300 border-none cursor-pointer"
                      style={{
                        background: "oklch(0.500 0.060 145)",
                        color: "#FAFAF7",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.opacity = "0.9";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.opacity = "1";
                      }}
                    >
                      {language === "en" ? "View Cart" : "查看購物車"}
                    </button>
                  </>
                )}
              </div>
            )}
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
