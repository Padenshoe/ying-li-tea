/*
 * YING-LI TEA — PRODUCTS SECTION
 * Design: Horizontal carousel with left/right scroll.
 * Content: Taiwan oolong specialization with multiple price points
 */
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const COLD_BREW_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-cold-brew-agse5jexCShDqGcKJ96SoK.webp";
const TEA_BAGS_IMG  = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-tea-bags-BQ6hFsR5su8dVrfZPRo3ZW.webp";

const products = [
  {
    id: 1,
    nameKey: "product.premium",
    tagKey: "product.premiumTag",
    descKey: "product.premiumDesc",
    priceKey: "product.premiumPrice",
    image: COLD_BREW_IMG,
  },
  {
    id: 2,
    nameKey: "product.coldBrew",
    tagKey: "product.coldBrewTag",
    descKey: "product.coldBrewDesc",
    priceKey: "product.coldBrewPrice",
    image: TEA_BAGS_IMG,
  },
  {
    id: 3,
    nameKey: "product.entry",
    tagKey: "product.entryTag",
    descKey: "product.entryDesc",
    priceKey: "product.entryPrice",
    image: COLD_BREW_IMG,
  },
  {
    id: 4,
    nameKey: "product.gift",
    tagKey: "product.giftTag",
    descKey: "product.giftDesc",
    priceKey: "product.giftPrice",
    image: TEA_BAGS_IMG,
  },
  {
    id: 5,
    nameKey: "product.specialty",
    tagKey: "product.specialtyTag",
    descKey: "product.specialtyDesc",
    priceKey: "product.specialtyPrice",
    image: COLD_BREW_IMG,
  },
  {
    id: 6,
    nameKey: "product.loose",
    tagKey: "product.looseTag",
    descKey: "product.looseDesc",
    priceKey: "product.loosePrice",
    image: TEA_BAGS_IMG,
  },
];

export default function ProductsSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  // Check scroll position
  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  const handleAddToCart = (product: typeof products[0]) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
    toast.success(`${t(product.nameKey)} added to cart!`, {
      description: `Quantity: ${(cart[product.id] || 0) + 1}`,
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
        <div className="mb-16 md:mb-20">
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
            <p
              className="font-['Lato'] font-300 max-w-xs reveal"
              style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
            >
              {t("products.description")}
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="reveal relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 z-10 p-2 transition-all duration-300"
            style={{
              opacity: canScrollLeft ? 1 : 0.3,
              pointerEvents: canScrollLeft ? "auto" : "none",
              color: "oklch(0.500 0.060 145)",
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Carousel */}
          <div
            ref={carouselRef}
            onScroll={checkScroll}
            className="flex gap-8 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollBehavior: "smooth", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-80 flex flex-col group"
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
                    style={{ fontSize: "1.25rem", color: "oklch(0.265 0.015 55)" }}
                  >
                    {t(product.nameKey)}
                  </h3>
                  <p
                    className="font-['Lato'] font-300 leading-relaxed flex-1"
                    style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
                  >
                    {t(product.descKey)}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-4 border-t" style={{ borderColor: "oklch(0.870 0.018 130)" }}>
                    <span
                      className="font-['Playfair_Display'] font-400"
                      style={{ fontSize: "1.0625rem", color: "oklch(0.265 0.015 55)" }}
                    >
                      {t(product.priceKey)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="text-xs font-['Lato'] font-400 tracking-[0.15em] uppercase px-4 py-2 transition-all duration-300"
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
                      {t("products.addToCart")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="absolute -right-6 md:-right-12 top-1/2 -translate-y-1/2 z-10 p-2 transition-all duration-300"
            style={{
              opacity: canScrollRight ? 1 : 0.3,
              pointerEvents: canScrollRight ? "auto" : "none",
              color: "oklch(0.500 0.060 145)",
            }}
            aria-label="Scroll right"
          >
            <ChevronRight size={28} />
          </button>

          {/* Hide scrollbar */}
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
