/*
 * YING-LI TEA -- Brewing Tutorial Section
 * Two side-by-side videos: hot brew (left) and cold brew (right)
 * Responsive: side-by-side on desktop, stacked on mobile
 */

const HOT_BREW_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/20260331_%E7%86%B1%E6%B3%A1_7b3f72f9.mp4";
const COLD_BREW_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/20260331_%E5%86%B7%E6%B3%A1_35797947.mp4";

interface BrewCardProps {
  title: string;
  subtitle: string;
  steps: string[];
  videoUrl: string;
  accentColor: string;
}

function BrewCard({ title, subtitle, steps, videoUrl, accentColor }: BrewCardProps) {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "oklch(0.990 0.004 95)",
        border: "1px solid oklch(0.870 0.018 130)",
        boxShadow: "0 4px 24px oklch(0.265 0.015 55 / 0.06)",
      }}
    >
      <div className="relative w-full" style={{ aspectRatio: "9/16", background: "#000" }}>
        <video
          className="w-full h-full object-cover"
          controls
          playsInline
          preload="metadata"
          style={{ display: "block" }}
        >
          <source src={videoUrl} type="video/mp4" />
          您的瀏覽器不支援影片播放。
        </video>
      </div>

      <div className="p-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-8 rounded-full flex-shrink-0"
            style={{ background: accentColor }}
          />
          <div>
            <h3
              className="font-['Playfair_Display'] font-400 leading-tight"
              style={{ fontSize: "1.35rem", color: "oklch(0.265 0.015 55)" }}
            >
              {title}
            </h3>
            <p
              className="font-['Lato'] font-300 text-sm mt-0.5"
              style={{ color: "oklch(0.552 0.016 285.938)" }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        <ol className="space-y-2 mt-1">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-['Lato'] font-600 mt-0.5"
                style={{
                  background: `color-mix(in oklch, ${accentColor} 15%, transparent)`,
                  color: accentColor,
                  border: `1px solid color-mix(in oklch, ${accentColor} 35%, transparent)`,
                }}
              >
                {i + 1}
              </span>
              <span
                className="font-['Lato'] font-300 text-sm leading-relaxed"
                style={{ color: "oklch(0.400 0.015 55)" }}
              >
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function BrewingSection() {
  const hotSteps = [
    "取 3–5g 茶葉放入茶壺或茶杯",
    "注入 85–95°C 熱水（約 200ml）",
    "浸泡 2–3 分鐘後取出茶葉",
    "可回沖 2–3 次，風味層次更豐富",
  ];

  const coldSteps = [
    "取 5–8g 茶葉放入冷水壺",
    "加入 500–700ml 冷開水或礦泉水",
    "放入冰箱冷藏 6–8 小時（或隔夜）",
    "取出茶葉，享用清爽甘甜的冷泡茶",
  ];

  return (
    <section
      className="py-16 md:py-24"
      style={{ background: "oklch(0.975 0.006 90)" }}
    >
      <div className="container">
        <div className="mb-12 text-center">
          <p
            className="font-['Lato'] font-400 tracking-[0.2em] uppercase text-xs mb-3"
            style={{ color: "oklch(0.500 0.060 145)" }}
          >
            How To Brew
          </p>
          <h2
            className="font-['Playfair_Display'] font-400"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "oklch(0.265 0.015 55)",
              letterSpacing: "-0.01em",
            }}
          >
            沖泡教學
          </h2>
          <p
            className="font-['Lato'] font-300 mt-3 max-w-md mx-auto text-sm leading-relaxed"
            style={{ color: "oklch(0.552 0.016 285.938)" }}
          >
            無論您偏好熱泡的醇厚香氣，還是冷泡的清爽甘甜，迎利茶都能為您帶來最佳的品茶體驗。
          </p>
          <div
            className="w-12 h-px mx-auto mt-6"
            style={{ background: "oklch(0.500 0.060 145)" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <BrewCard
            title="熱泡"
            subtitle="Hot Brew · 醇厚香氣"
            steps={hotSteps}
            videoUrl={HOT_BREW_URL}
            accentColor="oklch(0.600 0.120 50)"
          />
          <BrewCard
            title="冷泡"
            subtitle="Cold Brew · 清爽甘甜"
            steps={coldSteps}
            videoUrl={COLD_BREW_URL}
            accentColor="oklch(0.500 0.060 145)"
          />
        </div>
      </div>
    </section>
  );
}
