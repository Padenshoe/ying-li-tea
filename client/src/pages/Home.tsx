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
import QuoteSection from "@/components/QuoteSection";
import FaqSection from "@/components/FaqSection";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    document.title = "迎利茶 Ying-Li Tea — 台灣烏龍茶、冷泡茶與精緻茶葉禮盒";
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.990 0.004 95)" }}>
      <Navbar />
      <HeroSection />
      <FeaturedSection />
      <AboutSection />
      <StorefrontSection />
      <QuoteSection />
      <FaqSection />
      <ContactFooter />
    </div>
  );
}
