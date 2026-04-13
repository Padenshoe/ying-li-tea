/*
 * 專屬選茶 — Tea Recommendation Quiz
 * 5 questions → recommend 1 product → add to cart
 */
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Check, ChevronRight, RotateCcw, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ContactFooter from "@/components/ContactFooter";
import { Link } from "wouter";

// ─── Product data (mirrors Products.tsx) ───────────────────────────────────
const IMG = {
  sanlinxi:      "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/Gemini_Generated_Image_gf0qa6gf0qa6gf0q_b079c890.png",
  alishan:       "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/Gemini_Generated_Image_ubybu5ubybu5ubyb_3d5afa9f.jpg",
  cuifeng:       "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/Gemini_Generated_Image_fumk61fumk61fumk_62be393b.jpg",
  lishan:        "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/Gemini_Generated_Image_aify73aify73aify_a1bf72fd.png",
  fushoushan:    "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/Gemini_Generated_Image_dmtfc8dmtfc8dmtf_4fe395c2.png",
  alishanRoasted:"https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/Gemini_Generated_Image_z5c0tsz5c0tsz5c0_c363d941.jpg",
};

interface RecommendedProduct {
  id: string;
  name: string;
  nameKey: string;
  price: number;
  weight: string;
  image: string;
  season: string;
  reason: string;
  notes: [string, string, string];
}

const ALL_PRODUCTS: RecommendedProduct[] = [
  { id: "S01", name: "杉林溪春茶", nameKey: "product.sanlinxi.spring", price: 400, weight: "150g（四兩）", image: IMG.sanlinxi, season: "春茶", reason: "口味偏重、喜歡回甘，杉林溪春茶的濃郁茶氣與持久回甘最適合您。", notes: ["茶湯金黃透亮，入口濃郁甘醇", "花香與蜜香交融，回甘持久悠長", "春季嫩芽精製，茶氣飽滿厚實"] },
  { id: "S02", name: "杉林溪冬茶", nameKey: "product.sanlinxi.winter", price: 400, weight: "150g（四兩）", image: IMG.sanlinxi, season: "冬茶", reason: "口味清淡、喜歡清香，杉林溪冬茶的淡雅花香與清甜喉韻最適合您。", notes: ["茶湯清澈淡雅，入口清香順口", "冬季低溫慢長，茶葉細膩柔和", "清新花香縈繞，喉韻清甜爽口"] },
  { id: "A01", name: "阿里山春茶", nameKey: "product.alishan.spring", price: 1100, weight: "300g（半斤）", image: IMG.alishan, season: "春茶", reason: "喜歡奶香花香交融的層次感，阿里山春茶的蜜綠茶湯與奶香最適合您。", notes: ["高山雲霧孕育，茶湯蜜綠清亮", "春芽飽滿鮮嫩，滋味濃郁回甘", "奶香與花香並存，層次豐富迷人"] },
  { id: "A02", name: "阿里山冬茶", nameKey: "product.alishan.winter", price: 1100, weight: "300g（半斤）", image: IMG.alishan, season: "冬茶", reason: "喜歡滑順口感、淡雅花香，阿里山冬茶的絲滑茶湯與清揚香氣最適合您。", notes: ["冬季低溫緩慢生長，香氣格外清揚", "茶湯清澈柔順，入喉絲滑無澀感", "淡雅花香持久，回甘清甜舒暢"] },
  { id: "R01", name: "翠峰春茶", nameKey: "product.cuifeng.spring", price: 1300, weight: "300g（半斤）", image: IMG.cuifeng, season: "春茶", reason: "喜歡蘭花香氣與醇厚滋味，翠峰春茶的中央山脈特選茶葉最適合您。", notes: ["中央山脈特選，茶湯翠綠鮮活", "春茶氣息濃郁，蘭花香氣撲鼻", "滋味醇厚甘甜，回韻悠長持久"] },
  { id: "R02", name: "翠峰冬茶", nameKey: "product.cuifeng.winter", price: 1300, weight: "300g（半斤）", image: IMG.cuifeng, season: "冬茶", reason: "喜歡清爽不苦澀的口感，翠峰冬茶的青草香氣與甘潤喉韻最適合您。", notes: ["冬季山嵐輕撫，茶葉清香細膩", "入口清爽不苦澀，喉韻甘潤舒適", "淡淡青草香氣，令人心曠神怡"] },
  { id: "L01", name: "精緻梨山春茶", nameKey: "product.lishan.spring", price: 950, weight: "150g（四兩）", image: IMG.lishan, season: "春茶", reason: "喜歡蜜香花香交織的高山茶，梨山春茶的海拔兩千公尺孕育最適合您。", notes: ["海拔兩千公尺以上，高山冷涼孕育", "春茶滋味濃郁飽滿，蜜香花香交織", "入口甘甜醇厚，回甘持久令人回味"] },
  { id: "L02", name: "精緻梨山冬茶", nameKey: "product.lishan.winter", price: 950, weight: "150g（四兩）", image: IMG.lishan, season: "冬茶", reason: "喜歡如蘭清香與柔順口感，梨山冬茶的細膩茶葉最適合您。", notes: ["冬季高山嚴寒，茶葉緩慢積累精華", "清香淡雅如蘭，口感柔順無苦澀", "喉韻清甜悠長，餘香在口中縈繞"] },
  { id: "D01", name: "精緻福壽山春茶", nameKey: "product.fushoushan.spring", price: 1750, weight: "150g（四兩）", image: IMG.fushoushan, season: "春茶", reason: "追求頂級高山茶體驗，福壽山春茶的蜜香果香層次最適合您。", notes: ["台灣頂級高山茶，海拔超過兩千五百公尺", "春茶香氣馥郁，蜜香果香層層疊現", "茶湯金黃透亮，滋味醇厚甘甜無比"] },
  { id: "D02", name: "精緻福壽山冬茶", nameKey: "product.fushoushan.winter", price: 1750, weight: "150g（四兩）", image: IMG.fushoushan, season: "冬茶", reason: "追求極致清雅與絲滑口感，福壽山冬茶是送禮自用的頂級之選。", notes: ["冬季極寒高山，茶葉精華高度濃縮", "清雅花香如幽蘭，入口絲滑無比", "回甘持久悠長，是送禮自用的極品"] },
  { id: "RO1", name: "阿里山烘焙茶", nameKey: "product.alishan.roasted", price: 1400, weight: "300g（半斤）", image: IMG.alishanRoasted, season: "烘焙茶", reason: "喜歡焙火香氣與醇厚溫潤口感，阿里山烘焙茶的炭焙工藝最適合您。", notes: ["傳統炭焙工藝，焙火香氣深沉迷人", "茶湯琥珀色澤，口感醇厚溫潤順滑", "焦糖甜香縈繞，暖胃養身四季皆宜"] },
];

// ─── Quiz questions ─────────────────────────────────────────────────────────
interface Question {
  id: number;
  question: string;
  options: { label: string; value: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "平常吃東西的口味偏好？",
    options: [
      { label: "重口味", value: "heavy" },
      { label: "中等", value: "medium" },
      { label: "清淡", value: "light" },
    ],
  },
  {
    id: 2,
    question: "您喝茶的頻率？",
    options: [
      { label: "每天喝", value: "daily" },
      { label: "每個禮拜喝", value: "weekly" },
      { label: "每個月喝", value: "monthly" },
      { label: "幾乎沒在喝茶", value: "rarely" },
    ],
  },
  {
    id: 3,
    question: "您最重視的口感？",
    options: [
      { label: "回甘", value: "aftertaste" },
      { label: "滑順", value: "smooth" },
      { label: "香氣", value: "aroma" },
    ],
  },
  {
    id: 4,
    question: "您平常喝什麼比較多？",
    options: [
      { label: "無糖茶", value: "unsweetened" },
      { label: "手搖飲", value: "bubble_tea" },
      { label: "咖啡", value: "coffee" },
      { label: "幾乎沒在喝茶", value: "none" },
    ],
  },
  {
    id: 5,
    question: "您喜歡的茶葉味道？",
    options: [
      { label: "奶香", value: "milky" },
      { label: "清香", value: "floral" },
      { label: "濃厚", value: "rich" },
    ],
  },
];

// ─── Recommendation logic ────────────────────────────────────────────────────
// Priority order:
// 1. 香氣 → 烘焙茶 (overrides everything)
// 2. 幾乎沒在喝茶 → 阿里山
// 3. 濃厚 → 春茶
// 4. 清淡 → 冬茶 / 重口味 → 春茶
// 5. 回甘 → 春茶 / 滑順 → 冬茶
// 6. 頻率越高 → 越貴款（福壽山 > 梨山 > 翠峰 > 阿里山 > 杉林溪）
function recommend(answers: Record<number, string>): RecommendedProduct {
  const taste = answers[1];       // heavy / medium / light
  const frequency = answers[2];   // daily / weekly / monthly / rarely
  const texture = answers[3];     // aftertaste / smooth / aroma
  // answers[4] drink preference is secondary context
  const flavor = answers[5];      // milky / floral / rich

  // Rule 1: 香氣 → 一律烘焙茶
  if (texture === "aroma") {
    return ALL_PRODUCTS.find((p) => p.id === "RO1")!;
  }

  // Rule 2: 幾乎沒在喝茶 → 阿里山（依口味選春/冬）
  if (frequency === "rarely") {
    if (taste === "heavy" || texture === "aftertaste" || flavor === "rich") {
      return ALL_PRODUCTS.find((p) => p.id === "A01")!; // 阿里山春茶
    }
    return ALL_PRODUCTS.find((p) => p.id === "A02")!; // 阿里山冬茶
  }

  // Rule 3: 濃厚 → 春茶（依頻率選等級）
  if (flavor === "rich") {
    if (frequency === "daily") return ALL_PRODUCTS.find((p) => p.id === "D01")!;   // 福壽山春茶
    if (frequency === "weekly") return ALL_PRODUCTS.find((p) => p.id === "L01")!;  // 梨山春茶
    return ALL_PRODUCTS.find((p) => p.id === "R01")!; // 翠峰春茶
  }

  // Rule 4a: 清淡 → 冬茶（依頻率選等級）
  if (taste === "light") {
    if (frequency === "daily") return ALL_PRODUCTS.find((p) => p.id === "D02")!;   // 福壽山冬茶
    if (frequency === "weekly") return ALL_PRODUCTS.find((p) => p.id === "L02")!;  // 梨山冬茶
    if (frequency === "monthly") return ALL_PRODUCTS.find((p) => p.id === "R02")!; // 翠峰冬茶
    return ALL_PRODUCTS.find((p) => p.id === "A02")!; // 阿里山冬茶（monthly fallback）
  }

  // Rule 4b: 重口味 → 春茶（依頻率選等級）
  if (taste === "heavy") {
    if (frequency === "daily") return ALL_PRODUCTS.find((p) => p.id === "D01")!;   // 福壽山春茶
    if (frequency === "weekly") return ALL_PRODUCTS.find((p) => p.id === "L01")!;  // 梨山春茶
    if (frequency === "monthly") return ALL_PRODUCTS.find((p) => p.id === "R01")!; // 翠峰春茶
    return ALL_PRODUCTS.find((p) => p.id === "A01")!; // 阿里山春茶
  }

  // Rule 5a: 回甘 → 春茶（依頻率選等級）
  if (texture === "aftertaste") {
    if (frequency === "daily") return ALL_PRODUCTS.find((p) => p.id === "D01")!;   // 福壽山春茶
    if (frequency === "weekly") return ALL_PRODUCTS.find((p) => p.id === "L01")!;  // 梨山春茶
    if (frequency === "monthly") return ALL_PRODUCTS.find((p) => p.id === "R01")!; // 翠峰春茶
    return ALL_PRODUCTS.find((p) => p.id === "A01")!; // 阿里山春茶
  }

  // Rule 5b: 滑順 → 冬茶（依頻率選等級）
  if (texture === "smooth") {
    if (frequency === "daily") return ALL_PRODUCTS.find((p) => p.id === "D02")!;   // 福壽山冬茶
    if (frequency === "weekly") return ALL_PRODUCTS.find((p) => p.id === "L02")!;  // 梨山冬茶
    if (frequency === "monthly") return ALL_PRODUCTS.find((p) => p.id === "R02")!; // 翠峰冬茶
    return ALL_PRODUCTS.find((p) => p.id === "A02")!; // 阿里山冬茶
  }

  // Default: medium taste → 依頻率選等級，春冬各半
  if (frequency === "daily") return ALL_PRODUCTS.find((p) => p.id === "D01")!;
  if (frequency === "weekly") return ALL_PRODUCTS.find((p) => p.id === "L01")!;
  return ALL_PRODUCTS.find((p) => p.id === "A02")!; // 阿里山冬茶 fallback
}

// ─── Season badge colors ─────────────────────────────────────────────────────
const SEASON_COLORS: Record<string, string> = {
  春茶: "bg-emerald-100 text-emerald-800 border-emerald-200",
  冬茶: "bg-sky-100 text-sky-800 border-sky-200",
  烘焙茶: "bg-amber-100 text-amber-800 border-amber-200",
};

// ─── Main component ──────────────────────────────────────────────────────────
export default function TeaQuizPage() {
  const [currentQ, setCurrentQ] = useState(0); // 0 = intro, 1-5 = questions, 6 = result
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<RecommendedProduct | null>(null);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAnswer = (qId: number, value: string) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);

    if (qId === QUESTIONS.length) {
      // Last question answered → compute result
      const rec = recommend(newAnswers);
      setResult(rec);
      setCurrentQ(6);
    } else {
      setCurrentQ(qId + 1);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
    setAdded(false);
    setQty(1);
  };

  const handleAddToCart = () => {
    if (!result) return;
    addItem({
      id: result.id,
      name: result.name,
      nameKey: result.nameKey,
      price: result.price,
      quantity: qty,
      image: result.image,
    });
    setAdded(true);
    toast({
      title: "已加入購物車",
      description: `${result.name} × ${qty}`,
    });
    setTimeout(() => setAdded(false), 2500);
  };

  const progress = currentQ === 0 ? 0 : currentQ === 6 ? 100 : Math.round((currentQ / QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">

          {/* ── Intro ── */}
          {currentQ === 0 && (
            <div className="text-center">
              <p className="text-xs tracking-[0.25em] text-stone-400 uppercase mb-3">Ying-Li Tea</p>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">專屬選茶</h1>
              <p className="text-stone-500 text-sm leading-relaxed mb-2 max-w-md mx-auto">
                回答 5 個簡單問題，根據您的口味偏好，我們將為您精準推薦最適合的一款茶葉。
              </p>
              <p className="text-stone-400 text-xs mb-10">約需 1 分鐘</p>

              {/* Decorative tea leaf */}
              <div className="flex justify-center mb-10">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.960 0.012 145)" }}
                >
                  <Leaf className="w-9 h-9" style={{ color: "oklch(0.500 0.060 145)" }} />
                </div>
              </div>

              <Button
                onClick={() => setCurrentQ(1)}
                className="px-10 py-3 text-base font-medium"
                style={{ background: "oklch(0.500 0.060 145)" }}
              >
                開始選茶
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {/* ── Questions 1–5 ── */}
          {currentQ >= 1 && currentQ <= 5 && (() => {
            const q = QUESTIONS[currentQ - 1];
            return (
              <div>
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs text-stone-400 mb-2">
                    <span>問題 {currentQ} / {QUESTIONS.length}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, background: "oklch(0.500 0.060 145)" }}
                    />
                  </div>
                </div>

                {/* Question card */}
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 mb-6">
                  <h2 className="text-xl font-bold text-stone-800 mb-8 text-center leading-relaxed">
                    {q.question}
                  </h2>
                  <div className="grid gap-3">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(q.id, opt.value)}
                        className="w-full py-4 px-6 rounded-xl border-2 text-left text-sm font-medium transition-all duration-200 hover:border-stone-400 hover:bg-stone-50"
                        style={{
                          borderColor: "oklch(0.870 0.018 130)",
                          color: "oklch(0.400 0.015 55)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.500 0.060 145)";
                          (e.currentTarget as HTMLElement).style.background = "oklch(0.975 0.008 145)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.870 0.018 130)";
                          (e.currentTarget as HTMLElement).style.background = "";
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Back button */}
                {currentQ > 1 && (
                  <button
                    onClick={() => setCurrentQ(currentQ - 1)}
                    className="text-xs text-stone-400 hover:text-stone-600 transition-colors mx-auto block"
                  >
                    ← 上一題
                  </button>
                )}
              </div>
            );
          })()}

          {/* ── Result ── */}
          {currentQ === 6 && result && (
            <div>
              {/* Header */}
              <div className="text-center mb-8">
                <p className="text-xs tracking-[0.25em] text-stone-400 uppercase mb-2">您的專屬推薦</p>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">為您精準推薦</h2>
                <p className="text-stone-500 text-sm">根據您的口味偏好，我們為您找到了最適合的茶葉</p>
              </div>

              {/* Recommendation card */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-md overflow-hidden mb-6">
                {/* Product image */}
                <div className="relative aspect-video overflow-hidden bg-stone-50">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Season badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${SEASON_COLORS[result.season]}`}>
                      {result.season}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Product name & weight */}
                  <h3 className="text-xl font-bold text-stone-800 mb-1">{result.name}</h3>
                  <p className="text-xs text-stone-400 mb-4">{result.weight}</p>

                  {/* Why recommended */}
                  <div
                    className="rounded-xl p-4 mb-5"
                    style={{ background: "oklch(0.975 0.008 145)" }}
                  >
                    <p className="text-xs font-semibold mb-1" style={{ color: "oklch(0.500 0.060 145)" }}>
                      為什麼推薦這款？
                    </p>
                    <p className="text-sm text-stone-600 leading-relaxed">{result.reason}</p>
                  </div>

                  {/* Tasting notes */}
                  <div className="space-y-2 mb-6">
                    {result.notes.map((note, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Leaf className="w-3.5 h-3.5 text-stone-300 mt-0.5 shrink-0" />
                        <p className="text-xs text-stone-500 leading-relaxed">{note}</p>
                      </div>
                    ))}
                  </div>

                  {/* Price + Quantity + Add to cart */}
                  <div className="flex items-center justify-between mb-4 pt-4 border-t border-stone-100">
                    <span className="text-2xl font-bold text-stone-800">
                      NT${result.price.toLocaleString()}
                    </span>
                    {/* Quantity selector */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                      >
                        <span className="text-base leading-none">−</span>
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-stone-800 select-none">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.min(99, q + 1))}
                        className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                      >
                        <span className="text-base leading-none">+</span>
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className={`w-full py-3 text-base transition-all duration-200 ${
                      added
                        ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                        : ""
                    }`}
                    style={added ? {} : { background: "oklch(0.500 0.060 145)" }}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        已加入購物車
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        加入購物車
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  重新測驗
                </button>
                <Link href="/products">
                  <span className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border text-sm transition-colors cursor-pointer hover:bg-stone-50"
                    style={{ borderColor: "oklch(0.500 0.060 145)", color: "oklch(0.500 0.060 145)" }}
                  >
                    查看所有商品
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

      <ContactFooter />
    </div>
  );
}
