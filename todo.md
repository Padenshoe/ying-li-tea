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
