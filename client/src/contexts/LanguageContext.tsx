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
    "hero.title": "Ying-Li",
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
    "about.teaRegions": "Tea Regions",
    "about.certification": "Certification",
    "about.certificationValue": "Official",
    "about.specialization": "Specialization",
    "about.specializationValue": "Oolong",
    "about.range": "Range",
    "about.rangeValue": "1,000–2,800m",
    "about.formats": "Formats",
    "about.formatsValue": "Loose & Cold Brew",

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
    "product.sanlinxi.spring": "杉林溪春茶",
    "product.sanlinxi.winter": "杉林溪冬茶",
    "product.alishan.spring": "阿里山春茶",
    "product.alishan.winter": "阿里山冬茶",
    "product.cuifeng.spring": "翠峰春茶",
    "product.cuifeng.winter": "翠峰冬茶",
    "product.lishan.spring": "精緻梨山春茶",
    "product.lishan.winter": "精緻梨山冬茶",
    "product.fushoushan.spring": "精緻福壽山春茶",
    "product.fushoushan.winter": "精緻福壽山冬茶",
    "product.alishan.roasted": "阿里山烘焙茶",
    "product.alishan.jinxuan": "阿里山金萱茶",
    "product.alishan.teabag": "阿里山茶包禮盒",
    "product.teaBagGiftBox": "茶包禮盒",
    "product.teaBagGiftBoxTag": "禮盒精選",
    "product.teaBagGiftBoxDesc": "精心設計的茶包禮盒，適合送禮自用。方便沖泡，保留台灣高山茶的原始香氣。",

    "product.alishan": "阿里山烏龍茶（半斤裝）",
    "product.alishanTag": "高山精品",
    "product.alishanDesc": "來自阿里山茶區的經典烏龍茶，花香清雅、回甘持久。300g 半斤裝，適合日常品飲與送禮。",

    "product.alishanRoasted": "阿里山烘焙茶（半斤裝）",
    "product.alishanRoastedTag": "烘焙精制",
    "product.alishanRoastedDesc": "經傳統烘焙工法精制，焦香淳厚、口感湫潤。粉紅色茶葉袋裝，300g 半斤。",

    "product.cuifeng": "翠峰烏龍茶（半斤裝）",
    "product.cuifengTag": "翠峰精選",
    "product.cuifengDesc": "翠峰茶區的高山烏龍，清香淡雅、茶湯清澈。300g 半斤裝，適合日常品飲。",

    "product.lishan": "精緻梨山茶（四兩裝）",
    "product.lishanTag": "高海拘精品",
    "product.lishanDesc": "海拘 2000 公尺以上的梨山茶，茶訹肃軟、香氣清雅。150g 四兩裝，適合進階茶友。",

    "product.fushoushan": "精緻福壽山茶（四兩裝）",
    "product.fushoushanTag": "極品精選",
    "product.fushoushanDesc": "台灣最高海拘茶區之一，福壽山茶香氣独特、回甘深長。150g 四兩裝，極品收藏首選。",

    "product.shanlinxi": "杉林溪烏龍茶（四兩裝）",
    "product.shanlinxiTag": "入門推薦",
    "product.shanlinxiDesc": "杉林溪經典烏龍，口感湫潤、香氣清雅。150g 四兩裝，適合初學茶友入門。",

    // FAQ Section
    "faq.description": "Everything you need to know about our teas, sourcing, and how to enjoy them at their best.",
    "faq.title": "Frequently Asked Questions",
    "faq.q1": "What makes Ying-Li different?",
    "faq.a1": "We specialize exclusively in premium Taiwanese oolong from six renowned regions. All teas are officially certified and processed using century-old traditional methods.",
    "faq.q2": "How should I brew Ying-Li tea?",
    "faq.a2": "Hot Brew: Tea-to-water ratio 1:18, recommended water temperature 90–95°C, steep for 60–80 seconds. Can be re-steeped multiple times — the fragrance deepens with each brew.\n\nCold Brew: Place tea leaves in cold water and refrigerate for 6–8 hours. Naturally sweet and smooth, with a more delicate milky aroma — perfect for summer.",
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

    "cart.title": "Shopping Cart",
    "cart.orderSummary": "Order Summary",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.free": "Free",
    "cart.total": "Total",
    "cart.checkout": "Proceed to Checkout",
    "cart.addedSuccess": "Successfully added to cart!",

    // Checkout
    "checkout.emptyCart": "Your cart is empty. Please add items before checking out.",
    "checkout.backToShop": "Back to Shop",
    "checkout.badge": "Checkout",
    "checkout.title": "Fill in Order Information",
    "checkout.subtitle": "All orders are cash on delivery. Please confirm your details before submitting.",
    "checkout.customerInfo": "Customer Information",
    "checkout.fullName": "Full Name",
    "checkout.fullNamePlaceholder": "e.g. Alex Chen",
    "checkout.gender": "Gender",
    "checkout.genderMale": "Mr.",
    "checkout.genderFemale": "Ms.",
    "checkout.genderOther": "Other",
    "checkout.phone": "Phone Number",
    "checkout.phonePlaceholder": "e.g. 0912-345-678",
    "checkout.email": "Email (optional — for order confirmation)",
    "checkout.emailPlaceholder": "your@email.com",
    "checkout.errEmailInvalid": "Please enter a valid email address",
    "checkout.deliveryMethod": "Delivery Method",
    "checkout.deliveryHomeTitle": "Home Delivery (Cash on Delivery)",
    "checkout.deliveryHomeDesc": "Deliver to your specified address and pay upon receipt",
    "checkout.delivery711Title": "7-11 Pickup (Cash on Delivery)",
    "checkout.delivery711Desc": "Pay at pickup, available at 7-ELEVEN stores",
    "checkout.address": "Delivery Address",
    "checkout.addressPlaceholder": "e.g. No. 1, Zhongxiao E. Rd., Taipei",
    "checkout.storeCode": "7-11 Store Name",
    "checkout.storeCodePlaceholder": "e.g. Taipei Zhongxiao Store",
    "checkout.storeCodeHelp": "Please enter your full 7-ELEVEN store name.",
    "checkout.note": "Note (Optional)",
    "checkout.notePlaceholder": "Any special request or note",
    "checkout.summary": "Order Summary",
    "checkout.subtotal": "Subtotal",
    "checkout.shipping": "Shipping",
    "checkout.shippingFree": "Free",
    "checkout.paymentMethod": "Payment Method",
    "checkout.paymentCod": "Cash on Delivery",
    "checkout.total": "Total",
    "checkout.submit": "Submit Order",
    "checkout.submitting": "Submitting...",
    "checkout.submitHint": "Estimated delivery: 3–5 business days after order placement.",
    "checkout.continueShopping": "← Continue Shopping",
    "checkout.errCartEmpty": "Your cart is empty. Please add products first.",
    "checkout.errSubmitFailed": "Order submission failed. Please try again later.",
    "checkout.errUnknown": "Unknown error",
    "checkout.errNameRequired": "Please enter your name",
    "checkout.errGenderRequired": "Please select gender",
    "checkout.errPhoneInvalid": "Please enter a valid phone number",
    "checkout.errDeliveryRequired": "Please select a delivery method",
    "checkout.errAddressRequired": "Address is required for home delivery",
    "checkout.errStoreRequired": "Please enter a 7-11 store name",
  },
  zh: {
    // Navigation
    "nav.home": "首頁",
    "nav.about": "關於",
    "nav.shop": "商品",
    "nav.faq": "常見問題",
    "nav.shopNow": "立即購買",

    // Hero Section
    "hero.title": "迎利",
    "hero.tagline": "台灣茶，每一杯的寧靜",
    "hero.intro": "迎利為您帶來源自台灣霧氣繚繞山脈的最優質茶葉 — 為那些在每一口中尋求寧靜的人而精心製作。",
    "hero.shopNow": "立即購買",
    "hero.exploreTea": "探索我們的茶",

    // Featured Section
    "featured.label": "精選商品",
    "featured.title": "高級阿里山茶包禮盒",
    "featured.description": "茶包禮盒送禮首選。茶包均選用阿里山一心二葉的茶葉，經傳統烘焙方式保留傳統的特色，結合現代泡茶風格，讓每一口都是高山茶的原汁原味。",
    "featured.format": "包裝形式",
    "featured.giftBox": "60入真空包裝",
    "featured.origin": "產地",
    "featured.taiwan": "台灣",
    "featured.perfectFor": "適合",
    "featured.gifting": "自用及送禮",

    // About Section
    "about.title": "關於迎利",
    "about.description": "迎利專門提供高級台灣烏龍茶。從入門級到超高級選擇，我們從六個著名產區採購：杉林溪、阿里山、翠峰、梨山、福壽山和大禹嶺。每款茶葉都經過官方認證，並採用超過一百年的傳統製茶工藝精心製作。",
    "about.teaRegions": "茶葉產區",
    "about.certification": "認證",
    "about.certificationValue": "官方認證",
    "about.specialization": "專業",
    "about.specializationValue": "烏龍茶",
    "about.range": "海拔範圍",
    "about.rangeValue": "1,000–2,800 公尺",
    "about.formats": "茶葉形式",
    "about.formatsValue": "真空包裝茶葉",

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
    "products.description": "從入門級到高級，所有海拔高度，全部經過官方認證。真空包裝茶葉、冷泡茶和禮盒組合。",
    "products.addToCart": "加入購物車",

    // Product names and descriptions
    "product.sanlinxi.spring": "杉林溪春茶",
    "product.sanlinxi.winter": "杉林溪冬茶",
    "product.alishan.spring": "阿里山春茶",
    "product.alishan.winter": "阿里山冬茶",
    "product.cuifeng.spring": "翠峰春茶",
    "product.cuifeng.winter": "翠峰冬茶",
    "product.lishan.spring": "精緻梨山春茶",
    "product.lishan.winter": "精緻梨山冬茶",
    "product.fushoushan.spring": "精緻福壽山春茶",
    "product.fushoushan.winter": "精緻福壽山冬茶",
    "product.alishan.roasted": "阿里山烘焙茶",
    "product.alishan.jinxuan": "阿里山金萱茶",
    "product.alishan.teabag": "阿里山茶包禮盒",
    "product.teaBagGiftBox": "茶包禮盒",
    "product.teaBagGiftBoxTag": "禮盒精選",
    "product.teaBagGiftBoxDesc": "精心設計的茶包禮盒，適合送禮自用。方便沖泡，保留台灣高山茶的原始香氣。",

    "product.alishan": "阿里山烏龍茶（半斤裝）",
    "product.alishanTag": "高山精品",
    "product.alishanDesc": "來自阿里山茶區的經典烏龍茶，花香清雅、回甘持久。300g 半斤裝，適合日常品飲與送禮。",

    "product.alishanRoasted": "阿里山烘焙茶（半斤裝）",
    "product.alishanRoastedTag": "烘焙精制",
    "product.alishanRoastedDesc": "經傳統烘焙工法精制，焦香淳厚、口感湫潤。粉紅色茶葉袋裝，300g 半斤。",

    "product.cuifeng": "翠峰烏龍茶（半斤裝）",
    "product.cuifengTag": "翠峰精選",
    "product.cuifengDesc": "翠峰茶區的高山烏龍，清香淡雅、茶湯清澈。300g 半斤裝，適合日常品飲。",

    "product.lishan": "精緻梨山茶（四兩裝）",
    "product.lishanTag": "高海拘精品",
    "product.lishanDesc": "海拘 2000 公尺以上的梨山茶，茶莓肃軟、香氣清雅。150g 四兩裝，適合進階茶友。",

    "product.fushoushan": "精緻福壽山茶（四兩裝）",
    "product.fushoushanTag": "極品精選",
    "product.fushoushanDesc": "台灣最高海拘茶區之一，福壽山茶香氣独特、回甘深長。150g 四兩裝，極品收藏首選。",

    "product.shanlinxi": "杉林溪烏龍茶（四兩裝）",
    "product.shanlinxiTag": "入門推薦",
    "product.shanlinxiDesc": "杉林溪經典烏龍，口感湫潤、香氣清雅。150g 四兩裝，適合初學茶友入門。",

    // FAQ Section
    "faq.description": "關於我們的茶葉、產地來源，以及如何以最佳方式享用，您需要知道的一切。",
    "faq.title": "常見問題",
    "faq.q1": "迎利有什麼不同之處？",
    "faq.a1": "我們專門提供來自六個著名產區的高級台灣烏龍茶。所有茶葉都經過官方認證，並採用百年傳統製茶方法製作。",
     "faq.q2": "如何沖泡迎利茶？",
    "faq.a2": "熱泡：茶葉與水比例 1:18，建議水溫 90–95°C，浸泡 60–80 秒，可回沖多次，越泡越顯茶香。\n\n冷泡：將茶葉放入冷水中，置於冰箱冷藏 6–8 小時，清甜順口，茶香更加細致，夏日首選。",
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

    "cart.title": "購物車",
    "cart.orderSummary": "訂單摘要",
    "cart.subtotal": "小計",
    "cart.shipping": "運費",
    "cart.free": "免費",
    "cart.total": "總計",
    "cart.checkout": "前往結帳",
    "cart.addedSuccess": "已成功加入購物車！",

    // Checkout
    "checkout.emptyCart": "購物車是空的，請先加入商品再結帳。",
    "checkout.backToShop": "返回選購",
    "checkout.badge": "結帳",
    "checkout.title": "填寫訂購資料",
    "checkout.subtitle": "所有訂單均採貨到付款，請確認資料後送出。",
    "checkout.customerInfo": "客戶資料",
    "checkout.fullName": "姓名",
    "checkout.fullNamePlaceholder": "例：陳小明",
    "checkout.gender": "性別",
    "checkout.genderMale": "先生",
    "checkout.genderFemale": "女士",
    "checkout.genderOther": "其他",
    "checkout.phone": "聯絡電話",
    "checkout.phonePlaceholder": "例：0912-345-678",
    "checkout.email": "Email（選填，用於寄送訂單確認信）",
    "checkout.emailPlaceholder": "your@email.com",
    "checkout.errEmailInvalid": "請填寫有效的 Email 地址",
    "checkout.deliveryMethod": "配送方式",
    "checkout.deliveryHomeTitle": "宅配（貨到付款）",
    "checkout.deliveryHomeDesc": "送到您指定的地址，收貨時付款",
    "checkout.delivery711Title": "7-11 店到店（貨到付款）",
    "checkout.delivery711Desc": "取貨時在門市付款，僅限 7-ELEVEN",
    "checkout.address": "收件地址",
    "checkout.addressPlaceholder": "例：台北市中正區忠孝東路一段1號",
    "checkout.storeCode": "7-11 門市名稱",
    "checkout.storeCodePlaceholder": "例：台北忠孝門市",
    "checkout.storeCodeHelp": "請填寫您要取貨的 7-ELEVEN 門市全名，例如「台北忠孝門市」",
    "checkout.note": "備註（選填）",
    "checkout.notePlaceholder": "如有特殊需求或說明，請在此填寫",
    "checkout.summary": "訂單摘要",
    "checkout.subtotal": "小計",
    "checkout.shipping": "運費",
    "checkout.shippingFree": "免費",
    "checkout.paymentMethod": "付款方式",
    "checkout.paymentCod": "貨到付款",
    "checkout.total": "總計",
    "checkout.submit": "確認送出訂單",
    "checkout.submitting": "送出中…",
    "checkout.submitHint": "預計三到五個工作日到貨",
    "checkout.continueShopping": "← 繼續選購",
    "checkout.errCartEmpty": "購物車是空的，請先加入商品",
    "checkout.errSubmitFailed": "訂單送出失敗，請稍後再試",
    "checkout.errUnknown": "未知錯誤",
    "checkout.errNameRequired": "請填寫姓名",
    "checkout.errGenderRequired": "請選擇性別",
    "checkout.errPhoneInvalid": "請填寫有效電話號碼",
    "checkout.errDeliveryRequired": "請選擇配送方式",
    "checkout.errAddressRequired": "宅配需填寫收件地址",
    "checkout.errStoreRequired": "請填寫 7-11 門市名稱",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh");

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
