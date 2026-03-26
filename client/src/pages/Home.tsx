/*
 * YING-LI TEA — HOME PAGE
 * Section order:
 * Navbar → Hero → Marquee → Featured Product → About → Marquee →
 * Products → Why → Quote → FAQ → Contact/Footer
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import FeaturedSection from "@/components/FeaturedSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
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
      <MarqueeBanner />
      <ProductsSection />
      <WhySection />
      <QuoteSection />
      <FaqSection />
      <ContactFooter />
    </div>
  );
}
