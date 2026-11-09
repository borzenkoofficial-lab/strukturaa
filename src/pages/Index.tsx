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
import PageProgress from "@/components/PageProgress";
import HomeMotionDirector from "@/components/HomeMotionDirector";
import "@/styles/cinematic-home.css";

const Index = () => {
  return (
    <div className="skol-cinematic-home relative isolate min-h-screen bg-background gradient-dark">
      <PageProgress />
      <HomeMotionDirector />
      <SakuraAtmosphere />
      <div className="relative z-10">
        <SEOHead canonical="/" />
        <Header />
        <main>
          <CinematicHero />
          <div data-skol-reveal className="skol-home-stories mx-auto max-w-7xl px-4 pt-7 sm:px-6 sm:pt-9">
            <StoriesBar />
          </div>
          <div id="ecosystem" data-skol-reveal>
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
        <DeferredSection minHeight="760px" mobileMinHeight="1140px">
          <div data-skol-reveal><Suspense fallback={null}><FeaturesCarousel /></Suspense></div>
        </DeferredSection>
        <DeferredSection minHeight="580px" mobileMinHeight="650px">
          <div data-skol-reveal><Suspense fallback={null}><StatsSection /></Suspense></div>
        </DeferredSection>
        <DeferredSection minHeight="440px" mobileMinHeight="980px">
          <div data-skol-reveal><Suspense fallback={null}><ProcessSection /></Suspense></div>
        </DeferredSection>
        <DeferredSection minHeight="350px" mobileMinHeight="400px">
          <div data-skol-reveal><Suspense fallback={null}><CTASection /></Suspense></div>
        </DeferredSection>
        <div data-skol-reveal><Suspense fallback={null}><Footer /></Suspense></div>
      </div>
    </div>
  );
};

export default Index;
