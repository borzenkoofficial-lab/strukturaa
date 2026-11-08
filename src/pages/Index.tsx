import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import BentoGrid from "@/components/BentoGrid";
import ParticleAssembly from "@/components/ParticleAssembly";
const FeaturesCarousel = lazy(() => import("@/components/FeaturesCarousel"));
import StoriesBar from "@/components/stories/StoriesBar";
const StatsSection = lazy(() => import("@/components/StatsSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Footer = lazy(() => import("@/components/Footer"));
import DeferredSection from "@/components/DeferredSection";
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
            <ParticleAssembly>
              <div className="skol-ecosystem-intro" aria-label="Экосистема SKOL">
                <div className="skol-ecosystem-intro-meta"><span>02 / SKOL SYSTEM</span><span>ОБЪЕКТ · ПРОЦЕСС · РЕЗУЛЬТАТ</span></div>
                <div className="skol-ecosystem-intro-main">
                  <h2>ОДНА СИСТЕМА.<br /><em>ПОЛНЫЙ ЦИКЛ РАБОТ.</em></h2>
                  <p>От инструмента и специалистов до реализации проекта — все ключевые направления в одной среде.</p>
                </div>
                <div className="skol-ecosystem-intro-rule"><i /></div>
              </div>
              <BentoGrid />
            </ParticleAssembly>
          </div>
        </main>
        <DeferredSection minHeight="clamp(480px, 52vw, 680px)">
          <Suspense fallback={null}><FeaturesCarousel /></Suspense>
        </DeferredSection>
        <DeferredSection minHeight="clamp(440px, 48vw, 620px)">
          <Suspense fallback={null}><StatsSection /></Suspense>
        </DeferredSection>
        <DeferredSection minHeight="clamp(390px, 42vw, 540px)">
          <Suspense fallback={null}><ProcessSection /></Suspense>
        </DeferredSection>
        <DeferredSection minHeight="clamp(340px, 36vw, 460px)">
          <Suspense fallback={null}><CTASection /></Suspense>
        </DeferredSection>
        <Suspense fallback={null}><Footer /></Suspense>
      </div>
    </div>
  );
};

export default Index;
