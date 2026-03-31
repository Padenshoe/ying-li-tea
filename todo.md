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
