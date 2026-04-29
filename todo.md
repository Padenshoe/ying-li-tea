# Ying-Li Tea - Project TODO

## Stripe Payment Integration

- [x] Add Stripe feature to project (web-db-user upgrade)
- [x] Create database schema for products and orders tables
- [x] Create Stripe router with checkout session creation
- [x] Create Stripe router with order retrieval and payment verification
- [x] Update CartSection to integrate with Stripe checkout
- [x] Create checkout success page with order details
- [x] Add checkout success route to App.tsx
- [x] Write unit tests for Stripe checkout functionality
- [ ] Seed products database with 6 tea products
- [x] Create checkout cancel page
- [ ] Implement Stripe webhook handler for payment confirmations
- [x] Test complete payment flow from cart to Stripe to success page

## Website Features (Completed)

- [x] Hero section with storefront photo background
- [x] Featured product carousel with rotating gift box images
- [x] About section with tea ceremony room background
- [x] Products section with horizontal scrollable carousel
- [x] Why Ying-Li section highlighting Qingxin Oolong heritage
- [x] FAQ section with bilingual content
- [x] Contact/Footer section with email and social links
- [x] Bilingual support (English/Traditional Chinese)
- [x] Shopping cart system with add-to-cart functionality
- [x] Cart display at top of page with quantity controls
- [x] Mobile-responsive design with white navbar
- [x] Logo integration in navbar and hero section
- [x] Marquee banner sections

## Next Steps

1. Seed the products table with the 6 tea products from ProductsSection
2. Create checkout cancel page for failed transactions
3. Implement webhook handler for Stripe payment events
4. Test full payment flow with Stripe test cards
5. Optional: Add customer testimonials section
6. Optional: Add product detail pages
7. Optional: Implement order tracking system

## UI Refinements (Completed)

- [x] Move shopping cart from top section to navbar (cart icon with item count)
- [x] Remove CartSection from Home page
- [x] Update About section title to be more readable (changed to "Our Heritage")
- [x] Update navbar background to white for better visibility

## New Feature Requests (Completed)

- [x] Add product images to cart dropdown display
- [x] Remove currency toggle from navbar
- [x] Create dedicated Cart page with full cart display
- [ ] Add currency selection next to each product (not in navbar)
- [x] Display prices in selected currency throughout the site

## Cart Flow Fix (Completed)

- [x] Diagnose why View Cart shows empty cart despite items being added (root cause: window.location.href caused full page reload, clearing React state)
- [x] Fix cart state persistence across page navigation (localStorage persistence added)
- [x] Verify Stripe checkout works end-to-end without errors

## i18n Translation Fixes (Completed)

- [x] Remove raw "ABOUT.*" keys from About section labels (now use proper translation keys)
- [x] Fix "faq.description" raw key showing in FAQ section (added EN + ZH translations)
- [x] Add Mandarin translations for Featured Product (title, description, labels)

## Mobile Product Carousel Fix (Completed)

- [x] Fix product cards not centered on mobile carousel (scroll-snap center + padding offset)
- [x] Implement proper CSS scroll-snap for left/right swipe with dot indicators
- [x] Add currency toggle (USD/TWD) above the product carousel

## Three New Improvements (Completed)

- [x] Translate product names in cart dropdown and Cart page when language is 中文 (nameKey stored in cart, translated at render time)
- [x] Add floating back-to-top button (visible after 400px scroll, smooth scroll to top)
- [x] Implement Stripe webhook handler at /api/stripe/webhook to update order status (4 tests passing)

## Cart Dropdown Fixes (Completed)

- [x] Fix cart dropdown mobile layout — responsive width using min(24rem, 100vw - 1.5rem)
- [x] Fix product name not translating to Mandarin in cart (added PRODUCT_NAME_KEYS fallback map for legacy localStorage items)

## Map Integration (Completed)

- [x] Search Google Maps for Ying-Li Tea location in Taichung, Taiwan (迎利茶葉 茶葉送禮, 4.9★, No. 135 Yongchun E Rd, Nantun District)
- [x] Add real address, phone number to the Visit Us section
- [x] Embed interactive Google Map with hover overlay and clickable "View on Google Maps" link in ContactFooter

## Cart Dropdown Mobile Crop Fix (Completed)

- [x] Fix cart dropdown still cropping/overflowing on mobile screens (switched to fixed positioning centered in viewport)

## Three New Features (Completed)

- [x] Translate Cart page UI to Mandarin (buttons, labels, empty state message) — already fully implemented with inline bilingual translations
- [x] Create Order History page at /orders for logged-in customers — auth guard, order list with items/status/total, bilingual, currency-aware
- [x] Add contact form to ContactFooter (name, email, message fields) — validation, tRPC mutation, notifyOwner notification, bilingual labels and errors
- [x] Add Orders icon to Navbar (visible when logged in) linking to /orders
- [x] Write 6 unit tests for contact.submitInquiry (17 total tests passing across 4 test files)

## Order Lookup by Order Number + Last Name (Completed)

- [x] Add `customerLastName` column to orders table in schema.ts
- [x] Run `pnpm db:push` to migrate the database
- [x] Update Stripe checkout to collect billing name and extract/store last name
- [x] Update webhook handler to store last name on checkout.session.completed
- [x] Add `lookupOrder` publicProcedure that matches by order ID + last name (case-insensitive)
- [x] Remove `getOrderHistory` protectedProcedure (replaced by lookup)
- [x] Rewrite Orders page as a lookup form (order number + last name input)
- [x] Show order details after successful lookup; show error if not found
- [x] Remove Orders navbar icon (no longer login-gated)
- [x] Write 9 unit tests for lookupOrder procedure (26 total tests passing across 5 test files)

## 中文化 + 自訂結帳表單 (Completed)

- [x] 鎖定中文介面：LanguageContext 預設 zh，移除語言切換按鈕（Navbar）
- [x] 新增 customOrders 資料表（姓名、性別、電話、配送方式、地址/門市、商品、總額）
- [x] 執行 pnpm db:push 建立 customOrders 資料表
- [x] 建立 server/routers/order.ts：submitOrder publicProcedure，儲存訂單並寄信至 yinglitea@gmail.com
- [x] 在 routers.ts 中註冊 orderRouter
- [x] 建立 /checkout 頁面：姓名、性別、電話、配送方式選擇（宅配/7-11）、地址/門市欄位、備註
- [x] CartSection「前往結帳」按鈕改為導向 /checkout（移除 Stripe createCheckout 呼叫）
- [x] StorefrontSection 文字改為中文：親臨迎利、親臨迎利茶的溫暖、踏入我們溫馨的茶空間…
- [x] FeaturedSection 禮盒茶包圖片放大（w-[95%]，容器高度提升）
- [x] 撰寫 11 個 order 單元測試（37 個測試全部通過，共 6 個測試檔案）

## SEO Fixes (Completed)

- [x] Set descriptive page title (34 chars, 30–60 range) via document.title in Home.tsx: "迎利茶 Ying-Li Tea — 台灣烏龍茶、冷泡茶與精緻茶葉禮盒"
- [x] Add keyword meta tag in index.html (台灣茶,烏龍茶,冷泡茶,茶葉禮盒,高山茶,台灣烏龍,迎利茶,茶包,青心烏龍,東方美人茶)
- [x] Update html lang attribute to zh-TW in index.html

## 台灣付款流程審核 + 結帳改善 (Completed)

- [x] 審核台灣付款方式（ECPay、貨到付款、ATM、超商代碼） — 貨到付款最適合小型茶艘
- [x] 修複資料庫遷移：執行 `pnpm db:push` 補上 `customerLastName` 欄位
- [x] 建立 /order-confirmation 頁面：顯示訂單編號、商品、配送方式、貨到付款說明
- [x] 更新 Checkout.tsx：送出成功後導向 /order-confirmation（傳遞訂單資料）
- [x] 在 App.tsx 中註冊 /order-confirmation 路由
- [x] 所有 37 個測試通過（所 6 個測試檔案）

## 沖泡教學影片 + 結帳登入修復 (Completed)

- [x] 上傳熱泡和冷泡影片至 CDN
- [x] 建立 BrewingSection 元件：兩欄並排（桌面）/上下堆疊（手機），各含影片、步驟說明
- [x] 在 Home.tsx 中插入 BrewingSection（ProductsSection 和 WhySection 之間）
- [x] 修復 Cart.tsx 登入攔截問題：移除 Stripe 流程和 auth 檢查，改為導向 /checkout
- [x] TypeScript 零錯誤，37 個測試全部通過

## 照片整合 (Completed)

- [x] 審核 122 張照片，選出 12 張最佳照片
- [x] 上傳 12 張照片至 CDN
- [x] HeroSection：更換為 DSC02930（茶室全景，圓燈籠、木桌、亞麻天花板）
- [x] AboutSection：更換為 DSC02885（私人茶室，長木桌，溫暖燈光）
- [x] StorefrontSection：重新設計為照片牆（外觀招牌 + 3 張店內照片 + 說明文字）
- [x] 新增 TeaExperienceSection：茶室體驗區塊（茶具照 + 茶點照 + 抹茶蛋糕 + 4 個特色標籤）
- [x] 在 Home.tsx 中加入 TeaExperienceSection（位於 StorefrontSection 之後）
- [x] TypeScript 零錯誤，37 個測試全部通過

## 商品名稱/價格更新 + 運費邏輯 (Completed)

- [x] 更新 ProductsSection：7 個正確商品名稱（茶包禮盒 NT$980、阿里山 NT$1,100、阿里山烘焙 NT$1,400、翠峰 NT$1,300、梨山 NT$950、福壽山 NT$1,750、杉林溪 NT$400）
- [x] 所有商品改為直接 TWD 定價（不再用 USD 換算）
- [x] 更新 LanguageContext EN/ZH 兩組翻譯 key（7 個商品）
- [x] 更新商品圖片：茶包禮盒用真實照片，其他用茶葉/茶杯照片
- [x] Checkout.tsx 加入運費邏輯：宅配滿 NT$2,000 免運，未滿 NT$130；7-11 店到店免運
- [x] 結帳頁面即時顯示「還差 NT$X 免運」或「✓ 已達免運門檻」提示
- [x] 訂單確認頁面顯示小計、運費、總計（含運費）
- [x] 後端 order.ts 加入 shippingFee 欄位，email 通知顯示正確運費
- [x] 所有 37 個測試通過（6 個測試檔案）

## 商品頁面 /products (Completed)

- [x] 上傳 6 張商品照片至 CDN
- [x] 建立 /products 頁面：11 個商品卡片（春茶/冬茶各自編號、重量、價格、3行口感介紹）
- [x] 每個商品卡片有「加入購物車」按鈕
- [x] Navbar 加入「精選商品」連結導向 /products
- [x] TypeScript 零錯誤，37 個測試全部通過

## 商品照片更換 + 數量選擇器 + 社群連結修正 + 選茶問卷頁面

- [x] 上傳 6 張新商品照片至 CDN（杉林溪/阿里山/翠峰/梨山/福壽山/烘焙阿里山）
- [x] 更新 Products.tsx 商品照片 CDN 網址
- [x] 加入購物車旁新增數量輸入框（+/- 按鈕）
- [x] 刪除 ContactFooter 中的 Pinterest 連結
- [x] 更新 Instagram 連結至 https://www.instagram.com/yinglitea/
- [x] 更新 Facebook 連結至 https://www.facebook.com/yinglitea?locale=zh_TW
- [x] 建立 /tea-quiz 專屬選茶問卷頁面（5 個問題）
- [x] 問卷結果推薦一款茶葉，可直接加入購物車
- [x] Navbar 加入「專屬選茶」連結
- [x] App.tsx 註冊 /tea-quiz 路由
- [x] TypeScript 零錯誤，37 個測試全部通過

## Navbar 導航修正 + 選茶邏輯重寫

- [x] Navbar 首頁/關於/常見問題：在非首頁時先跳回首頁再滾動到對應區塊
- [x] Logo 點擊跳回首頁
- [x] 選茶邏輯：清淡→冬茶、重口味→春茶
- [x] 選茶邏輯：喝茶頻率越高→越貴款（梨山/福壽山），幾乎不喝→阿里山
- [x] 選茶邏輯：回甘→春茶、滑順→冬茶、香氣→烘焙茶
- [x] 選茶邏輯：濃厚→春茶

## 首頁大幅更新

- [x] 上傳 6 張店面照片至 CDN
- [x] Our Heritage 背景改成第一張照片（DSC03082 茶架照）
- [x] 刪除「茶室體驗」區塊（已在之前實施）
- [x] 刪除「我們的收藏」區塊（已在之前實施）
- [x] 哲學標語改為「讓「好茶」變簡單，不是把「茶」變簡單」
- [x] FAQ 沖泡說明更新（熱泡/冷泡詳細說明）
- [x] 親臨迎利照片换成第 2–5 張（DSC03078 為主要、DSC02964/DSC02966/DSC03059/DSC03065 為小圖）
- [x] 首頁「立即購買」跳到 /products
- [x] 首頁「線上選購」跳到 /products

## UI 修正（第三批）

- [x] 刪除「我們的收藏」區塊（台灣烏龍茶適合每種口味）
- [x] Navbar 所有連結與 Logo 同排（水平排列）
- [x] 高級茶葉禮盒說明改為「60入包裝，適合自用以及送禮」
- [x] 立即購買跳到 /products
- [x] 走進迎利空間照片下方文字全部刪除
- [x] 頁尾 Logo 已存在（之前已建立）

## 禮盒動畫 + 文字修正（第四批）

- [x] 上傳兩張阿里山茶包禮盒照片至 CDN
- [x] 茶葉形式「散茶」改成「真空包裝」
- [x] FAQ 冷泡說明「奶香」改成「茶香」
- [x] FeaturedSection 禮盒名稱改為「高級阿里山茶包禮盒」
- [x] FeaturedSection 禮盒描述更新（茶包禮盒送禮、一心二葉、傳統烘焙）
- [x] FeaturedSection 禮盒展示改為兩張圖片 CSS 360° 旋轉動畫

## 禮盒影片替換（第五批）

- [x] 上傳茶包禮盒旋轉影片至 CDN
- [x] FeaturedSection 改為靜音循環播放影片（移除 CSS 旋轉動畫）

## 商品照片輪播 + 金萱茶新商品（第六批）

- [x] 上傳 7 張新商品照片至 CDN（阿里山/翠峰/梨山/福壽山/烘焙/金萱茶x2）
- [x] Products.tsx：每個商品卡片加入多圖輪播（點擊縮圖切換主圖）
- [x] Products.tsx：新增阿里山金萱茶 J01（300g / 半斤，NT$1,600，兩張照片）
- [x] TeaQuiz.tsx：選到「奶香」時推薦結果改為阿里山金萱茶

## 茶包禮盒 + 首頁調整（第七批）

- [x] 上傳三張茶包照片至 CDN
- [x] FeaturedSection：移除影片，改為三張圖片每 5 秒輪播
- [x] Products.tsx：新增阿里山茶包禮盒 TB01（60入，NT$980，一心二葉，純古法烘焙）
- [x] AboutSection：海拔範圍改為 1,000–2,800 公尺
- [x] CartSection：購物車商品名稱改為中文
- [x] 首頁刪除第一頁與第二頁之間的 MarqueeBanner（Loop High Mountain Oolong Cold Brew）

## 結帳文字 + 訂單 Email 通知（第八批）

- [x] Checkout.tsx：結帳提示文字改為「三到五個工作日到貨」
- [x] LanguageContext.tsx：更新對應翻譯 key
- [x] 後端訂單送出後寄送完整訂單資訊至 neil34689@gmail.com（商品、數量、姓名、性別、電話、配送方式、地址、備註）

## 顧客確認信 + Email 欄位（第九批）

- [x] Checkout.tsx：新增 Email 欄位（選填）
- [x] LanguageContext.tsx：新增 Email 欄位翻譯 key
- [x] order router：訂單送出後寄送顧客確認信（以迎利茶葉名義），並副本至 yinglitea@gmail.com- [x] 確認訂單成功頁面顯示「訂單成功」訊息

## 訂單確認頁面資訊遺失修復（第十批）

- [x] 診斷訂單資訊遺失根本原因（URL 參數過長/解析錯誤）
- [x] 改用 sessionStorage 傳遞訂單資料至確認頁面
- [x] 確認頁面從 sessionStorage 讀取訂單資料並顯示

## 訂單確認頁修復 + Email 收件人更新（第十一批）

- [x] 深入診斷訂單確認頁面仍顯示「訂單資訊遺失」的原因
- [x] 修復確認頁面正確讀取訂單資料
- [x] Email 收件人改為顧客 Email + yinglitea@gmail.com（移除 neil34689@gmail.com）

## 確認頁文字刪除 + Email 修復（第十二批）

- [x] OrderConfirmation.tsx：刪除底部「訂單編號 #0 已儲存，您可隨時透過「查詢訂單」功能查看進度」文字
- [x] 排查並修復 Email 寄送 API 404 問題（改用 Resend）

## 顧客 Email 寄送修復（第十三批）

- [ ] 診斷 Resend 顧客確認信未寄出原因（查看日誌）
- [ ] 修復並驗證 Email 寄送功能

## 更新 Resend 寄件人（第十四批）

- [x] order.ts：寄件人改為「迎利茶葉 <info@yinglitea.co>」

## SEO 修復（第十五批）

- [x] 縮減 meta keywords 至 3–8 個核心關鍵字（目前 10 個）
- [x] 更新 meta description 長度至 50–160 字元（目前 48 字元）

## 首頁文案全面更新（第十六批）

- [x] HeroSection：主標題改為「迎利茶葉」、副標題「二十年茶行，台灣高山烏龍茶專賣」、說明文字更新、移除「台灣茶，每一杯的寧靜」
- [x] AboutSection：替換為二十年茶行背景文案（六大產區、產銷履歷、門市試喝）
- [x] 新增「迎利的承諾」區塊（三點承諾），放在 About 下方
- [x] QuoteSection：引言改為「茶葉的價値，應該讓你看得見」
- [x] FaqSection：新增「迎利跟其他茶品牌有什麼不同？」問答
- [x] FaqSection：「會有更多茶葉風味嗎？」答案改為精選二十款說法

## 預約品茶按鈕 & 品牌名稱統一（第十七批）

- [x] StorefrontSection：新增「預約品茶 / Book a Visit」按鈕（連結 inline.app）
- [x] Navbar：新增「預約品茶 / Book a Visit」連結
- [x] 統一品牌名稱為「迎利茶葉 / Ying-Li Tea」（footer、page title、LanguageContext）

## SEO 關鍵字全面優化（第十八批）

- [x] 更新 meta keywords：改為台灣茶主軸，6 個核心關鍵字
- [x] 更新 meta description：重寫為 150 字以內，強調台灣茶全品項、產銷履歷、試喝
- [x] 更新 H1 標題（Hero 主標題）：加入關鍵字，不只是品牌名
- [x] 更新 H2 標題（FeaturedSection）：優化「高級阿里山茶包礼盒」

## 文案修正與繁體字統一（第十九批）

- [x] Hero 副標題：改為強調烏龍茶特色、全台灣各海拔
- [x] Featured H2：改回簡潔版本
- [x] 修正全站簡體字為繁體字（礼盒、試喝等）
- [x] 修正 meta description 與 title 中的簡體字

## Favicon 設定（第二十批）

- [x] 將迎利 Logo 轉換為 favicon（32x32、16x16、180x180 apple-touch-icon）
- [x] 上傳至網站 public 目錄並更新 index.html

## GTM dataLayer 購買事件推送（第二十一批）

- [x] /order-confirmation 頁面加入 dataLayer.push：event=purchase、value、order_id、user_email
