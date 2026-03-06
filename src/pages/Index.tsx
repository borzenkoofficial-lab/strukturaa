import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import CinematicIntro from "@/components/CinematicIntro";
import Header from "@/components/Header";
import CategoryPills from "@/components/CategoryPills";
import BentoGrid from "@/components/BentoGrid";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import NewsSection from "@/components/NewsSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <>
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
        <CategoryPills />
        <BentoGrid />
        <StatsSection />
        <ServicesSection />
        <NewsSection />
        <ProcessSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </motion.div>
    </>
  );
};

export default Index;
