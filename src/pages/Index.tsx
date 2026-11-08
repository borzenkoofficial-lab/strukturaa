import Header from "@/components/Header";
import BentoGrid from "@/components/BentoGrid";
import FeaturesCarousel from "@/components/FeaturesCarousel";
import StoriesBar from "@/components/stories/StoriesBar";
import StatsSection from "@/components/StatsSection";
import ProcessSection from "@/components/ProcessSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SakuraAtmosphere from "@/components/SakuraAtmosphere";
import CinematicHero from "@/components/CinematicHero";
import "@/styles/cinematic-home.css";

const Index = () => {
  return (
    <div className="skol-cinematic-home relative isolate min-h-screen bg-background gradient-dark">
      <SakuraAtmosphere />
      <div className="relative z-10">
      <SEOHead canonical="/" />
      <Header />
      <main>
        <CinematicHero />
        <div className="skol-home-stories mx-auto max-w-7xl px-4 pt-7 sm:px-6 sm:pt-9">
          <StoriesBar />
        </div>
        <div id="ecosystem">
          <BentoGrid />
        </div>
      </main>

      <FeaturesCarousel />
      <StatsSection />
      <ProcessSection />
      <CTASection />
      <Footer />
      </div>
    </div>
  );
};

export default Index;
