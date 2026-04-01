/*
 * YING-LI TEA — HOME PAGE
 * Section order:
 * Navbar → Cart → Hero → Marquee → Featured Product → About → Storefront →
 * Marquee → Products → Why → Quote → FAQ → Contact/Footer
 */
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import FeaturedSection from "@/components/FeaturedSection";
import AboutSection from "@/components/AboutSection";
import StorefrontSection from "@/components/StorefrontSection";
import ProductsSection from "@/components/ProductsSection";

import WhySection from "@/components/WhySection";
import QuoteSection from "@/components/QuoteSection";
import FaqSection from "@/components/FaqSection";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    document.title = "迎利茶 Ying-Li Tea — 台灣烏龍茶、冷泡茶與精緻茶葉禮盒";
  }, []);

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
      <WhySection />
      <QuoteSection />
      <FaqSection />
      <ContactFooter />
    </div>
  );
}
