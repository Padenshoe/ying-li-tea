import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.shop": "Shop",
    "nav.faq": "FAQ",
    "nav.shopNow": "SHOP NOW",

    // Hero Section
    "hero.tagline": "Taiwanese Tea, Calm in Every Cup",
    "hero.intro": "Ying-Li brings you the finest teas originating from the misty mountains of Taiwan — crafted for those who seek stillness in every sip.",
    "hero.shopNow": "Shop Now",
    "hero.exploreTea": "Explore Our Tea",

    // Featured Section
    "featured.label": "Featured Product",
    "featured.title": "Premium Tea Gift Box",
    "featured.description": "Beautifully packaged Taiwanese oolong tea gift sets, perfect for sharing or gifting. Each box contains premium tea selections from our finest regions — a thoughtful way to introduce someone to the art of Taiwanese tea culture.",
    "featured.format": "Format",
    "featured.giftBox": "Gift Box",
    "featured.origin": "Origin",
    "featured.taiwan": "Taiwan",
    "featured.perfectFor": "Perfect For",
    "featured.gifting": "Gifting",

    // About Section
    "about.title": "About Ying-Li",
    "about.description": "Ying-Li specializes exclusively in premium Taiwanese oolong teas. From entry-level to ultra-premium selections, we source from six renowned regions: Shanlinxi, Alishan, Cuifeng, Lishan, Fushoushan, and Dayuling. Every tea is officially certified and crafted with over a century of traditional processing expertise.",

    // Storefront Section
    "storefront.title": "Our Storefront",
    "storefront.description": "Visit our elegant tea house to experience the art of tea tasting firsthand. Our serene space is designed for contemplation and discovery.",

    // Why Section
    "why.title": "The Ying-Li Difference",
    "why.qingxin": "Qingxin Oolong — Taiwan's Legacy",
    "why.qingxinDesc": "All our teas are crafted from Qingxin (青心烏龍) — a tea varietal invented by Taiwanese growers. Our processing methods have evolved over a century, creating a flavor profile that is uniquely Taiwanese and unmatched worldwide. Taiwan oolong is simply the best.",
    "why.clean": "Clean & Minimal Experience",
    "why.cleanDesc": "We strip away complexity so you can focus on what matters — the tea itself. No artificial flavors, no unnecessary additives. Just pure, honest tea.",
    "why.quality": "High-Quality Leaves",
    "why.qualityDesc": "We are selective by nature. Only teas that meet our standard of fragrance, clarity, and character make it into the Ying-Li collection.",
    "why.tradition": "Tradition Meets Convenience",
    "why.traditionDesc": "Whether you prefer the ritual of loose-leaf cold brewing or the ease of a tea bag, Ying-Li offers both — without compromising on elegance.",

    // Products Section
    "products.label": "Our Collection",
    "products.title": "Taiwan Oolong",
    "products.titleEmph": "For Every Palate",
    "products.description": "From entry-level to premium, all elevations, all officially certified. Loose leaf, cold brew, and gift collections.",
    "products.addToCart": "Add to Cart",

    // Product names and descriptions
    "product.premium": "Premium High-Mountain Oolong",
    "product.premiumTag": "Rare Selection",
    "product.premiumDesc": "Single-origin oolong from Alishan, Lishan & Dayuling. Complex floral notes, smooth finish. Officially certified.",
    "product.premiumPrice": "From $280",

    "product.coldBrew": "Cold Brew Oolong",
    "product.coldBrewTag": "Convenient",
    "product.coldBrewDesc": "Ready-to-brew format. All elevations available. Perfect for busy days without compromising on quality.",
    "product.coldBrewPrice": "From $120",

    "product.entry": "Entry-Level Oolong",
    "product.entryTag": "Everyday",
    "product.entryDesc": "Accessible quality oolong from Shanlinxi & Cuifeng. Smooth, approachable taste. Great for newcomers.",
    "product.entryPrice": "From $80",

    "product.gift": "Gift Collections",
    "product.giftTag": "Special Edition",
    "product.giftDesc": "Beautifully packaged multi-origin sets. Includes tasting notes. Perfect for gifting tea lovers.",
    "product.giftPrice": "From $380",

    "product.specialty": "Specialty Blends",
    "product.specialtyTag": "Limited Edition",
    "product.specialtyDesc": "Curated blends combining multiple regions. Unique flavor profiles. Officially certified.",
    "product.specialtyPrice": "From $200",

    "product.loose": "Loose Leaf Selection",
    "product.looseTag": "Traditional",
    "product.looseDesc": "Whole leaf oolong from all 6 regions. Full flavor, authentic experience. Multiple elevations.",
    "product.loosePrice": "From $150",

    // FAQ Section
    "faq.title": "Frequently Asked Questions",
    "faq.q1": "What makes Ying-Li different?",
    "faq.a1": "We specialize exclusively in premium Taiwanese oolong from six renowned regions. All teas are officially certified and processed using century-old traditional methods.",
    "faq.q2": "How should I brew Ying-Li tea?",
    "faq.a2": "Brewing instructions vary by tea type. Our cold brew format is ready-to-use, while loose leaf teas benefit from 3-5 minute steeps at 200-210°F. Detailed instructions come with each purchase.",
    "faq.q3": "Are your teas organic?",
    "faq.a3": "Our teas are officially certified and sourced from trusted growers in Taiwan's premium tea regions. We prioritize quality and authenticity above all.",
    "faq.q4": "Do you offer international shipping?",
    "faq.a4": "Currently, we ship within Taiwan. For international inquiries, please contact us at yinglitea@gmail.com.",

    // Contact Section
    "contact.label": "Get in Touch",
    "contact.title": "We'd love to hear from you",
    "contact.description": "Whether you have a question about our teas, a wholesale inquiry, or simply want to share your experience — we are always happy to connect.",
    "contact.email": "Email",
    "contact.instagram": "Instagram",
    "contact.followUs": "Follow Us",
    "faq.label": "Questions",
    "faq.q5": "Are more tea flavors coming?",
    "faq.a5": "Yes, we plan to expand our collection with more Taiwanese tea varieties in the future. We are exploring the full depth of Taiwan's tea landscape — from high-mountain green teas to roasted oolongs. Stay connected with us to be the first to know.",
  },
  zh: {
    // Navigation
    "nav.home": "首頁",
    "nav.about": "關於",
    "nav.shop": "商品",
    "nav.faq": "常見問題",
    "nav.shopNow": "立即購買",

    // Hero Section
    "hero.tagline": "台灣烏龍茶，每一口都是寧靜",
    "hero.intro": "迎利為您帶來源自台灣霧氣繚繞山脈的最優質茶葉 — 為那些在每一口中尋求寧靜的人而精心製作。",
    "hero.shopNow": "立即購買",
    "hero.exploreTea": "探索我們的茶",

    // Featured Section
    "featured.label": "精選商品",
    "featured.title": "高級茶葉禮盒",
    "featured.description": "精美包裝的台灣烏龍茶禮盒組合，完美適合分享或送禮。每個禮盒都包含來自我們最優質產區的精選茶葉 — 是介紹他人認識台灣茶文化藝術的絕佳方式。",
    "featured.format": "格式",
    "featured.giftBox": "禮盒",
    "featured.origin": "產地",
    "featured.taiwan": "台灣",
    "featured.perfectFor": "適合",
    "featured.gifting": "送禮",

    // About Section
    "about.title": "關於迎利",
    "about.description": "迎利專門提供高級台灣烏龍茶。從入門級到超高級選擇，我們從六個著名產區採購：杉林溪、阿里山、翠峰、梨山、福壽山和大禹嶺。每款茶葉都經過官方認證，並採用超過一百年的傳統製茶工藝精心製作。",

    // Storefront Section
    "storefront.title": "我們的門市",
    "storefront.description": "親臨我們優雅的茶館，親身體驗品茶的藝術。我們寧靜的空間設計用於冥想和發現。",

    // Why Section
    "why.title": "迎利的與眾不同",
    "why.qingxin": "青心烏龍 — 台灣的遺產",
    "why.qingxinDesc": "我們所有的茶葉都採用青心烏龍（青心烏龍）製作 — 這是台灣茶農發明的茶樹品種。我們的製茶方法已經演變了一個世紀，創造出獨特的台灣風味，在全世界無人能及。台灣烏龍茶就是第一名。",
    "why.clean": "簡潔純淨的體驗",
    "why.cleanDesc": "我們去除複雜性，讓您專注於最重要的事 — 茶本身。沒有人工香料，沒有不必要的添加物。只有純粹、誠實的茶。",
    "why.quality": "高品質茶葉",
    "why.qualityDesc": "我們天生挑剔。只有符合我們香氣、清澈度和特性標準的茶葉才能進入迎利的收藏。",
    "why.tradition": "傳統與便利的結合",
    "why.traditionDesc": "無論您偏好冷泡散茶的儀式感，還是茶包的便利性，迎利都能提供 — 而不會犧牲優雅。",

    // Products Section
    "products.label": "我們的收藏",
    "products.title": "台灣烏龍茶",
    "products.titleEmph": "適合每一種口味",
    "products.description": "從入門級到高級，所有海拔高度，全部經過官方認證。散茶、冷泡茶和禮盒組合。",
    "products.addToCart": "加入購物車",

    // Product names and descriptions
    "product.premium": "高級高山烏龍茶",
    "product.premiumTag": "稀有精選",
    "product.premiumDesc": "阿里山、梨山和大禹嶺單一產地烏龍茶。複雜的花香，順滑的尾韻。官方認證。",
    "product.premiumPrice": "起價 $280",

    "product.coldBrew": "冷泡烏龍茶",
    "product.coldBrewTag": "便利",
    "product.coldBrewDesc": "即泡即飲格式。所有海拔高度都有。完美適合忙碌的日子，不犧牲品質。",
    "product.coldBrewPrice": "起價 $120",

    "product.entry": "入門級烏龍茶",
    "product.entryTag": "日常",
    "product.entryDesc": "來自杉林溪和翠峰的平易近人的優質烏龍茶。順滑、易於接受的口感。適合新手。",
    "product.entryPrice": "起價 $80",

    "product.gift": "禮盒組合",
    "product.giftTag": "特別版",
    "product.giftDesc": "精美包裝的多產區組合。包含品茶筆記。完美適合送給茶愛好者。",
    "product.giftPrice": "起價 $380",

    "product.specialty": "特色混合茶",
    "product.specialtyTag": "限量版",
    "product.specialtyDesc": "精心挑選的多產區混合茶。獨特的風味特徵。官方認證。",
    "product.specialtyPrice": "起價 $200",

    "product.loose": "散茶精選",
    "product.looseTag": "傳統",
    "product.looseDesc": "來自全部6個產區的整片葉烏龍茶。充分的風味，正宗體驗。多種海拔高度。",
    "product.loosePrice": "起價 $150",

    // FAQ Section
    "faq.title": "常見問題",
    "faq.q1": "迎利有什麼不同之處？",
    "faq.a1": "我們專門提供來自六個著名產區的高級台灣烏龍茶。所有茶葉都經過官方認證，並採用百年傳統製茶方法製作。",
    "faq.q2": "我應該如何沖泡迎利茶？",
    "faq.a2": "沖泡方法因茶葉類型而異。我們的冷泡茶格式可直接使用，而散茶茶葉在200-210°F溫度下浸泡3-5分鐘效果最佳。詳細說明隨每次購買附送。",
    "faq.q3": "你們的茶是有機的嗎？",
    "faq.a3": "我們的茶葉經過官方認證，來自台灣高級茶葉產區的信譽良好的種植者。我們優先考慮品質和真實性。",
    "faq.q4": "你們提供國際運送嗎？",
    "faq.a4": "目前，我們在台灣境內運送。如有國際查詢，請透過 yinglitea@gmail.com 與我們聯繫。",

    // Contact Section
    "contact.label": "聯絡我們",
    "contact.title": "我們很樂意聽取您的意見",
    "contact.description": "無論您對我們的茶有任何疑問、批發查詢，或只是想分享您的體驗 — 我們始終樂意聯繫。",
    "contact.email": "電郵",
    "contact.instagram": "Instagram",
    "contact.followUs": "追蹤我們",
    "faq.label": "問題",
    "faq.q5": "會有更多茶葉風味嗎？",
    "faq.a5": "是的，我們計劃在未來擴展我們的收藏，推出更多台灣茶葉品種。我們正在探索台灣茶葉景觀的全部深度 — 從高山綠茶到烘焙烏龍茶。與我們保持聯繫，成為首先了解的人。",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
