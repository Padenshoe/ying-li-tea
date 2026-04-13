/*
 * YING-LI TEA — FEATURED PRODUCT SECTION
 * Design: Full-width asymmetric layout. 360° rotating gift box animation left, text right.
 * Uses two images alternating with CSS 3D perspective to simulate a slow 360° rotation.
 */
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

const BOX_IMG_1 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/teabox-angle1_3a6fa94f.jpg";
const BOX_IMG_2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/teabox-angle2_79a47807.jpg";

export default function FeaturedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [rotY, setRotY] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Smooth continuous rotation: 360° every 8 seconds
  useEffect(() => {
    const speed = 360 / 8000; // degrees per ms
    const animate = (timestamp: number) => {
      if (lastTimeRef.current !== null) {
        const delta = timestamp - lastTimeRef.current;
        setRotY((prev) => (prev + speed * delta) % 360);
      }
      lastTimeRef.current = timestamp;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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

  // Determine which face to show and its opacity based on rotation angle
  // Front face (img1): visible when rotY is 0–90 or 270–360
  // Back face (img2): visible when rotY is 90–270
  // We use two images with scaleX transform to simulate 3D rotation
  const normalizedRot = ((rotY % 360) + 360) % 360;

  // Compute apparent scaleX: cos(rotY in radians)
  const cosVal = Math.cos((normalizedRot * Math.PI) / 180);
  const scaleX = Math.abs(cosVal);
  // Which image to show: img1 when cosVal >= 0, img2 when cosVal < 0
  const showImg1 = cosVal >= 0;
  const currentImg = showImg1 ? BOX_IMG_1 : BOX_IMG_2;

  return (
    <section
      ref={sectionRef}
      className="py-0 overflow-hidden"
      style={{ background: "oklch(0.990 0.004 95)" }}
    >
      <div className="grid md:grid-cols-2 min-h-[650px] md:min-h-[780px]">
        {/* 360° Rotating Box — Left */}
        <div
          className="relative overflow-hidden flex items-center justify-center"
          style={{ minHeight: "480px", background: "#F5F1E8" }}
        >
          <div
            className="relative flex items-center justify-center"
            style={{ width: "85%", maxWidth: "480px" }}
          >
            {/* Shadow under box */}
            <div
              style={{
                position: "absolute",
                bottom: "-12px",
                left: "50%",
                transform: `translateX(-50%) scaleX(${0.6 + scaleX * 0.4})`,
                width: "70%",
                height: "18px",
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)",
                transition: "none",
              }}
            />
            <img
              src={currentImg}
              alt="阿里山茶包禮盒"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                transform: `scaleX(${scaleX})`,
                transition: "none",
                display: "block",
                userSelect: "none",
                pointerEvents: "none",
              }}
              draggable={false}
            />
          </div>

          {/* Subtle overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, transparent 70%, oklch(0.990 0.004 95) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Text — Right */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-24">
          <span
            className="eyebrow reveal mb-4"
            style={{ color: "oklch(0.730 0.070 75)" }}
          >
            {t("featured.label")}
          </span>
          <div className="divider-short reveal mb-6" />

          <h2
            className="font-['Playfair_Display'] font-400 reveal mb-4"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              color: "oklch(0.265 0.015 55)",
              lineHeight: 1.2,
            }}
          >
            {t("featured.title")}
          </h2>

          <p
            className="font-['Lato'] font-300 leading-loose reveal mb-8"
            style={{ fontSize: "1rem", color: "oklch(0.520 0.020 60)", maxWidth: "38ch" }}
          >
            {t("featured.description")}
          </p>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 mb-10 reveal">
            {[
              { label: t("featured.format"), value: t("featured.giftBox") },
              { label: t("featured.origin"), value: t("featured.taiwan") },
              { label: t("featured.perfectFor"), value: t("featured.gifting") },
            ].map((detail) => (
              <div
                key={detail.label}
                className="flex flex-col gap-1 border-l pl-4"
                style={{ borderColor: "oklch(0.870 0.018 130)" }}
              >
                <span className="eyebrow" style={{ color: "oklch(0.500 0.060 145)" }}>
                  {detail.label}
                </span>
                <span
                  className="font-['Playfair_Display'] font-400"
                  style={{ fontSize: "1rem", color: "oklch(0.265 0.015 55)" }}
                >
                  {detail.value}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex gap-4 reveal">
            <button
              onClick={() => navigate("/products")}
              className="px-7 py-3 text-xs font-['Lato'] font-400 tracking-[0.18em] uppercase transition-all duration-300"
              style={{ background: "oklch(0.500 0.060 145)", color: "#FAFAF7" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.420 0.060 145)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.500 0.060 145)";
              }}
            >
              {t("hero.shopNow")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
