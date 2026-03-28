/*
 * YING-LI TEA — PRODUCTS SECTION
 * Design: Horizontal carousel with CSS scroll-snap for mobile.
 * Cards centered on mobile, currency toggle per card.
 */
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const COLD_BREW_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-cold-brew-agse5jexCShDqGcKJ96SoK.webp";
const TEA_BAGS_IMG  = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-tea-bags-BQ6hFsR5su8dVrfZPRo3ZW.webp";

const products = [
  { id: 1, nameKey: "product.premium",   tagKey: "product.premiumTag",   descKey: "product.premiumDesc",   priceUSD: 280, image: COLD_BREW_IMG },
  { id: 2, nameKey: "product.coldBrew",  tagKey: "product.coldBrewTag",  descKey: "product.coldBrewDesc",  priceUSD: 120, image: TEA_BAGS_IMG  },
  { id: 3, nameKey: "product.entry",     tagKey: "product.entryTag",     descKey: "product.entryDesc",     priceUSD: 80,  image: COLD_BREW_IMG },
  { id: 4, nameKey: "product.gift",      tagKey: "product.giftTag",      descKey: "product.giftDesc",      priceUSD: 380, image: TEA_BAGS_IMG  },
  { id: 5, nameKey: "product.specialty", tagKey: "product.specialtyTag", descKey: "product.specialtyDesc", priceUSD: 200, image: COLD_BREW_IMG },
  { id: 6, nameKey: "product.loose",     tagKey: "product.looseTag",     descKey: "product.looseDesc",     priceUSD: 150, image: TEA_BAGS_IMG  },
];

export default function ProductsSection() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const { currency, setCurrency, convertPrice, formatPrice } = useCurrency();
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Detect active card index based on scroll position
    const cardWidth = carouselRef.current.querySelector("[data-card]")?.clientWidth || 320;
    const gap = 32; // gap-8 = 2rem = 32px
    const idx = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(idx, products.length - 1));
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.querySelectorAll("[data-card]")[index] as HTMLElement;
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      setTimeout(checkScroll, 350);
    }
  };

  const scroll = (direction: "left" | "right") => {
    const next = direction === "left"
      ? Math.max(0, activeIndex - 1)
      : Math.min(products.length - 1, activeIndex + 1);
    scrollToCard(next);
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id.toString(),
      name: t(product.nameKey),
      nameKey: product.nameKey,  // Store key for re-translation
      price: product.priceUSD,
      quantity: 1,
      image: product.image,
    });
    toast.success(`${t(product.nameKey)} added to cart!`, {
      description: t("cart.addedSuccess"),
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
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
      id="products"
      ref={sectionRef}
      className="py-24 md:py-36"
      style={{ background: "oklch(0.990 0.004 95)" }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 md:mb-20">
          <span className="eyebrow reveal">{t("products.label")}</span>
          <div className="divider-short mt-3 mb-5 reveal" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="font-['Playfair_Display'] font-400 reveal"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "oklch(0.265 0.015 55)",
                lineHeight: 1.15,
              }}
            >
              {t("products.title")}<br />
              <em>{t("products.titleEmph")}</em>
            </h2>
            <div className="flex flex-col gap-3 items-start md:items-end reveal">
              <p
                className="font-['Lato'] font-300 max-w-xs"
                style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
              >
                {t("products.description")}
              </p>
              {/* Currency Toggle */}
              <div
                className="flex items-center rounded-full overflow-hidden border"
                style={{ borderColor: "oklch(0.870 0.018 130)" }}
              >
                {(["USD", "TWD"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className="px-4 py-1.5 text-xs font-['Lato'] font-400 tracking-wider transition-all duration-200"
                    style={{
                      background: currency === c ? "oklch(0.500 0.060 145)" : "transparent",
                      color: currency === c ? "#FAFAF7" : "oklch(0.520 0.020 60)",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative reveal">
          {/* Left Arrow — hidden on mobile (use swipe) */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-10 p-2 transition-all duration-300"
            style={{
              opacity: canScrollLeft ? 1 : 0.25,
              pointerEvents: canScrollLeft ? "auto" : "none",
              color: "oklch(0.500 0.060 145)",
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Mobile prev/next arrows — overlaid on sides */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="md:hidden absolute left-0 top-1/3 -translate-y-1/2 z-10 p-2 rounded-full shadow-md transition-all duration-200"
            style={{
              background: "oklch(0.990 0.004 95)",
              opacity: canScrollLeft ? 1 : 0.2,
              pointerEvents: canScrollLeft ? "auto" : "none",
              color: "oklch(0.500 0.060 145)",
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="md:hidden absolute right-0 top-1/3 -translate-y-1/2 z-10 p-2 rounded-full shadow-md transition-all duration-200"
            style={{
              background: "oklch(0.990 0.004 95)",
              opacity: canScrollRight ? 1 : 0.2,
              pointerEvents: canScrollRight ? "auto" : "none",
              color: "oklch(0.500 0.060 145)",
            }}
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>

          {/* Carousel Track — scroll-snap on mobile */}
          <div
            ref={carouselRef}
            onScroll={checkScroll}
            className="flex gap-8 overflow-x-auto pb-4"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              /* Mobile: snap to center of each card */
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              /* Padding so first/last cards can center on mobile */
              paddingLeft: "calc(50% - 140px)",
              paddingRight: "calc(50% - 140px)",
            }}
          >
            <style>{`
              div::-webkit-scrollbar { display: none; }
              @media (min-width: 768px) {
                .products-carousel {
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                }
              }
            `}</style>
            {products.map((product, idx) => (
              <div
                key={product.id}
                data-card
                className="flex-shrink-0 flex flex-col group"
                style={{
                  width: "280px",
                  scrollSnapAlign: "center",
                }}
              >
                {/* Image Area */}
                <div
                  className="overflow-hidden mb-5 relative"
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={product.image}
                    alt={t(product.nameKey)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Tag Badge */}
                  <span
                    className="absolute top-4 left-4 eyebrow px-3 py-1"
                    style={{
                      background: "oklch(0.990 0.004 95)",
                      color: "oklch(0.500 0.060 145)",
                    }}
                  >
                    {t(product.tagKey)}
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-1 gap-3">
                  <h3
                    className="font-['Playfair_Display'] font-400"
                    style={{ fontSize: "1.125rem", color: "oklch(0.265 0.015 55)" }}
                  >
                    {t(product.nameKey)}
                  </h3>
                  <p
                    className="font-['Lato'] font-300 leading-relaxed flex-1"
                    style={{ fontSize: "0.875rem", color: "oklch(0.520 0.020 60)" }}
                  >
                    {t(product.descKey)}
                  </p>

                  {/* Price + Add to Cart */}
                  <div
                    className="flex items-center justify-between mt-2 pt-4 border-t"
                    style={{ borderColor: "oklch(0.870 0.018 130)" }}
                  >
                    <span
                      className="font-['Playfair_Display'] font-400"
                      style={{ fontSize: "1rem", color: "oklch(0.265 0.015 55)" }}
                    >
                      {currency === "TWD"
                        ? `NT$${Math.round(product.priceUSD * 32)}`
                        : `$${product.priceUSD}`}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="text-xs font-['Lato'] font-400 tracking-[0.15em] uppercase px-4 py-2 transition-all duration-300"
                      style={{ background: "oklch(0.500 0.060 145)", color: "#FAFAF7" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "oklch(0.420 0.060 145)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "oklch(0.500 0.060 145)";
                      }}
                    >
                      {t("products.addToCart")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow — desktop only */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-10 p-2 transition-all duration-300"
            style={{
              opacity: canScrollRight ? 1 : 0.25,
              pointerEvents: canScrollRight ? "auto" : "none",
              color: "oklch(0.500 0.060 145)",
            }}
            aria-label="Scroll right"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Dot indicators — mobile only */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToCard(idx)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: idx === activeIndex
                  ? "oklch(0.500 0.060 145)"
                  : "oklch(0.800 0.020 95)",
                transform: idx === activeIndex ? "scale(1.3)" : "scale(1)",
              }}
              aria-label={`Go to product ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
