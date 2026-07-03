import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
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
  giftbox1:      "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC03096_014aba20.webp",
  giftbox2:      "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC03098_15431a66.webp",
  giftbox3:      "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/DSC03099_f9b61c50.webp",
  giftboxYuBao:    "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/LINE_ALBUM_2026630_260630_2_0af89783.jpg",
  giftboxJingXuan: "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/LINE_ALBUM_2026630_260630_4_a7f90a5c.jpg",
  giftboxCaiYun:   "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/LINE_ALBUM_2026630_260630_21_b89c77e9.jpg",
  giftboxYuXi:     "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/LINE_ALBUM_2026630_260630_18_fe36f223.jpg",
  dayuling:        "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/LINE_ALBUM_2026630_260630_16_d69cbfda.jpg",
  lishanTieguanyin: "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/LINE_ALBUM_2026630_260630_14_e426b16d.jpg",
  lishanBlackTea:  "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/LINE_ALBUM_2026630_260630_10_ef1143ed.jpg",
  lishanPremiumBlack: "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/LINE_ALBUM_2026630_260630_31_4f005544.jpg",
  shuixianBlackTea: "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/LINE_ALBUM_2026630_260630_32_0b68775e.jpg",
};

interface Product {
  id: string;
  code: string;
  name: string;
  season: "推薦" | "春茶" | "冬茶" | "烘焙茶" | "金萱茶" | "茶包" | "禮盒" | "紅茶" | "烏龍紅茶";
  featured?: boolean;
  weight: string;
  price: number;
  priceOnRequest?: boolean;  // 價格選填（結帳時議價）
  images: string[];   // first = main, rest = gallery
  notes: [string, string, string];
  nameKey: string;
}

const PRODUCTS: Product[] = [
  // 杉林溪
  {
    id: "S03", code: "S03", name: "杉林溪春茶", season: "春茶",
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
    id: "A03", code: "A03", name: "阿里山春茶", season: "春茶",
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
    id: "R03", code: "R03", name: "翠峰春茶", season: "春茶",
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
    id: "L03", code: "L03", name: "精致梨山春茶", season: "春茶", featured: true,
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
    id: "D02", code: "D02", name: "精致福壽山冬茶", season: "冬茶", featured: true,
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
    id: "J01", code: "J01", name: "阿里山金萱茶", season: "金萱茶", featured: true,
    weight: "300g（半斤）", price: 800,
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
    id: "TB01", code: "TB01", name: "阿里山茶包禮盒", season: "茶包", featured: true,
    weight: "60入 × 3g", price: 980,
    images: [CDN + "teabag-1_dce6dee5.png", CDN + "teabag-2_a91ea8f9.png", CDN + "teabag-3_3aed7707.png"],
    nameKey: "product.alishan.teabag",
    notes: [
      "一心二葉嚴選，純古法炭焙工藝",
      "日本進口棉紙茶包，耐熱保鮮充氮",
      "青心烏龍品種，茶湯清亮甘甜順口",
    ],
  },
  // 禮盒系列
  {
    id: "GB01", code: "GB01", name: "精選茶葉禮盒（半斤裝）", season: "禮盒",
    weight: "300g（半斤）", price: 480,
    images: [IMG.giftbox1],
    nameKey: "product.giftbox.half",
    notes: [
      "精選台灣高山茶，典雅禮盒包裝",
      "半斤裝，適合送禮自用兩相宜",
      "可搭配不同茶款，歡迎來電詢問",
    ],
  },
  {
    id: "GB02", code: "GB02", name: "拾遇茶葉禮盒（半斤裝）", season: "禮盒",
    weight: "300g（半斤）", price: 480,
    images: [IMG.giftbox2],
    nameKey: "product.giftbox.shiyou",
    notes: [
      "拾遇系列，質感鐵罐搭配精緻外盒",
      "半斤裝雙罐組，送禮首選",
      "可搭配不同茶款，歡迎來電詢問",
    ],
  },
  {
    id: "GB03", code: "GB03", name: "圓善茶葉禮盒（一斤裝）", season: "禮盒",
    weight: "600g（一斤）", price: 480,
    images: [IMG.giftbox3],
    nameKey: "product.giftbox.full",
    notes: [
      "圓善系列，牛皮紙質感外盒四罐組",
      "一斤裝大份量，適合節慶送禮",
      "可搭配不同茶款，歡迎來電詢問",
    ],
  },
  // 新款禮盒
  {
    id: "GB04", code: "GB04", name: "台灣御寶禮盒", season: "禮盒", featured: true,
    weight: "300g（半斤）", price: 220,
    images: [IMG.giftboxYuBao],
    nameKey: "product.giftbox.yubao",
    notes: [
      "紅黑金配色，氣派典雅的高山茶禮盒",
      "半斤裝雙罐組，節慶送禮首選",
      "可搭配不同茶款，歡迎來電詢問",
    ],
  },
  {
    id: "GB05", code: "GB05", name: "精選茗茶禮盒", season: "禮盒",
    weight: "300g（半斤）", price: 220,
    images: [IMG.giftboxJingXuan],
    nameKey: "product.giftbox.jingxuan",
    notes: [
      "青花瓷風格鐵罐，典雅精緻",
      "半斤裝雙罐組，適合送禮收藏",
      "可搭配不同茶款，歡迎來電詢問",
    ],
  },
  {
    id: "GB06", code: "GB06", name: "采韻禮盒", season: "禮盒", featured: true,
    weight: "600g（一斤）", price: 480,
    images: [IMG.giftboxCaiYun],
    nameKey: "product.giftbox.caiyun",
    notes: [
      "采韻系列，質感紅色外盒四罐組",
      "一斤裝大份量，適合節慶送禮",
      "可搭配不同茶款，歡迎來電詢問",
    ],
  },
  {
    id: "GB07", code: "GB07", name: "御璽金賞包裝", season: "禮盒",
    weight: "依茶款而定", price: 0, priceOnRequest: true,
    images: [IMG.giftboxYuXi],
    nameKey: "product.giftbox.yuxi",
    notes: [
      "金色御璽包裝，福壽梨山、高山茶、阿里山可選",
      "包裝形式二選一：罐子 或 金賞紙盒",
      "上圖為包裝示意圖，歡迎來電詢問茶款與價格",
    ],
  },
  // 頂級大禹嶺春茶
  {
    id: "DYL01", code: "DYL01", name: "頂級大禹嶺春茶", season: "春茶",
    weight: "150g（四兩）", price: 3000,
    images: [IMG.dayuling],
    nameKey: "product.dayuling.spring",
    notes: [
      "台灣最高海拔產區，海拔逾 2,800 公尺",
      "茶湯清甲香氣清雅，回甘持久深長",
      "極品收藏首選，適合進階茶友與送禮",
    ],
  },
  // 梨山鐵觀音
  {
    id: "LST01", code: "LST01", name: "梨山鐵觀音", season: "春茶",
    weight: "150g（四兩）", price: 1750,
    images: [IMG.lishanTieguanyin],
    nameKey: "product.lishan.tieguanyin",
    notes: [
      "傳統鐵觀音品種，梨山鐵觀音制法製作",
      "花香清雅、音韵魅人，回甘持久",
      "福壽梨山特選，四兩裝適合品鑑收藏",
    ],
  },
  // 梨山烏龍紅茶
  {
    id: "LSBT01", code: "LSBT01", name: "梨山烏龍紅茶", season: "烏龍紅茶", featured: true,
    weight: "300g（半斤）", price: 1500,
    images: [IMG.lishanBlackTea],
    nameKey: "product.lishan.blacktea",
    notes: [
      "紅茶香氣中帶有烏龍茶的尾韻，風味獨特",
      "梨山高山茶區特製，清香順口",
      "半斤裝，適合日常品飲與送禮",
    ],
  },
  // 梨山頂級紅茶
  {
    id: "LSPB01", code: "LSPB01", name: "梨山頂級紅茶", season: "紅茶",
    weight: "75g", price: 800,
    images: [IMG.lishanPremiumBlack],
    nameKey: "product.lishan.premiumblack",
    notes: [
      "頂級梨山紅茶，順口尾韻豐富",
      "紅茶香氣清雅，口感滑順回甘持久",
      "75g 鐵罐裝，適合進階茶友與送禮首選",
    ],
  },
  // 水仙紅茶
  {
    id: "SXT01", code: "SXT01", name: "水仙紅茶", season: "紅茶",
    weight: "100g", price: 600,
    images: [IMG.shuixianBlackTea],
    nameKey: "product.shuixian.blacktea",
    notes: [
      "使用水仙茶種製作的紅茶，風味獨特",
      "清香順口，温和花香中帶清甘尾韻",
      "100g 裝，適合日常品飲與初學茶友",
    ],
  },
];

const SEASON_COLORS: Record<string, string> = {
  推薦:  "bg-yellow-100 text-yellow-800 border-yellow-300",
  春茶:  "bg-emerald-100 text-emerald-800 border-emerald-200",
  冬茶:  "bg-sky-100 text-sky-800 border-sky-200",
  烘焙茶: "bg-amber-100 text-amber-800 border-amber-200",
  金萱茶: "bg-pink-100 text-pink-800 border-pink-200",
  茶包:  "bg-orange-100 text-orange-800 border-orange-200",
  禮盒:  "bg-rose-100 text-rose-800 border-rose-200",
  紅茶:  "bg-red-100 text-red-800 border-red-200",
  烏龍紅茶: "bg-orange-100 text-orange-800 border-orange-200",
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
  const [, navigate] = useLocation();

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
      <div className="relative cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
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
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <h3
          className="text-sm sm:text-base font-semibold text-stone-800 mb-0.5 sm:mb-1 leading-snug cursor-pointer hover:text-stone-600 transition-colors"
          onClick={() => navigate(`/products/${product.id}`)}
        >{product.name}</h3>
        <p className="text-[11px] sm:text-xs text-stone-400 mb-2 sm:mb-3">{product.weight}</p>

        {/* Tasting notes */}
        <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 flex-1">
          {product.notes.map((note, i) => (
            <div key={i} className="flex items-start gap-1">
              <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-300 mt-0.5 shrink-0" />
              <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed">{note}</p>
            </div>
          ))}
        </div>

        {/* Price + quantity row */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 pt-2 sm:pt-3 border-t border-stone-100">
          <span className="text-sm sm:text-lg font-bold text-stone-800">
            {product.priceOnRequest ? (
              <span className="text-[11px] sm:text-sm font-medium text-stone-500">包裝示意圖</span>
            ) : (
              <>NT${product.price.toLocaleString()}</>
            )}
          </span>
          {!product.priceOnRequest && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label="減少數量"
              >
                <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
              <span className="w-5 sm:w-7 text-center text-xs sm:text-sm font-semibold text-stone-800 select-none">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label="增加數量"
              >
                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Add to cart / inquiry */}
        {product.priceOnRequest ? (
          <Button
            disabled
            className="w-full text-xs sm:text-sm bg-stone-800 text-white opacity-80 cursor-not-allowed h-8 sm:h-10"
          >
            結帳時選填
          </Button>
        ) : (
          <Button
            onClick={handleAddToCart}
            className={`w-full text-xs sm:text-sm h-8 sm:h-10 transition-all duration-200 ${
              added
                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                : "bg-stone-800 hover:bg-stone-700 text-white"
            }`}
          >
            {added ? (
              <><Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1"/>已加入</>
            ) : (
              <><ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1"/>加入購物車</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [filter, setFilter] = useState<"全部" | "推薦" | "春茶" | "冬茶" | "烘焙茶" | "金萱茶" | "茶包" | "禮盒" | "紅茶" | "烏龍紅茶">("全部");
  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Handle ?focus=TB01 (or any product id) from homepage CTA
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focusId = params.get("focus");
    if (!focusId) return;
    const target = PRODUCTS.find((p) => p.id === focusId);
    if (!target) return;
    // Switch filter to show the target product
    setFilter(target.season as "全部" | "推薦" | "春茶" | "冬茶" | "烘焙茶" | "金萱茶" | "茶包" | "禮盒" | "紅茶" | "烏龍紅茶");
    // Use double rAF to ensure DOM has fully rendered after state update
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = productRefs.current[focusId];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }, []);

  const filtered = filter === "全部"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.season === filter || (filter === "推薦" && p.featured));

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.970 0.012 80)" }}>
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
        {(["全部", "推薦", "春茶", "冬茶", "烘焙茶", "金萱茶", "茶包", "紅茶", "烏龍紅茶", "禮盒"] as const).map((tab) => (
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
                ({tab === "推薦" ? PRODUCTS.filter((p) => p.featured).length : PRODUCTS.filter((p) => p.season === tab).length})
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {filtered.map((product) => (
            <div key={product.id} ref={(el) => { productRefs.current[product.id] = el; }}>
              <ProductCard product={product} />
            </div>
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
