import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CinematicIntro from "@/components/CinematicIntro";
import Header from "@/components/Header";
import HomepageHero from "@/components/HomepageHero";
import CategoryPills from "@/components/CategoryPills";
import BentoGrid from "@/components/BentoGrid";
import FeaturesCarousel from "@/components/FeaturesCarousel";
import StoriesBar from "@/components/stories/StoriesBar";
import StatsSection from "@/components/StatsSection";
import ProcessSection from "@/components/ProcessSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <>
      <SEOHead canonical="/" />
      <AnimatePresence>
        {!introComplete && <CinematicIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <motion.div
        className="min-h-screen bg-background gradient-dark"
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Header />
        <StoriesBar />
        <HomepageHero />
        <CategoryPills />
        <BentoGrid />
        <FeaturesCarousel />
        <StatsSection />
        <ProcessSection />
        <CTASection />
        <Footer />
      </motion.div>
    </>
  );
};

export default Index;
