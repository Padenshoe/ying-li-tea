/*
 * YING-LI TEA — PRODUCTS SECTION
 * Design: Clean 3-column grid with generous breathing room.
 * Content: Taiwan oolong specialization with multiple price points
 */
import { useEffect, useRef } from "react";

const COLD_BREW_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-cold-brew-agse5jexCShDqGcKJ96SoK.webp";
const TEA_BAGS_IMG  = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-tea-bags-BQ6hFsR5su8dVrfZPRo3ZW.webp";

const products = [
  {
    id: 1,
    name: "Premium High-Mountain Oolong",
    tag: "Rare Selection",
    description:
      "Single-origin oolong from Alishan, Lishan & Dayuling. Complex floral notes, smooth finish. Officially certified.",
    price: "From $280",
    image: COLD_BREW_IMG,
  },
  {
    id: 2,
    name: "Cold Brew Oolong",
    tag: "Convenient",
    description:
      "Ready-to-brew format. All elevations available. Perfect for busy days without compromising on quality.",
    price: "From $120",
    image: TEA_BAGS_IMG,
  },
  {
    id: 3,
    name: "Entry-Level Oolong",
    tag: "Everyday",
    description:
      "Accessible quality oolong from Shanlinxi & Cuifeng. Smooth, approachable taste. Great for newcomers.",
    price: "From $80",
    image: COLD_BREW_IMG,
  },
  {
    id: 4,
    name: "Gift Collections",
    tag: "Special Edition",
    description:
      "Beautifully packaged multi-origin sets. Includes tasting notes. Perfect for gifting tea lovers.",
    price: "From $380",
    image: TEA_BAGS_IMG,
  },
  {
    id: 5,
    name: "Specialty Blends",
    tag: "Limited Edition",
    description:
      "Curated blends combining multiple regions. Unique flavor profiles. Officially certified.",
    price: "From $200",
    image: COLD_BREW_IMG,
  },
  {
    id: 6,
    name: "Loose Leaf Selection",
    tag: "Traditional",
    description:
      "Whole leaf oolong from all 6 regions. Full flavor, authentic experience. Multiple elevations.",
    price: "From $150",
    image: TEA_BAGS_IMG,
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
              Taiwan Oolong<br />
              <em>For Every Palate</em>
            </h2>
            <p
              className="font-['Lato'] font-300 max-w-xs reveal"
              style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
            >
              From entry-level to premium, all elevations, all officially certified. Loose leaf, cold brew, and gift collections.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="reveal flex flex-col group"
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              {/* Image Area */}
              <div
                className="overflow-hidden mb-5 relative"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src={product.image}
                  alt={product.name}
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
                  <button
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
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
