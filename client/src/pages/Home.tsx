/*
 * YING-LI TEA — HOME PAGE
 * Section order:
 * Navbar → Hero → Marquee → Featured Product → About → Storefront →
 * Marquee → Products → Why → Quote → FAQ → Contact/Footer
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import FeaturedSection from "@/components/FeaturedSection";
import AboutSection from "@/components/AboutSection";
import StorefrontSection from "@/components/StorefrontSection";
import ProductsSection from "@/components/ProductsSection";
import CartSection from "@/components/CartSection";
import WhySection from "@/components/WhySection";
import QuoteSection from "@/components/QuoteSection";
import FaqSection from "@/components/FaqSection";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
      <Navbar />
      <HeroSection />
      <MarqueeBanner />
      <FeaturedSection />
      <AboutSection />
      <StorefrontSection />
      <MarqueeBanner />
      <ProductsSection />
      <CartSection />
      <WhySection />
      <QuoteSection />
      <FaqSection />
      <ContactFooter />
    </div>
  );
}
