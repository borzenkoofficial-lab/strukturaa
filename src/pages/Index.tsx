import Header from "@/components/Header";
import BentoGrid from "@/components/BentoGrid";
import FeaturesCarousel from "@/components/FeaturesCarousel";
import StoriesBar from "@/components/stories/StoriesBar";
import StatsSection from "@/components/StatsSection";
import ProcessSection from "@/components/ProcessSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background gradient-dark">
      <SEOHead canonical="/" />
      <Header />
      <BentoGrid />
      <StoriesBar />
      <FeaturesCarousel />
      <StatsSection />
      <ProcessSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
