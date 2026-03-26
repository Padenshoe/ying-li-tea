/*
 * YING-LI TEA — MARQUEE BANNER STRIP
 * Design: Thin horizontal band with scrolling text.
 * Soft moss green background, cream text.
 * Adds visual rhythm between sections.
 */

const items = [
  "Taiwanese Tea",
  "·",
  "High Mountain Oolong",
  "·",
  "Cold Brew",
  "·",
  "Tea Bags",
  "·",
  "Crafted with Calm",
  "·",
  "Origin: Taiwan",
  "·",
  "Premium Quality",
  "·",
];

export default function MarqueeBanner() {
  const repeated = [...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden py-3 select-none"
      style={{ background: "oklch(0.500 0.060 145)" }}
    >
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 28s linear infinite" }}
      >
        {repeated.map((item, idx) => (
          <span
            key={idx}
            className="font-['Lato'] font-300 text-xs tracking-[0.18em] uppercase px-4"
            style={{ color: "oklch(0.900 0.015 120)" }}
          >
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
