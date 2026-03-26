/*
 * YING-LI TEA — PRODUCTS SECTION
 * Design: Clean 3-column grid with generous breathing room.
 * Warm white background. Cards in cream with subtle shadow on hover.
 * Featured product (Cold Brew) gets a larger card.
 */
import { useEffect, useRef } from "react";

const COLD_BREW_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-cold-brew-agse5jexCShDqGcKJ96SoK.webp";
const TEA_BAGS_IMG  = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-tea-bags-BQ6hFsR5su8dVrfZPRo3ZW.webp";

const products = [
  {
    id: 1,
    name: "Oolong Cold Brew Tea",
    tag: "Signature",
    description:
      "A smooth, refreshing Taiwanese oolong crafted for cold brewing. Light, floral, and easy to enjoy — perfect for a crisp and calming tea experience.",
    price: "From $18",
    image: COLD_BREW_IMG,
    featured: true,
  },
  {
    id: 2,
    name: "Oolong Tea Bags",
    tag: "Everyday",
    description:
      "Convenient Taiwanese oolong tea bags with a clean, fragrant flavor. Easy to brew anytime while still preserving the elegance of traditional tea.",
    price: "From $14",
    image: TEA_BAGS_IMG,
    featured: false,
  },
  {
    id: 3,
    name: "Coming Soon",
    tag: "Collection",
    description:
      "More Taiwanese tea varieties are on their way. Our next collection will explore the full depth of Taiwan's extraordinary tea landscape.",
    price: "—",
    image: null,
    featured: false,
    comingSoon: true,
  },
];

export default function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
          <span className="eyebrow reveal">Our Collection</span>
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
              Teas from Taiwan
            </h2>
            <p
              className="font-['Lato'] font-300 max-w-xs reveal"
              style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
            >
              Each tea is selected for its purity, fragrance, and ability to bring
              a quiet clarity to your day.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className={`reveal flex flex-col group ${product.featured ? "md:col-span-1" : ""}`}
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              {/* Image Area */}
              <div
                className="overflow-hidden mb-5 relative"
                style={{
                  aspectRatio: "3/4",
                  background: product.comingSoon
                    ? "oklch(0.962 0.008 90)"
                    : "oklch(0.962 0.008 90)",
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    {/* Tea leaf SVG placeholder */}
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M24 4C24 4 8 14 8 28C8 36.837 15.163 44 24 44C32.837 44 40 36.837 40 28C40 14 24 4 24 4Z"
                        stroke="oklch(0.840 0.030 140)"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <path
                        d="M24 44C24 44 24 24 24 14"
                        stroke="oklch(0.840 0.030 140)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M24 30C24 30 16 24 12 20"
                        stroke="oklch(0.840 0.030 140)"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                      <path
                        d="M24 26C24 26 32 20 36 16"
                        stroke="oklch(0.840 0.030 140)"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      className="eyebrow"
                      style={{ color: "oklch(0.840 0.030 140)" }}
                    >
                      Coming Soon
                    </span>
                  </div>
                )}

                {/* Tag Badge */}
                <span
                  className="absolute top-4 left-4 eyebrow px-3 py-1"
                  style={{
                    background: "oklch(0.990 0.004 95)",
                    color: "oklch(0.500 0.060 145)",
                  }}
                >
                  {product.tag}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1 gap-3">
                <h3
                  className="font-['Playfair_Display'] font-400"
                  style={{ fontSize: "1.25rem", color: "oklch(0.265 0.015 55)" }}
                >
                  {product.name}
                </h3>
                <p
                  className="font-['Lato'] font-300 leading-relaxed flex-1"
                  style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
                >
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-2 pt-4 border-t" style={{ borderColor: "oklch(0.870 0.018 130)" }}>
                  <span
                    className="font-['Playfair_Display'] font-400"
                    style={{ fontSize: "1.0625rem", color: "oklch(0.265 0.015 55)" }}
                  >
                    {product.price}
                  </span>
                  {!product.comingSoon && (
                    <button
                      className="text-xs font-['Lato'] font-400 tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-300"
                      style={{
                        color: "oklch(0.500 0.060 145)",
                        borderColor: "oklch(0.500 0.060 145)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "oklch(0.500 0.060 145)";
                        (e.currentTarget as HTMLElement).style.color = "#FAFAF7";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "oklch(0.500 0.060 145)";
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
