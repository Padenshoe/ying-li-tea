import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Check, Leaf, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ContactFooter from "@/components/ContactFooter";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/";

// CDN URLs for product photos
const IMG = {
  sanlinxi:      CDN + "Gemini_Generated_Image_gf0qa6gf0qa6gf0q_b079c890.png",
  alishan:       CDN + "Gemini_Generated_Image_ubybu5ubybu5ubyb_3d5afa9f.jpg",
  alishanExtra:  CDN + "alishan-extra_6bf7ef41.jpg",
  cuifeng:       CDN + "Gemini_Generated_Image_fumk61fumk61fumk_62be393b.jpg",
  cuifengExtra:  CDN + "cuifeng-extra_d1288c94.jpg",
  lishan:        CDN + "Gemini_Generated_Image_aify73aify73aify_a1bf72fd.png",
  lishanExtra:   CDN + "lishan-extra_03ca30ee.png",
  fushoushan:    CDN + "Gemini_Generated_Image_dmtfc8dmtfc8dmtf_4fe395c2.png",
  fushoushanExtra: CDN + "fushoushan-extra_508cb51c.jpg",
  alishanRoasted: CDN + "Gemini_Generated_Image_z5c0tsz5c0tsz5c0_c363d941.jpg",
  roastedExtra:  CDN + "roasted-extra_82dfc8cc.jpg",
  jinxuan1:      CDN + "jinxuan-1_68efee9c.png",
  jinxuan2:      CDN + "jinxuan-2_a1a4e289.png",
};

interface Product {
  id: string;
  code: string;
  name: string;
  season: "春茶" | "冬茶" | "烘焙茶" | "金萱茶" | "茶包";
  weight: string;
  price: number;
  images: string[];   // first = main, rest = gallery
  notes: [string, string, string];
  nameKey: string;
}

const PRODUCTS: Product[] = [
  // 杉林溪
  {
    id: "S01", code: "S01", name: "杉林溪春茶", season: "春茶",
    weight: "150g（四兩）", price: 400,
    images: [IMG.sanlinxi],
    nameKey: "product.sanlinxi.spring",
    notes: [
      "茶湯金黃透亮，入口濃郁甘醇",
      "花香與蜜香交融，回甘持久悠長",
      "春季嫩芽精製，茶氣飽滿厚實",
    ],
  },
  {
    id: "S02", code: "S02", name: "杉林溪冬茶", season: "冬茶",
    weight: "150g（四兩）", price: 400,
    images: [IMG.sanlinxi],
    nameKey: "product.sanlinxi.winter",
    notes: [
      "茶湯清澈淡雅，入口清香順口",
      "冬季低溫慢長，茶葉細膩柔和",
      "清新花香縈繞，喉韻清甜爽口",
    ],
  },
  // 阿里山
  {
    id: "A01", code: "A01", name: "阿里山春茶", season: "春茶",
    weight: "300g（半斤）", price: 1100,
    images: [IMG.alishan, IMG.alishanExtra],
    nameKey: "product.alishan.spring",
    notes: [
      "高山雲霧孕育，茶湯蜜綠清亮",
      "春芽飽滿鮮嫩，滋味濃郁回甘",
      "奶香與花香並存，層次豐富迷人",
    ],
  },
  {
    id: "A02", code: "A02", name: "阿里山冬茶", season: "冬茶",
    weight: "300g（半斤）", price: 1100,
    images: [IMG.alishan, IMG.alishanExtra],
    nameKey: "product.alishan.winter",
    notes: [
      "冬季低溫緩慢生長，香氣格外清揚",
      "茶湯清澈柔順，入喉絲滑無澀感",
      "淡雅花香持久，回甘清甜舒暢",
    ],
  },
  // 翠峰
  {
    id: "R01", code: "R01", name: "翠峰春茶", season: "春茶",
    weight: "300g（半斤）", price: 1300,
    images: [IMG.cuifeng, IMG.cuifengExtra],
    nameKey: "product.cuifeng.spring",
    notes: [
      "中央山脈特選，茶湯翠綠鮮活",
      "春茶氣息濃郁，蘭花香氣撲鼻",
      "滋味醇厚甘甜，回韻悠長持久",
    ],
  },
  {
    id: "R02", code: "R02", name: "翠峰冬茶", season: "冬茶",
    weight: "300g（半斤）", price: 1300,
    images: [IMG.cuifeng, IMG.cuifengExtra],
    nameKey: "product.cuifeng.winter",
    notes: [
      "冬季山嵐輕撫，茶葉清香細膩",
      "入口清爽不苦澀，喉韻甘潤舒適",
      "淡淡青草香氣，令人心曠神怡",
    ],
  },
  // 梨山
  {
    id: "L01", code: "L01", name: "精緻梨山春茶", season: "春茶",
    weight: "150g（四兩）", price: 950,
    images: [IMG.lishan, IMG.lishanExtra],
    nameKey: "product.lishan.spring",
    notes: [
      "海拔兩千公尺以上，高山冷涼孕育",
      "春茶滋味濃郁飽滿，蜜香花香交織",
      "入口甘甜醇厚，回甘持久令人回味",
    ],
  },
  {
    id: "L02", code: "L02", name: "精緻梨山冬茶", season: "冬茶",
    weight: "150g（四兩）", price: 950,
    images: [IMG.lishan, IMG.lishanExtra],
    nameKey: "product.lishan.winter",
    notes: [
      "冬季高山嚴寒，茶葉緩慢積累精華",
      "清香淡雅如蘭，口感柔順無苦澀",
      "喉韻清甜悠長，餘香在口中縈繞",
    ],
  },
  // 福壽山
  {
    id: "D01", code: "D01", name: "精緻福壽山春茶", season: "春茶",
    weight: "150g（四兩）", price: 1750,
    images: [IMG.fushoushan, IMG.fushoushanExtra],
    nameKey: "product.fushoushan.spring",
    notes: [
      "台灣頂級高山茶，海拔超過兩千五百公尺",
      "春茶香氣馥郁，蜜香果香層層疊現",
      "茶湯金黃透亮，滋味醇厚甘甜無比",
    ],
  },
  {
    id: "D02", code: "D02", name: "精緻福壽山冬茶", season: "冬茶",
    weight: "150g（四兩）", price: 1750,
    images: [IMG.fushoushan, IMG.fushoushanExtra],
    nameKey: "product.fushoushan.winter",
    notes: [
      "冬季極寒高山，茶葉精華高度濃縮",
      "清雅花香如幽蘭，入口絲滑無比",
      "回甘持久悠長，是送禮自用的極品",
    ],
  },
  // 阿里山烘焙茶
  {
    id: "RO1", code: "RO1", name: "阿里山烘焙茶", season: "烘焙茶",
    weight: "300g（半斤）", price: 1400,
    images: [IMG.alishanRoasted, IMG.roastedExtra],
    nameKey: "product.alishan.roasted",
    notes: [
      "傳統炭焙工藝，焙火香氣深沉迷人",
      "茶湯琥珀色澤，口感醇厚溫潤順滑",
      "焦糖甜香縈繞，暖胃養身四季皆宜",
    ],
  },
  // 阿里山金萱茶（新商品）
  {
    id: "J01", code: "J01", name: "阿里山金萱茶", season: "金萱茶",
    weight: "300g（半斤）", price: 1600,
    images: [IMG.jinxuan1, IMG.jinxuan2],
    nameKey: "product.alishan.jinxuan",
    notes: [
      "金萱品種特有天然奶香，清甜迷人",
      "阿里山高海拔栽培，茶湯蜜黃柔順",
      "入口滑嫩無苦澀，奶香餘韻悠長",
    ],
  },
  // 阿里山茶包禮盒（新商品）
  {
    id: "TB01", code: "TB01", name: "阿里山茶包禮盒", season: "茶包",
    weight: "60入 × 3g", price: 980,
    images: [CDN + "teabag-1_dce6dee5.png", CDN + "teabag-2_a91ea8f9.png", CDN + "teabag-3_3aed7707.png"],
    nameKey: "product.alishan.teabag",
    notes: [
      "一心二葉嚴選，純古法炭焙工藝",
      "日本進口棉紙茶包，耐熱保鮮充氮",
      "青心烏龍品種，茶湯清亮甘甜順口",
    ],
  },
];

const SEASON_COLORS: Record<string, string> = {
  春茶:  "bg-emerald-100 text-emerald-800 border-emerald-200",
  冬茶:  "bg-sky-100 text-sky-800 border-sky-200",
  烘焙茶: "bg-amber-100 text-amber-800 border-amber-200",
  金萱茶: "bg-pink-100 text-pink-800 border-pink-200",
  茶包:  "bg-orange-100 text-orange-800 border-orange-200",
};

// ── Image Gallery sub-component ──────────────────────────────────────────────
function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <div className="relative aspect-square overflow-hidden bg-stone-50 group">
      {/* Main image */}
      <img
        src={images[active]}
        alt={`${name} - 照片 ${active + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="lazy"
      />

      {/* Prev / Next arrows — only shown when there are multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label="上一張"
          >
            <ChevronLeft className="w-4 h-4 text-stone-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label="下一張"
          >
            <ChevronRight className="w-4 h-4 text-stone-700" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === active ? "bg-white scale-125" : "bg-white/50"
                }`}
                aria-label={`切換至第 ${i + 1} 張`}
              />
            ))}
          </div>

          {/* Thumbnail strip at bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-1.5 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 justify-center">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-10 h-10 rounded overflow-hidden border-2 transition-all duration-150 shrink-0 ${
                  i === active ? "border-white" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      nameKey: product.nameKey,
      price: product.price,
      quantity: qty,
      image: product.images[0],
    });
    setAdded(true);
    toast({ title: "已加入購物車", description: `${product.name} × ${qty}` });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Image gallery with season badge & code overlay */}
      <div className="relative">
        <ImageGallery images={product.images} name={product.name} />
        <div className="absolute top-3 left-3 z-20">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${SEASON_COLORS[product.season]}`}>
            {product.season}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-20">
          <span className="text-xs font-mono bg-white/90 text-stone-600 px-2 py-1 rounded-md shadow-sm">
            {product.code}
          </span>
        </div>
      </div>

      {/* Product info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-stone-800 mb-1">{product.name}</h3>
        <p className="text-xs text-stone-400 mb-3">{product.weight}</p>

        {/* Tasting notes */}
        <div className="space-y-1.5 mb-4 flex-1">
          {product.notes.map((note, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-stone-300 mt-0.5 shrink-0" />
              <p className="text-xs text-stone-500 leading-relaxed">{note}</p>
            </div>
          ))}
        </div>

        {/* Price + quantity row */}
        <div className="flex items-center justify-between mb-3 pt-3 border-t border-stone-100">
          <span className="text-lg font-bold text-stone-800">
            NT${product.price.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
              aria-label="減少數量"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-7 text-center text-sm font-semibold text-stone-800 select-none">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
              aria-label="增加數量"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Add to cart */}
        <Button
          onClick={handleAddToCart}
          className={`w-full transition-all duration-200 ${
            added
              ? "bg-emerald-600 hover:bg-emerald-600 text-white"
              : "bg-stone-800 hover:bg-stone-700 text-white"
          }`}
        >
          {added ? (
            <><Check className="w-3.5 h-3.5 mr-1.5" />已加入購物車</>
          ) : (
            <><ShoppingCart className="w-3.5 h-3.5 mr-1.5" />加入購物車</>
          )}
        </Button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [filter, setFilter] = useState<"全部" | "春茶" | "冬茶" | "烘焙茶" | "金萱茶" | "茶包">("全部");

  const filtered = filter === "全部"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.season === filter);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
      <Navbar />

      {/* Page header */}
      <div className="pt-24 pb-10 text-center px-4">
        <p className="text-xs tracking-[0.25em] text-stone-400 uppercase mb-3">Ying-Li Tea</p>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">精選茶葉系列</h1>
        <p className="text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
          嚴選台灣高山烏龍茶，春茶濃郁回甘，冬茶清香順口，每一款皆有獨特的山頭氣息。
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex justify-center gap-2 px-4 mb-10 flex-wrap">
        {(["全部", "春茶", "冬茶", "烘焙茶", "金萱茶", "茶包"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              filter === tab
                ? "bg-stone-800 text-white border-stone-800"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
            }`}
          >
            {tab}
            {tab !== "全部" && (
              <span className="ml-1.5 text-xs opacity-60">
                ({PRODUCTS.filter((p) => p.season === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tea type explanation banner */}
      <div className="max-w-5xl mx-auto px-4 mb-10">
        <div className="bg-white rounded-2xl border border-stone-100 p-5 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-start gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-1">春茶</p>
              <p className="text-xs text-stone-500 leading-relaxed">春季採摘，茶芽飽滿鮮嫩，滋味濃郁回甘，香氣層次豐富，適合喜歡茶味醇厚的您。</p>
            </div>
          </div>
          <div className="hidden sm:block w-px bg-stone-100" />
          <div className="flex-1 flex items-start gap-3">
            <span className="text-2xl">❄️</span>
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-1">冬茶</p>
              <p className="text-xs text-stone-500 leading-relaxed">冬季低溫緩慢生長，茶葉細膩柔和，清香順口無苦澀，適合喜歡清雅花香的您。</p>
            </div>
          </div>
          <div className="hidden sm:block w-px bg-stone-100" />
          <div className="flex-1 flex items-start gap-3">
            <span className="text-2xl">🌸</span>
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-1">金萱茶</p>
              <p className="text-xs text-stone-500 leading-relaxed">金萱品種特有天然奶香，茶湯蜜黃柔順，入口滑嫩無苦澀，奶香餘韻悠長迷人。</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <Leaf className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>目前沒有符合條件的商品</p>
          </div>
        )}
      </div>

      <ContactFooter />
    </div>
  );
}
