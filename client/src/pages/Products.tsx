import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Check, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import ContactFooter from "@/components/ContactFooter";

// CDN URLs for product photos
const IMG = {
  sanlinxi:      "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-sanlinxi_4da392ea.png",
  alishan:       "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-alishan_5381f9e8.png",
  cuifeng:       "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-cuifeng_9c857ae0.png",
  lishan:        "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-lishan_dc8c4644.png",
  fushoushan:    "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-fushoushan_9c242185.png",
  alishanRoasted:"https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/product-alishan-roasted_e5d1bdc8.png",
};

interface Product {
  id: string;
  code: string;
  name: string;
  season: "春茶" | "冬茶" | "烘焙茶";
  weight: string;
  price: number;
  image: string;
  notes: [string, string, string];
  nameKey: string;
}

const PRODUCTS: Product[] = [
  // 杉林溪
  {
    id: "S01",
    code: "S01",
    name: "杉林溪春茶",
    season: "春茶",
    weight: "150g（四兩）",
    price: 400,
    image: IMG.sanlinxi,
    nameKey: "product.sanlinxi.spring",
    notes: [
      "茶湯金黃透亮，入口濃郁甘醇",
      "花香與蜜香交融，回甘持久悠長",
      "春季嫩芽精製，茶氣飽滿厚實",
    ],
  },
  {
    id: "S02",
    code: "S02",
    name: "杉林溪冬茶",
    season: "冬茶",
    weight: "150g（四兩）",
    price: 400,
    image: IMG.sanlinxi,
    nameKey: "product.sanlinxi.winter",
    notes: [
      "茶湯清澈淡雅，入口清香順口",
      "冬季低溫慢長，茶葉細膩柔和",
      "清新花香縈繞，喉韻清甜爽口",
    ],
  },
  // 阿里山
  {
    id: "A01",
    code: "A01",
    name: "阿里山春茶",
    season: "春茶",
    weight: "300g（半斤）",
    price: 1100,
    image: IMG.alishan,
    nameKey: "product.alishan.spring",
    notes: [
      "高山雲霧孕育，茶湯蜜綠清亮",
      "春芽飽滿鮮嫩，滋味濃郁回甘",
      "奶香與花香並存，層次豐富迷人",
    ],
  },
  {
    id: "A02",
    code: "A02",
    name: "阿里山冬茶",
    season: "冬茶",
    weight: "300g（半斤）",
    price: 1100,
    image: IMG.alishan,
    nameKey: "product.alishan.winter",
    notes: [
      "冬季低溫緩慢生長，香氣格外清揚",
      "茶湯清澈柔順，入喉絲滑無澀感",
      "淡雅花香持久，回甘清甜舒暢",
    ],
  },
  // 翠峰
  {
    id: "R01",
    code: "R01",
    name: "翠峰春茶",
    season: "春茶",
    weight: "300g（半斤）",
    price: 1300,
    image: IMG.cuifeng,
    nameKey: "product.cuifeng.spring",
    notes: [
      "中央山脈特選，茶湯翠綠鮮活",
      "春茶氣息濃郁，蘭花香氣撲鼻",
      "滋味醇厚甘甜，回韻悠長持久",
    ],
  },
  {
    id: "R02",
    code: "R02",
    name: "翠峰冬茶",
    season: "冬茶",
    weight: "300g（半斤）",
    price: 1300,
    image: IMG.cuifeng,
    nameKey: "product.cuifeng.winter",
    notes: [
      "冬季山嵐輕撫，茶葉清香細膩",
      "入口清爽不苦澀，喉韻甘潤舒適",
      "淡淡青草香氣，令人心曠神怡",
    ],
  },
  // 梨山
  {
    id: "L01",
    code: "L01",
    name: "精緻梨山春茶",
    season: "春茶",
    weight: "150g（四兩）",
    price: 950,
    image: IMG.lishan,
    nameKey: "product.lishan.spring",
    notes: [
      "海拔兩千公尺以上，高山冷涼孕育",
      "春茶滋味濃郁飽滿，蜜香花香交織",
      "入口甘甜醇厚，回甘持久令人回味",
    ],
  },
  {
    id: "L02",
    code: "L02",
    name: "精緻梨山冬茶",
    season: "冬茶",
    weight: "150g（四兩）",
    price: 950,
    image: IMG.lishan,
    nameKey: "product.lishan.winter",
    notes: [
      "冬季高山嚴寒，茶葉緩慢積累精華",
      "清香淡雅如蘭，口感柔順無苦澀",
      "喉韻清甜悠長，餘香在口中縈繞",
    ],
  },
  // 福壽山
  {
    id: "D01",
    code: "D01",
    name: "精緻福壽山春茶",
    season: "春茶",
    weight: "150g（四兩）",
    price: 1750,
    image: IMG.fushoushan,
    nameKey: "product.fushoushan.spring",
    notes: [
      "台灣頂級高山茶，海拔超過兩千五百公尺",
      "春茶香氣馥郁，蜜香果香層層疊現",
      "茶湯金黃透亮，滋味醇厚甘甜無比",
    ],
  },
  {
    id: "D02",
    code: "D02",
    name: "精緻福壽山冬茶",
    season: "冬茶",
    weight: "150g（四兩）",
    price: 1750,
    image: IMG.fushoushan,
    nameKey: "product.fushoushan.winter",
    notes: [
      "冬季極寒高山，茶葉精華高度濃縮",
      "清雅花香如幽蘭，入口絲滑無比",
      "回甘持久悠長，是送禮自用的極品",
    ],
  },
  // 阿里山烘焙茶（只有一個編號）
  {
    id: "RO1",
    code: "RO1",
    name: "阿里山烘焙茶",
    season: "烘焙茶",
    weight: "300g（半斤）",
    price: 1400,
    image: IMG.alishanRoasted,
    nameKey: "product.alishan.roasted",
    notes: [
      "傳統炭焙工藝，焙火香氣深沉迷人",
      "茶湯琥珀色澤，口感醇厚溫潤順滑",
      "焦糖甜香縈繞，暖胃養身四季皆宜",
    ],
  },
];

const SEASON_COLORS: Record<string, string> = {
  春茶: "bg-emerald-100 text-emerald-800 border-emerald-200",
  冬茶: "bg-sky-100 text-sky-800 border-sky-200",
  烘焙茶: "bg-amber-100 text-amber-800 border-amber-200",
};

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      nameKey: product.nameKey,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setAdded(true);
    toast({
      title: "已加入購物車",
      description: `${product.name} × 1`,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-stone-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Season badge overlay */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${SEASON_COLORS[product.season]}`}>
            {product.season}
          </span>
        </div>
        {/* Product code */}
        <div className="absolute top-3 right-3">
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

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
          <span className="text-lg font-bold text-stone-800">
            NT${product.price.toLocaleString()}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className={`transition-all duration-200 ${
              added
                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                : "bg-stone-800 hover:bg-stone-700 text-white"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1" />
                已加入
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                加入購物車
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [filter, setFilter] = useState<"全部" | "春茶" | "冬茶" | "烘焙茶">("全部");

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
      <div className="flex justify-center gap-2 px-4 mb-10">
        {(["全部", "春茶", "冬茶", "烘焙茶"] as const).map((tab) => (
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

      {/* Spring/Winter explanation banner */}
      <div className="max-w-4xl mx-auto px-4 mb-10">
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
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty state */}
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
