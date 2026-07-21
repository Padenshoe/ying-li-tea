/**
 * YING-LI TEA — Product Detail Page
 * Route: /products/:id
 * Provides individual product landing pages for SEO and Google Shopping.
 */
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Check, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ContactFooter from "@/components/ContactFooter";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/";

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
  giftbox1:      CDN + "DSC03096_014aba20.webp",
  giftbox2:      CDN + "DSC03098_15431a66.webp",
  giftbox3:      CDN + "DSC03099_f9b61c50.webp",
  giftboxYuBao:    CDN + "LINE_ALBUM_2026630_260630_2_0af89783.jpg",
  giftboxJingXuan: CDN + "LINE_ALBUM_2026630_260630_4_a7f90a5c.jpg",
  giftboxCaiYun:   CDN + "LINE_ALBUM_2026630_260630_21_b89c77e9.jpg",
  giftboxYuXi:     CDN + "LINE_ALBUM_2026630_260630_18_fe36f223.jpg",
  dayuling:        CDN + "LINE_ALBUM_2026630_260630_16_d69cbfda.jpg",
  lishanTieguanyin: CDN + "LINE_ALBUM_2026630_260630_14_e426b16d.jpg",
  lishanBlackTea:  CDN + "LINE_ALBUM_2026630_260630_10_ef1143ed.jpg",
  lishanPremiumBlack: CDN + "LINE_ALBUM_2026630_260630_31_4f005544.jpg",
  shuixianBlackTea: CDN + "LINE_ALBUM_2026630_260630_32_0b68755e.jpg",
  contestLishanTop: "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/contest-lishan-top_a9b95b8b.webp",
  contestRenaiTop:  "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/contest-renai-top_e4843144.webp",
  contestHeping3:   "https://d2xsxph8kpxj0f.cloudfront.net/310519663480801041/CszUxC59AMQW9PPYCfQtVP/contest-heping-3star_d5b058e0.webp",
};

interface TeaOption {
  label: string;  // 茶葉名稱
  price: number;  // 此茶葉選項的價格
}

interface ProductDetail {
  id: string;
  name: string;
  season: string;
  weight: string;
  price: number;
  priceOnRequest?: boolean;
  teaOptions?: TeaOption[];  // Tea selection options for gift boxes
  images: string[];
  notes: [string, string, string];
  nameKey: string;
  description: string;
  origin?: string;
  altitude?: string;
  process?: string;
}

const PRODUCTS: ProductDetail[] = [
  {
    id: "S03", name: "杉林溪春茶", season: "春茶", weight: "150g（四兩）", price: 400,
    images: [IMG.sanlinxi], nameKey: "product.sanlinxi.spring",
    description: "杉林溪位於南投竹山，海拔 1,300 公尺，春季採摘的茶芽飽滿鮮嫩，滋味濃郁回甘，香氣層次豐富，是喜歡茶味醇厚者的絕佳選擇。",
    origin: "南投竹山", altitude: "1,300 公尺", process: "輕發酵・輕烘焙",
    notes: ["茶湯金黃透亮，入口濃郁甘醇", "花香與蜜香交融，回甘持久悠長", "春季嫩芽精製，茶氣飽滿厚實"],
  },
  {
    id: "S02", name: "杉林溪冬茶", season: "冬茶", weight: "150g（四兩）", price: 400,
    images: [IMG.sanlinxi], nameKey: "product.sanlinxi.winter",
    description: "冬季低溫緩慢生長的杉林溪茶葉，細膩柔和，清香順口無苦澀，清新花香縈繞，適合喜歡清雅花香的您。",
    origin: "南投竹山", altitude: "1,300 公尺", process: "輕發酵・輕烘焙",
    notes: ["茶湯清澈淡雅，入口清香順口", "冬季低溫慢長，茶葉細膩柔和", "清新花香縈繞，喉韻清甜爽口"],
  },
  {
    id: "A03", name: "阿里山春茶", season: "春茶", weight: "300g（半斤）", price: 1100,
    images: [IMG.alishan, IMG.alishanExtra], nameKey: "product.alishan.spring",
    description: "阿里山高山雲霧孕育的春茶，茶湯蜜綠清亮，春芽飽滿鮮嫩，滋味濃郁回甘，奶香與花香並存，層次豐富迷人。台灣最具代表性的高山烏龍茶之一。",
    origin: "嘉義阿里山", altitude: "1,500 公尺", process: "輕發酵・不烘焙",
    notes: ["高山雲霧孕育，茶湯蜜綠清亮", "春芽飽滿鮮嫩，滋味濃郁回甘", "奶香與花香並存，層次豐富迷人"],
  },
  {
    id: "A02", name: "阿里山冬茶", season: "冬茶", weight: "300g（半斤）", price: 1100,
    images: [IMG.alishan, IMG.alishanExtra], nameKey: "product.alishan.winter",
    description: "冬季低溫緩慢生長的阿里山茶葉，香氣格外清揚，茶湯清澈柔順，入喉絲滑無澀感，淡雅花香持久，回甘清甜舒暢。",
    origin: "嘉義阿里山", altitude: "1,500 公尺", process: "輕發酵・不烘焙",
    notes: ["冬季低溫緩慢生長，香氣格外清揚", "茶湯清澈柔順，入喉絲滑無澀感", "淡雅花香持久，回甘清甜舒暢"],
  },
  {
    id: "R03", name: "翠峰春茶", season: "春茶", weight: "300g（半斤）", price: 1300,
    images: [IMG.cuifeng, IMG.cuifengExtra], nameKey: "product.cuifeng.spring",
    description: "翠峰位於南投仁愛鄉，海拔 1,800 公尺，春茶茶湯翠綠鮮活，蘭花香氣撲鼻，滋味醇厚甘甜，回韻悠長持久。",
    origin: "南投仁愛鄉翠峰", altitude: "1,800 公尺", process: "輕發酵・輕烘焙",
    notes: ["中央山脈特選，茶湯翠綠鮮活", "春茶氣息濃郁，蘭花香氣撲鼻", "滋味醇厚甘甜，回韻悠長持久"],
  },
  {
    id: "R02", name: "翠峰冬茶", season: "冬茶", weight: "300g（半斤）", price: 1300,
    images: [IMG.cuifeng, IMG.cuifengExtra], nameKey: "product.cuifeng.winter",
    description: "冬季山嵐輕撫的翠峰茶葉，清香細膩，入口清爽不苦澀，喉韻甘潤舒適，淡淡青草香氣，令人心曠神怡。",
    origin: "南投仁愛鄉翠峰", altitude: "1,800 公尺", process: "輕發酵・輕烘焙",
    notes: ["冬季山嵐輕撫，茶葉清香細膩", "入口清爽不苦澀，喉韻甘潤舒適", "淡淡青草香氣，令人心曠神怡"],
  },
  {
    id: "L03", name: "精緻梨山春茶", season: "春茶", weight: "150g（四兩）", price: 950,
    images: [IMG.lishan, IMG.lishanExtra], nameKey: "product.lishan.spring",
    description: "梨山新佳陽產區，海拔 2,000 公尺以上，高山冷涼孕育的春茶，滋味濃郁飽滿，蜜香花香交織，入口甘甜醇厚，回甘持久令人回味。",
    origin: "台中梨山新佳陽", altitude: "2,000 公尺以上", process: "輕發酵・不烘焙",
    notes: ["海拔兩千公尺以上，高山冷涼孕育", "春茶滋味濃郁飽滿，蜜香花香交織", "入口甘甜醇厚，回甘持久令人回味"],
  },
  {
    id: "L02", name: "精緻梨山冬茶", season: "冬茶", weight: "150g（四兩）", price: 950,
    images: [IMG.lishan, IMG.lishanExtra], nameKey: "product.lishan.winter",
    description: "冬季高山嚴寒，梨山新佳陽茶葉緩慢積累精華，清香淡雅如蘭，口感柔順無苦澀，喉韻清甜悠長，餘香在口中縈繞。",
    origin: "台中梨山新佳陽", altitude: "2,000 公尺以上", process: "輕發酵・不烘焙",
    notes: ["冬季高山嚴寒，茶葉緩慢積累精華", "清香淡雅如蘭，口感柔順無苦澀", "喉韻清甜悠長，餘香在口中縈繞"],
  },
  {
    id: "D01", name: "精緻福壽山春茶", season: "春茶", weight: "150g（四兩）", price: 1750,
    images: [IMG.fushoushan, IMG.fushoushanExtra], nameKey: "product.fushoushan.spring",
    description: "福壽山農場位於台中，海拔 2,500 公尺以上，是台灣頂級高山茶產區。春茶香氣馥郁，蜜香果香層層疊現，茶湯金黃透亮，滋味醇厚甘甜無比。",
    origin: "台中福壽山", altitude: "2,500 公尺以上", process: "輕發酵・不烘焙",
    notes: ["台灣頂級高山茶，海拔超過兩千五百公尺", "春茶香氣馥郁，蜜香果香層層疊現", "茶湯金黃透亮，滋味醇厚甘甜無比"],
  },
  {
    id: "D02", name: "精緻福壽山冬茶", season: "冬茶", weight: "150g（四兩）", price: 1750,
    images: [IMG.fushoushan, IMG.fushoushanExtra], nameKey: "product.fushoushan.winter",
    description: "冬季極寒高山，福壽山茶葉精華高度濃縮，清雅花香如幽蘭，入口絲滑無比，回甘持久悠長，是送禮自用的極品之選。",
    origin: "台中福壽山", altitude: "2,500 公尺以上", process: "輕發酵・不烘焙",
    notes: ["冬季極寒高山，茶葉精華高度濃縮", "清雅花香如幽蘭，入口絲滑無比", "回甘持久悠長，是送禮自用的極品"],
  },
  {
    id: "RO1", name: "阿里山烘焙茶", season: "烘焙茶", weight: "300g（半斤）", price: 1400,
    images: [IMG.alishanRoasted, IMG.roastedExtra], nameKey: "product.alishan.roasted",
    description: "採用傳統炭焙工藝，焙火香氣深沉迷人，茶湯呈琥珀色澤，口感醇厚溫潤順滑，焦糖甜香縈繞，暖胃養身四季皆宜。",
    origin: "嘉義阿里山", altitude: "1,500 公尺", process: "傳統炭焙・中發酵",
    notes: ["傳統炭焙工藝，焙火香氣深沉迷人", "茶湯琥珀色澤，口感醇厚溫潤順滑", "焦糖甜香縈繞，暖胃養身四季皆宜"],
  },
  {
    id: "J01", name: "阿里山金萱茶", season: "金萱茶", weight: "300g（半斤）", price: 800,
    images: [IMG.jinxuan1, IMG.jinxuan2], nameKey: "product.alishan.jinxuan",
    description: "金萱品種（台茶12號）特有天然奶香，清甜迷人，阿里山高海拔栽培，茶湯蜜黃柔順，入口滑嫩無苦澀，奶香餘韻悠長，是許多茶友的入門首選。",
    origin: "嘉義阿里山", altitude: "1,500 公尺", process: "輕發酵・不烘焙",
    notes: ["金萱品種特有天然奶香，清甜迷人", "阿里山高海拔栽培，茶湯蜜黃柔順", "入口滑嫩無苦澀，奶香餘韻悠長"],
  },
  {
    id: "TB01", name: "阿里山茶包禮盒", season: "茶包", weight: "60入 × 3g", price: 980,
    images: [CDN + "teabag-1_dce6dee5.png", CDN + "teabag-2_a91ea8f9.png", CDN + "teabag-3_3aed7707.png"],
    nameKey: "product.alishan.teabag",
    description: "嚴選阿里山青心烏龍，一心二葉精製，採用日本進口棉紙茶包，耐熱保鮮充氮封裝，每包 3g，60 入精緻禮盒，適合辦公室、出差旅遊，也是送禮的貼心選擇。",
    origin: "嘉義阿里山", altitude: "1,500 公尺", process: "一心二葉・純古法炭焙",
    notes: ["一心二葉嚴選，純古法炭焙工藝", "日本進口棉紙茶包，耐熱保鮮充氮", "青心烏龍品種，茶湯清亮甘甜順口"],
  },
  {
    id: "GB01", name: "精選茶葉禮盒（半斤裝）", season: "禮盒", weight: "300g（半斤）", price: 800,
    images: [IMG.giftbox1], nameKey: "product.giftbox.half",
    description: "精選台灣高山茶，搜配典雅禮盒包裝，半斤裝，適合送禮自用兩相宜。可從三種高山烏龍茶選擇，如需客製其他茶葉，請另外私訊或在結帳備註說明。",
    notes: ["精選台灣高山烏龍茶，典雅禮盒包裝", "半斤裝，適合送禮自用兩相宜", "如需客製不同茶葉，請另外私訊或在結帳備註說明"],
    teaOptions: [
      { label: "台灣高山烏龍茶", price: 800 },
      { label: "翠峰烏龍茶", price: 1580 },
      { label: "梨山新佳陽烏龍茶", price: 2100 },
    ],
  },
  {
    id: "GB02", name: "拾遇茶葉禮盒（半斤裝）", season: "禮盒", weight: "300g（半斤）", price: 1300,
    images: [IMG.giftbox2], nameKey: "product.giftbox.shiyou",
    description: "拾遇系列，質感鐵罐搜配精致外盒，半斤裝雙罐組，送禮首選。可從三種春茶選擇，如需客製其他茶葉，請另外私訊或在結帳備註說明。",
    notes: ["拾遇系列，質感鐵罐搜配精致外盒", "半斤裝雙罐組，送禮首選", "如需客製不同茶葉，請另外私訊或在結帳備註說明"],
    teaOptions: [
      { label: "阿里山春茶", price: 1300 },
      { label: "梨山新佳陽春茶", price: 2200 },
      { label: "福壽山春茶", price: 3980 },
    ],
  },
  {
    id: "GB03", name: "圓善茶葉禮盒（一斤裝）", season: "禮盒", weight: "600g（一斤）", price: 2680,
    images: [IMG.giftbox3], nameKey: "product.giftbox.full",
    description: "圓善系列，牛皮紙質感外盒四罐組，一斤裝大份量，適合節慶送禮。可從三種春茶選擇，如需客製其他茶葉，請另外私訊或在結帳備註說明。",
    notes: ["圓善系列，牛皮紙質感外盒四罐組", "一斤裝大份量，適合節慶送禮", "如需客製不同茶葉，請另外私訊或在結帳備註說明"],
    teaOptions: [
      { label: "阿里山春茶", price: 2680 },
      { label: "梨山新佳陽春茶", price: 4280 },
      { label: "福壽山春茶", price: 7480 },
    ],
  },
  {
    id: "GB04", name: "台灣御寶禮盒", season: "禮盒", weight: "300g（半斤）", price: 800,
    images: [IMG.giftboxYuBao], nameKey: "product.giftbox.yubao",
    description: "紅黑金配色，氣派典雅的高山茶禮盒，半斤裝雙罐組，節慶送禮首選。可從三種高山烏龍茶選擇，如需客製其他茶葉，請另外私訊或在結帳備註說明。",
    notes: ["紅黑金配色，氣派典雅的高山茶禮盒", "半斤裝雙罐組，節慶送禮首選", "如需客製不同茶葉，請另外私訊或在結帳備註說明"],
    teaOptions: [
      { label: "台灣高山烏龍茶", price: 800 },
      { label: "翠峰烏龍茶", price: 1580 },
      { label: "梨山新佳陽烏龍茶", price: 2100 },
    ],
  },
  {
    id: "GB05", name: "精選茗茶禮盒", season: "禮盒", weight: "300g（半斤）", price: 1300,
    images: [IMG.giftboxJingXuan], nameKey: "product.giftbox.jingxuan",
    description: "青花瓷風格鐵罐，典雅精致，半斤裝雙罐組，適合送禮收藏。可從三種春茶選擇，如需客製其他茶葉，請另外私訊或在結帳備註說明。",
    notes: ["青花瓷風格鐵罐，典雅精致", "半斤裝雙罐組，適合送禮收藏", "如需客製不同茶葉，請另外私訊或在結帳備註說明"],
    teaOptions: [
      { label: "阿里山春茶", price: 1300 },
      { label: "梨山新佳陽春茶", price: 2200 },
      { label: "福壽山春茶", price: 3980 },
    ],
  },
  {
    id: "GB06", name: "採韻禮盒", season: "禮盒", weight: "600g（一斤）", price: 2680,
    images: [IMG.giftboxCaiYun], nameKey: "product.giftbox.caiyun",
    description: "採韻系列，質感紅色外盒四罐組，一斤裝大份量，適合節慶送禮。可從三種春茶選擇，如需客製其他茶葉，請另外私訊或在結帳備註說明。",
    notes: ["採韻系列，質感紅色外盒四罐組", "一斤裝大份量，適合節慶送禮", "如需客製不同茶葉，請另外私訊或在結帳備註說明"],
    teaOptions: [
      { label: "阿里山春茶", price: 2680 },
      { label: "梨山新佳陽春茶", price: 4280 },
      { label: "福壽山春茶", price: 7480 },
    ],
  },
  {
    id: "GB07", name: "御璽金賞包裝", season: "禮盒", weight: "依茶款而定", price: 0, priceOnRequest: true,
    images: [IMG.giftboxYuXi], nameKey: "product.giftbox.yuxi",
    description: "御璽金賞包裝為示意圖，可搭配福壽梨山茶、高山茶、阿里山茶等多款茶葉。包裝形式可選精緻鐵罐或典雅金賞紙盒。歡迎來電詢問茶款與報價。",
    notes: ["金色御璽包裝，福壽梨山、高山茶、阿里山可選", "包裝形式二選一：罐子 或 金賞紙盒", "上圖為包裝示意圖，歡迎來電詢問茶款與價格"],
  },
  {
    id: "DYL01", name: "頂級大禹嶺春茶", season: "春茶", weight: "150g（四兩）", price: 3000,
    images: [IMG.dayuling], nameKey: "product.dayuling.spring",
    description: "大禹嶺位於台中，是台灣最高海拔的茶葉產區，海拔 2,800 公尺以上。極端高寒環境使茶葉生長緩慢，積累豐富胺基酸，茶湯清甲香氣清雅，回甘持久深長，為極品收藏首選。",
    origin: "台中大禹嶺", altitude: "2,800 公尺以上", process: "輕發酵・不烘焙",
    notes: ["台灣最高海拔產區，海拔逾 2,800 公尺", "茶湯清甲香氣清雅，回甘持久深長", "極品收藏首選，適合進階茶友與送禮"],
  },
  {
    id: "LST01", name: "梨山鐵觀音", season: "春茶", weight: "150g（四兩）", price: 1750,
    images: [IMG.lishanTieguanyin], nameKey: "product.lishan.tieguanyin",
    description: "採用傳統鐵觀音品種，以梨山鐵觀音製法精製，花香清雅、音韻魅人，回甘持久。梨山新佳陽特選，四兩裝適合品鑑收藏。",
    origin: "台中梨山新佳陽", altitude: "2,000 公尺以上", process: "傳統鐵觀音製法・中發酵",
    notes: ["傳統鐵觀音品種，梨山鐵觀音制法製作", "花香清雅、音韵魅人，回甘持久", "福壽梨山特選，四兩裝適合品鑑收藏"],
  },
  {
    id: "LSBT01", name: "梨山烏龍紅茶", season: "烏龍紅茶", weight: "300g（半斤）", price: 1500,
    images: [IMG.lishanBlackTea], nameKey: "product.lishan.blacktea",
    description: "以梨山新佳陽高山烏龍茶製作的特色紅茶，紅茶香氣中帶有烏龍茶的尾韻，風味獨特，清香順口，半斤裝，適合日常品飲與送禮。",
    origin: "台中梨山新佳陽", altitude: "2,000 公尺以上", process: "全發酵・烏龍品種",
    notes: ["紅茶香氣中帶有烏龍茶的尾韻，風味獨特", "梨山高山茶區特製，清香順口", "半斤裝，適合日常品飲與送禮"],
  },
  {
    id: "LSPB01", name: "梨山頂級紅茶", season: "紅茶", weight: "75g", price: 800,
    images: [IMG.lishanPremiumBlack], nameKey: "product.lishan.premiumblack",
    description: "頂級梨山新佳陽紅茶，順口尾韻豐富，紅茶香氣清雅，口感滑順回甘持久，75g 鐵罐裝，適合進階茶友與送禮首選。",
    origin: "台中梨山新佳陽", altitude: "2,000 公尺以上", process: "全發酵・高山品種",
    notes: ["頂級梨山紅茶，順口尾韻豐富", "紅茶香氣清雅，口感滑順回甘持久", "75g 鐵罐裝，適合進階茶友與送禮首選"],
  },
  {
  id: "SXT01", name: "水仙紅茶", season: "紅茶", weight: "100g", price: 600,
    images: [IMG.shuixianBlackTea], nameKey: "product.shuixian.blacktea",
    description: "使用水仙茶種製作的紅茶，風味獨特，清香順口，溫和花香中帶清甘尾韻，100g 裝，適合日常品飲與初學茶友。",
    origin: "台灣", altitude: "高山茶區", process: "全發酵・水仙品種",
    notes: ["使用水仙茶種製作的紅茶，風味獨特", "清香順口，溫和花香中帶清甘尾韻", "100g 裝，適合日常品飲與初學茶友"],
  },
  // ── 農會認證比賽茶 ──────────────────────────────────────────────────────────
  {
    id: "CT01", name: "梨山茶王頭等獎禮盒", season: "比賽茶", weight: "150g × 2入（木質禮盒）", price: 10000,
    images: [IMG.contestLishanTop], nameKey: "product.contest.lishan.top",
    description: "2025 梨山茶品評鑑定比賽頭等獎，產自台灣最高海拔等級的和平區產區，海拔 2,000 公尺以上。政府標章認證，QRcode 可追溯產地。木質禮盒精製，150g × 2入，是珍藏送禮的極品首選。",
    origin: "台中和平區", altitude: "2,000 公尺以上", process: "輕發酵・不烘焙",
    notes: ["2025 梨山茶品評鑑定比賽 頭等獎，政府標章認證", "台灣最高海拔等級和平區產區，木質禮盒精製", "QRcode 可追溯產地，150g × 2入，適合珍藏送禮"],
  },
  {
    id: "CT02", name: "仁愛鄉農會高山茶王頭等獎", season: "比賽茶", weight: "75g × 2（共四兩）", price: 3000,
    images: [IMG.contestRenaiTop], nameKey: "product.contest.renai.top",
    description: "南投縣仁愛鄉農會比賽茶頭等獎，產自海拔 1,800 公尺的翠峰高山茶區。政府標章認證，QRcode 可追溯產地。75g × 2 共四兩精緻包裝，花香清雅、回甘悠長。",
    origin: "南投仁愛鄉", altitude: "1,800 公尺", process: "輕發酵・不烘焙",
    notes: ["南投縣仁愛鄉農會比賽茶 頭等獎，政府標章認證", "QRcode 可追溯產地，75g × 2 共四兩精緻包裝", "台灣高山茶王等級，花香清雅、回甘悠長"],
  },
  {
    id: "CT03", name: "和平區梨山茶王三星獎", season: "比賽茶", weight: "150g × 2入（共半斤）", price: 2500,
    images: [IMG.contestHeping3], nameKey: "product.contest.heping.3star",
    description: "2025 梨山茶品評鑑定比賽三星獎，台中市和平區農會認證，產自和平區海拔 2,000 公尺以上產區。QRcode 可追溯產地，梨山茶王等級，蜜香花香交織，回甘持久。",
    origin: "台中和平區", altitude: "2,000 公尺以上", process: "輕發酵・不烘焙",
    notes: ["2025 梨山茶品評鑑定比賽 三星獎，政府標章認證", "台中市和平區農會認證，QRcode 可追溯產地", "梨山茶王等級，蜜香花香交織，回甘持久"],
  },
];

export { PRODUCTS as PRODUCT_CATALOG };

// ── Image Gallery ─────────────────────────────────────────────────────────────
function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="relative aspect-square overflow-hidden bg-stone-50 rounded-2xl group">
      <img
        src={images[active]}
        alt={`${name} - 照片 ${active + 1}`}
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="上一張"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>
          <button
            onClick={() => setActive((i) => (i + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="下一張"
          >
            <ChevronRight className="w-5 h-5 text-stone-700" />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === active ? "bg-white scale-125" : "bg-white/50"}`}
                aria-label={`切換至第 ${i + 1} 張`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedTeaIdx, setSelectedTeaIdx] = useState(0); // Index into product.teaOptions

  const product = PRODUCTS.find((p) => p.id === id);

  // Scroll to top when product page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  // SEO: dynamically update page title and meta description
  useEffect(() => {
    if (!product) return;
    const prevTitle = document.title;
    document.title = `${product.name} — 迎利茶葉 Ying-Li Tea`;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDesc = metaDesc?.content ?? "";
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = `${product.name}，${product.description.slice(0, 80)}。迎利茶葉 — 台灣高山茶專賣，三十年茶農背景，產銷履歷保證。`;
    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.content = prevDesc;
    };
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen" style={{ background: "oklch(0.970 0.012 80)" }}>
        <Navbar />
        <div className="pt-32 text-center px-4">
          <p className="text-stone-500 text-lg mb-6">找不到此商品</p>
          <Button variant="outline" onClick={() => navigate("/products")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> 返回商品列表
          </Button>
        </div>
      </div>
    );
  }

  // Compute effective price (use selected tea option if available)
  const selectedTea = product.teaOptions?.[selectedTeaIdx];
  const effectivePrice = selectedTea ? selectedTea.price : product.price;

  const handleAddToCart = () => {
    const teaChoice = selectedTea?.label;
    addItem({
      id: product.id,
      cartKey: product.id + "::" + (teaChoice ?? ""),
      name: product.name,
      nameKey: product.nameKey,
      teaChoice,
      price: effectivePrice,
      quantity: qty,
      image: product.images[0],
    });
    setAdded(true);
    const displayName = teaChoice ? `${product.name}（${teaChoice}）` : product.name;
    toast({ title: "已加入購物車", description: `${displayName} × ${qty}` });
    setTimeout(() => setAdded(false), 2000);
  };

  const FREE_SHIPPING = 2000;
  const subtotal = effectivePrice * qty;
  const remaining = FREE_SHIPPING - subtotal;

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.970 0.012 80)" }}>
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-20 pb-4 px-4 max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回精選商品
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Image */}
          <div>
            <ImageGallery images={product.images} name={product.name} />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-5">
            {/* Season badge */}
            <div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                {product.season}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            {product.priceOnRequest ? (
              <div className="text-stone-500 text-sm bg-stone-100 rounded-xl px-4 py-3">
                包裝示意圖 — 歡迎來電詢問茶款與報價
              </div>
            ) : (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-stone-800">
                  NT${effectivePrice.toLocaleString()}
                </span>
                <span className="text-sm text-stone-500">{product.weight}</span>
                {product.teaOptions && product.teaOptions.length > 0 && (
                  <span className="text-xs text-stone-400">（依選茶葉而定）</span>
                )}
              </div>
            )}

            {/* Shipping threshold notice */}
            {!product.priceOnRequest && (
              <div className={`text-sm rounded-xl px-4 py-3 border ${
                subtotal >= FREE_SHIPPING
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                {subtotal >= FREE_SHIPPING
                  ? "✓ 已達 NT$2,000 免運門檻"
                  : `再加購 NT$${(remaining).toLocaleString()} 即可享免運（NT$2,000 免運）`}
              </div>
            )}

            {/* Description */}
            <p className="text-stone-600 text-sm leading-relaxed">{product.description}</p>

            {/* Origin / Altitude / Process */}
            {(product.origin || product.altitude || product.process) && (
              <div className="grid grid-cols-3 gap-3">
                {product.origin && (
                  <div className="bg-white rounded-xl p-3 border border-stone-100 text-center">
                    <p className="text-xs text-stone-400 mb-1">產地</p>
                    <p className="text-xs font-medium text-stone-700">{product.origin}</p>
                  </div>
                )}
                {product.altitude && (
                  <div className="bg-white rounded-xl p-3 border border-stone-100 text-center">
                    <p className="text-xs text-stone-400 mb-1">海拔</p>
                    <p className="text-xs font-medium text-stone-700">{product.altitude}</p>
                  </div>
                )}
                {product.process && (
                  <div className="bg-white rounded-xl p-3 border border-stone-100 text-center">
                    <p className="text-xs text-stone-400 mb-1">製法</p>
                    <p className="text-xs font-medium text-stone-700">{product.process}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tasting notes */}
            <div className="bg-white rounded-2xl border border-stone-100 p-4">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">品茗特色</p>
              <ul className="space-y-2">
                {product.notes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✦</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Qty + Add to Cart */}
            {!product.priceOnRequest && (
              <div className="flex flex-col gap-3">

                {/* Tea Selection (for gift boxes) */}
                {product.teaOptions && product.teaOptions.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-stone-700">選擇茶葉</p>
                    <div className="grid grid-cols-1 gap-2">
                      {product.teaOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedTeaIdx(idx)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                            selectedTeaIdx === idx
                              ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                              : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                          }`}
                        >
                          <span className="font-medium">{opt.label}</span>
                          <span className={`font-bold ${
                            selectedTeaIdx === idx ? "text-emerald-700" : "text-stone-800"
                          }`}>
                            NT${opt.price.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-stone-400">如需客製不同茶葉組合，請另外私訊或在結帳備註說明</p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-sm text-stone-600">數量</span>
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center hover:bg-stone-100 transition-colors text-stone-600"
                      aria-label="減少數量"
                    >
                      <span className="text-lg leading-none">−</span>
                    </button>
                    <span className="w-10 text-center text-sm font-medium text-stone-800">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-stone-100 transition-colors text-stone-600"
                      aria-label="增加數量"
                    >
                      <span className="text-lg leading-none">+</span>
                    </button>
                  </div>
                  <span className="text-sm text-stone-500">
                    小計 NT${(effectivePrice * qty).toLocaleString()}
                  </span>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full h-12 text-base font-medium gap-2"
                  style={{
                    background: added ? "oklch(0.520 0.120 145)" : "oklch(0.380 0.070 145)",
                    color: "#FAFAF7",
                  }}
                >
                  {added ? (
                    <><Check className="w-5 h-5" /> 已加入購物車</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5" /> 加入購物車</>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                  onClick={() => {
                    handleAddToCart();
                    navigate("/checkout");
                  }}
                >
                  立即購買
                </Button>
              </div>
            )}

            {product.priceOnRequest && (
              <div className="text-sm text-stone-500 bg-stone-50 rounded-xl px-4 py-3 border border-stone-200">
                此商品為包裝示意圖，請來電詢問茶款搭配與最終報價。結帳時可於備註欄填寫需求。
              </div>
            )}
          </div>
        </div>
      </div>

      <ContactFooter />
    </div>
  );
}
