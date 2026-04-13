/*
 * YING-LI TEA — FEATURED PRODUCT SECTION
 * Design: Full-width asymmetric layout. Muted looping video of gift box left, text right.
 */
import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

const TEABOX_VIDEO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/teabox-rotation_67d9b0d7.mp4";

export default function FeaturedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  // Ensure video plays on mount (autoplay may need user gesture on some browsers)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {
        // Autoplay blocked — video will play on first user interaction
      });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 120);
            });
            // Resume video when section is visible
            videoRef.current?.play().catch(() => {});
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-0 overflow-hidden"
      style={{ background: "oklch(0.990 0.004 95)" }}
    >
      <div className="grid md:grid-cols-2 min-h-[650px] md:min-h-[780px]">
        {/* Video — Left */}
        <div
          className="relative overflow-hidden flex items-center justify-center"
          style={{ minHeight: "480px", background: "#F5F1E8" }}
        >
          <video
            ref={videoRef}
            src={TEABOX_VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Subtle right-edge overlay to blend into the text section */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent 70%, oklch(0.990 0.004 95) 100%)",
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
