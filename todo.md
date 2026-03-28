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
- [ ] Create checkout cancel page
- [ ] Implement Stripe webhook handler for payment confirmations
- [ ] Test complete payment flow from cart to Stripe to success page

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
