/*
 * 中秋聯名禮盒 x 萬味軒
 * 三款聯名禮盒預購頁面
 * 付款方式：匯款（後五碼查帳）或線上刷卡
 * 8/31 前 9 折優惠
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import MiniFooter from "@/components/MiniFooter";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// ── 圖片路徑（storage proxy）──────────────────────────────────────────────
const IMG = {
  p1_1: "/manus-storage/midautumn_01_8c4b9476.webp",
  p1_2: "/manus-storage/midautumn_03_3c75f193.webp",
  p1_3: "/manus-storage/midautumn_02_b8bda480.webp",
  p2_1: "/manus-storage/midautumn_01_8c4b9476.webp",
  p2_2: "/manus-storage/midautumn_04_1c73177a.jpg",
  p2_3: "/manus-storage/midautumn_02_b8bda480.webp",
  p3_1: "/manus-storage/midautumn_05_ed07aff3.webp",
  p3_2: "/manus-storage/midautumn_06_e5193bf7.webp",
  p3_3: "/manus-storage/midautumn_02_b8bda480.webp",
};

const accentGold = "oklch(0.620 0.090 65)";
const accentRed = "oklch(0.420 0.140 22)";
const accentGreen = "oklch(0.380 0.070 145)";
const textDark = "oklch(0.265 0.015 55)";
const textMid = "oklch(0.520 0.020 60)";
const bgCream = "oklch(0.990 0.004 95)";
const bgWarm = "oklch(0.970 0.012 80)";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  images: string[];
  description: string;
  includes: string[];
}

const PRODUCTS: Product[] = [
  {
    id: "MA01",
    name: "阿里山春茶 4 兩＋萬味軒肉乾",
    price: 880,
    originalPrice: 978,
    images: [IMG.p1_1, IMG.p1_2, IMG.p1_3],
    description: "嚴選阿里山高山春茶 4 兩（150g），搭配萬味軒招牌肉乾，以迎利典雅紅金禮盒精裝，送禮自用兩相宜。",
    includes: ["阿里山春茶 4 兩（150g）", "萬味軒招牌肉乾", "迎利典雅紅金禮盒"],
  },
  {
    id: "MA02",
    name: "阿里山烘焙茶包 x8＋萬味軒肉乾",
    price: 780,
    originalPrice: 867,
    images: [IMG.p2_1, IMG.p2_2, IMG.p2_3],
    description: "阿里山烘焙茶包 8 入，香氣醇厚，沖泡方便，搭配萬味軒肉乾，以迎利典雅紅金禮盒精裝，適合送長輩或商務禮贈。",
    includes: ["阿里山烘焙茶包 8 入", "萬味軒招牌肉乾", "迎利典雅紅金禮盒"],
  },
  {
    id: "MA03",
    name: "頂級大禹嶺 2 兩＋萬味軒肉乾",
    price: 1800,
    originalPrice: 2000,
    images: [IMG.p3_1, IMG.p3_2, IMG.p3_3],
    description: "海拔 2,600 公尺頂級大禹嶺烏龍茶 2 兩（75g），茶湯清冽甘甜，搭配萬味軒肉乾，以迎利典雅紅金禮盒精裝，頂級送禮首選。",
    includes: ["頂級大禹嶺烏龍茶 2 兩（75g）", "萬味軒招牌肉乾", "迎利典雅紅金禮盒"],
  },
];

function ProductCard({ product }: { product: Product }) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const [, navigate] = useLocation();

  function handleAddToCart() {
    addItem({
      id: product.id,
      cartKey: `${product.id}::`,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.images[0],
    });
    toast.success(`已加入購物車`, {
      description: `${product.name} × ${qty}`,
      action: {
        label: "前往結帳",
        onClick: () => navigate("/checkout"),
      },
    });
  }

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: bgCream, border: `1px solid oklch(0.870 0.018 130)`, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >
      {/* Image gallery */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.images[activeImg]}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {/* Discount badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-['Lato'] font-600 tracking-wide"
          style={{ background: accentRed, color: "#FAFAF7" }}
        >
          8/31 前 9 折
        </div>
        {/* Thumbnail strip */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className="w-10 h-10 rounded overflow-hidden border-2 transition-all duration-200 flex-shrink-0"
              style={{
                borderColor: activeImg === i ? accentGold : "rgba(255,255,255,0.6)",
                opacity: activeImg === i ? 1 : 0.75,
              }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3
          className="font-['Playfair_Display'] font-400 mb-2 leading-snug"
          style={{ fontSize: "1.125rem", color: textDark }}
        >
          {product.name}
        </h3>
        <p className="font-['Lato'] font-300 text-sm mb-4 leading-relaxed" style={{ color: textMid }}>
          {product.description}
        </p>

        {/* Includes */}
        <ul className="mb-5 flex flex-col gap-1">
          {product.includes.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-['Lato'] font-300" style={{ color: textMid }}>
              <span className="mt-0.5 flex-shrink-0" style={{ color: accentGold }}>✦</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="flex items-end gap-3 mb-5">
          <span
            className="font-['Playfair_Display'] font-600"
            style={{ fontSize: "1.75rem", color: accentRed }}
          >
            NT${product.price.toLocaleString()}
          </span>
          <span
            className="font-['Lato'] font-300 text-sm line-through mb-1"
            style={{ color: "oklch(0.700 0.020 60)" }}
          >
            原價 NT${product.originalPrice.toLocaleString()}
          </span>
        </div>

        {/* Qty + Add to Cart */}
        <div className="mt-auto flex items-center gap-3">
          {/* Quantity selector */}
          <div
            className="flex items-center rounded-lg overflow-hidden border"
            style={{ borderColor: "oklch(0.870 0.018 130)" }}
          >
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center text-lg transition-colors duration-200 hover:bg-gray-100"
              style={{ color: textDark }}
            >
              −
            </button>
            <span
              className="w-10 text-center font-['Lato'] font-400 text-sm"
              style={{ color: textDark }}
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 flex items-center justify-center text-lg transition-colors duration-200 hover:bg-gray-100"
              style={{ color: textDark }}
            >
              +
            </button>
          </div>
          {/* Add to cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-2.5 rounded-lg text-sm font-['Lato'] font-400 tracking-[0.06em] transition-all duration-300"
            style={{ background: accentGreen, color: "#FAFAF7" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MidAutumnCollab() {
  const [copied, setCopied] = useState(false);

  function copyAccount() {
    navigator.clipboard.writeText("5193717532709").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen" style={{ background: bgWarm }}>
      <Navbar />

      <main className="container pt-28 pb-24">
        {/* ── Header ── */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span
            className="inline-block text-xs font-['Lato'] font-400 tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ background: `${accentRed}18`, color: accentRed }}
          >
            中秋限定聯名
          </span>
          <h1
            className="font-['Playfair_Display'] font-400 mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: textDark }}
          >
            中秋聯名禮盒
            <br />
            <span style={{ color: accentGold }}>迎利茶葉 × 萬味軒</span>
          </h1>
          <p className="font-['Lato'] font-300 leading-relaxed" style={{ fontSize: "1rem", color: textMid }}>
            台灣頂級高山茶與萬味軒招牌肉乾的完美結合，以典雅紅金禮盒精裝，<br className="hidden md:block" />
            茶香與肉香交織，獻給最重要的人。
          </p>
          {/* Promo banner */}
          <div
            className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-xl"
            style={{ background: `${accentRed}12`, border: `1px solid ${accentRed}40` }}
          >
            <span className="text-lg">🎁</span>
            <span className="font-['Lato'] font-400 text-sm" style={{ color: accentRed }}>
              <strong>8/31 前預購享 9 折優惠</strong>｜滿 NT$2,000 免運費
            </span>
          </div>
        </div>

        {/* ── Products Grid ── */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* ── How to Order ── */}
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-['Playfair_Display'] font-400 text-center mb-8"
            style={{ fontSize: "1.5rem", color: textDark }}
          >
            預購方式
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* 匯款 */}
            <div
              className="rounded-2xl p-6"
              style={{ background: bgCream, border: `1px solid oklch(0.870 0.018 130)` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🏦</span>
                <h3 className="font-['Lato'] font-600 text-sm tracking-[0.08em] uppercase" style={{ color: accentGold }}>
                  銀行匯款
                </h3>
              </div>
              <div className="space-y-2 text-sm font-['Lato'] font-300" style={{ color: textMid }}>
                <div className="flex justify-between">
                  <span>銀行</span>
                  <span className="font-400" style={{ color: textDark }}>合作金庫（006）</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>帳號</span>
                  <div className="flex items-center gap-2">
                    <span className="font-['Lato'] font-600 tracking-wider" style={{ color: textDark }}>5193717532709</span>
                    <button
                      onClick={copyAccount}
                      className="text-xs px-2 py-0.5 rounded transition-all duration-200"
                      style={{
                        background: copied ? `${accentGold}20` : "transparent",
                        border: `1px solid ${accentGold}60`,
                        color: accentGold,
                      }}
                    >
                      {copied ? "已複製" : "複製"}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>戶名</span>
                  <span className="font-400" style={{ color: textDark }}>迎利茶葉有限公司</span>
                </div>
              </div>
              <p
                className="mt-4 text-xs font-['Lato'] font-300 leading-relaxed p-3 rounded-lg"
                style={{ background: `${accentGold}10`, color: textMid }}
              >
                ⚠️ 匯款完成後，請提供<strong style={{ color: textDark }}>後五碼</strong>至 IG 或 Email 方便查帳核對。
              </p>
            </div>

            {/* 線上刷卡 */}
            <div
              className="rounded-2xl p-6"
              style={{ background: bgCream, border: `1px solid oklch(0.870 0.018 130)` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">💳</span>
                <h3 className="font-['Lato'] font-600 text-sm tracking-[0.08em] uppercase" style={{ color: accentGold }}>
                  線上刷卡
                </h3>
              </div>
              <p className="text-sm font-['Lato'] font-300 leading-relaxed mb-4" style={{ color: textMid }}>
                將商品加入購物車後，前往結帳頁面以信用卡付款，安全便利。
              </p>
              <Link
                to="/checkout"
                className="block w-full text-center py-3 rounded-xl text-sm font-['Lato'] font-400 tracking-[0.08em] transition-all duration-300"
                style={{ background: accentRed, color: "#FAFAF7" }}
              >
                前往結帳
              </Link>
              <p
                className="mt-3 text-xs font-['Lato'] font-300 text-center"
                style={{ color: textMid }}
              >
                8/31 前結帳自動享 9 折
              </p>
            </div>
          </div>

          {/* Notes */}
          <div
            className="rounded-2xl p-6 text-sm font-['Lato'] font-300 leading-relaxed space-y-2"
            style={{ background: bgCream, border: `1px solid oklch(0.870 0.018 130)`, color: textMid }}
          >
            <p>📦 <strong style={{ color: textDark }}>滿 NT$2,000 免運費</strong>，未滿則依配送方式收取運費。</p>
            <p>📅 預購商品將於確認付款後 3–5 個工作日出貨。</p>
            <p>💬 <strong style={{ color: textDark }}>大量訂購或客製化需求</strong>，歡迎私訊 IG 或 Email 洽詢。</p>
            {/* Enterprise CTA */}
            <div
              className="mt-4 pt-4 flex items-start gap-3"
              style={{ borderTop: `1px solid oklch(0.870 0.018 130)` }}
            >
              <span className="text-xl flex-shrink-0">🏢</span>
              <p>
                <strong style={{ color: textDark }}>企業購買滿 32 盒</strong>，即可客製化公司 Logo，打造專屬品牌禮盒，歡迎私訊洽詢。
              </p>
            </div>
          </div>
        </div>
      </main>

      <MiniFooter />
    </div>
  );
}
