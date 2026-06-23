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
import GiftBoxSection from "@/components/GiftBoxSection";
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
    <div className="min-h-screen" style={{ background: "oklch(0.970 0.012 80)" }}>
      <Navbar />
      <HeroSection />
      <FeaturedSection />
      <GiftBoxSection />
      <AboutSection />
      <PromiseSection />
      <StorefrontSection />
      <QuoteSection />
      <FaqSection />
      <ContactFooter />
    </div>
  );
}
