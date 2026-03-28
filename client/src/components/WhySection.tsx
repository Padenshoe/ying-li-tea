/*
 * YING-LI TEA — WHY CHOOSE US SECTION
 * Design: Cream background, 4 feature points in a 2x2 grid.
 * Each point has a minimal icon, short heading, and brief description.
 * Quiet, premium, understated.
 */
import { useEffect, useRef } from "react";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2C14 2 4 9 4 17C4 22.523 8.477 27 14 27C19.523 27 24 22.523 24 17C24 9 14 2 14 2Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
        <path d="M14 27V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M14 20C14 20 9 17 7 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <path d="M14 17C14 17 19 14 21 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    heading: "Qingxin Oolong — Taiwan's Legacy",
    body: "All our teas are crafted from Qingxin (青心烏龍) — a tea varietal invented by Taiwanese growers. Our processing methods have evolved over a century, creating a flavor profile that is uniquely Taiwanese and unmatched worldwide. Taiwan oolong is simply the best.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M9 14C9 14 11 18 14 18C17 18 19 14 19 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="14" cy="10" r="1.5" fill="currentColor"/>
      </svg>
    ),
    heading: "Clean & Minimal Experience",
    body: "We strip away complexity so you can focus on what matters — the tea itself. No artificial flavors, no unnecessary additives. Just pure, honest tea.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 3L16.5 10H24L18 14.5L20.5 21.5L14 17L7.5 21.5L10 14.5L4 10H11.5L14 3Z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
    heading: "High-Quality Leaves",
    body: "We are selective by nature. Only teas that meet our standard of fragrance, clarity, and character make it into the Ying-Li collection.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="10" width="20" height="14" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M9 10V7C9 4.791 11.239 3 14 3C16.761 3 19 4.791 19 7V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="14" cy="17" r="2" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    heading: "Tradition Meets Convenience",
    body: "Whether you prefer the ritual of loose-leaf cold brewing or the ease of a tea bag, Ying-Li offers both — without compromising on elegance.",
  },
];

export default function WhySection() {
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="why"
      ref={sectionRef}
      className="py-24 md:py-36"
      style={{ background: "oklch(0.962 0.008 90)" }}
    >
      <div className="container">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <span className="eyebrow reveal">Why Ying-Li</span>
          <div className="divider-short mt-3 mb-5 reveal" />
          <h2
            className="font-['Playfair_Display'] font-400 reveal"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "oklch(0.265 0.015 55)",
              lineHeight: 1.15,
            }}
          >
            The Ying-Li Difference
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-14">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="reveal flex flex-col gap-4"
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              {/* Icon */}
              <div style={{ color: "oklch(0.500 0.060 145)" }}>
                {feature.icon}
              </div>
              {/* Divider */}
              <div className="divider-short" />
              {/* Heading */}
              <h3
                className="font-['Playfair_Display'] font-400"
                style={{ fontSize: "1.25rem", color: "oklch(0.265 0.015 55)" }}
              >
                {feature.heading}
              </h3>
              {/* Body */}
              <p
                className="font-['Lato'] font-300 leading-loose"
                style={{ fontSize: "0.9375rem", color: "oklch(0.520 0.020 60)" }}
              >
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
