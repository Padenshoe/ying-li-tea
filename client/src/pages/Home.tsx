/*
 * YING-LI TEA — HOME PAGE
 * Section order:
 * Navbar → Hero → Marquee → Featured Product → About → Storefront →
 * Quote → FAQ → Contact/Footer
 */
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import AboutSection from "@/components/AboutSection";
import StorefrontSection from "@/components/StorefrontSection";
import PromiseSection from "@/components/PromiseSection";
import QuoteSection from "@/components/QuoteSection";
import FaqSection from "@/components/FaqSection";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    document.title = "迎利茶葉 Ying-Li Tea — 台灣茶專賣，烏龍茶、茶葉禮盒、產銷履歷認證";
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
      <Navbar />
      <HeroSection />
      <FeaturedSection />
      <AboutSection />
      <PromiseSection />
      <StorefrontSection />
      <QuoteSection />
      <FaqSection />
      <ContactFooter />
    </div>
  );
}
