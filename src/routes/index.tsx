import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { SearchBar } from "@/components/landing/SearchBar";
import { TrendingClaims } from "@/components/landing/TrendingClaims";
import { PoliticianSpotlight } from "@/components/landing/PoliticianSpotlight";
import { DataInsights } from "@/components/landing/DataInsights";
import { EducationSection } from "@/components/landing/EducationSection";
import { NewsletterSignup } from "@/components/landing/NewsletterSignup";
import { TickerBar } from "@/components/landing/TickerBar";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sema Data — Truth Verification Engine for Kenyan Public Claims" },
      { name: "description", content: "Data-driven fact-checking platform holding Kenya's public figures accountable. Search, explore, and verify claims." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TickerBar />
      <HeroSection />
      <SearchBar />
      <TrendingClaims />
      <PoliticianSpotlight />
      <DataInsights />
      <EducationSection />
      <NewsletterSignup />
      <Footer />
    </div>
  );
}
