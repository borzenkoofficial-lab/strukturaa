import { lazy, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { lang } = useLanguage();

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
              <div className="skol-ecosystem-intro" aria-label={lang === "ru" ? "Экосистема SKOL" : "SKOL ecosystem"}>
                <div className="skol-ecosystem-intro-meta">
                  <span>02 / SKOL SYSTEM</span>
                  <span>{lang === "ru" ? "ОБЪЕКТ · ПРОЦЕСС · РЕЗУЛЬТАТ" : "SITE · PROCESS · DELIVERY"}</span>
                </div>
                <div className="skol-ecosystem-intro-main">
                  <h2>
                    {lang === "ru" ? <>ОДНА СИСТЕМА.<br /><em>ПОЛНЫЙ ЦИКЛ РАБОТ.</em></> : <>ONE SYSTEM.<br /><em>THE FULL WORK CYCLE.</em></>}
                  </h2>
                  <p>
                    {lang === "ru"
                      ? "От подготовки площадки и демонтажа до монтажа и отделки — ключевые этапы объекта связаны единым планом."
                      : "From site preparation and demolition to installation and finishing — every key stage is connected in one coordinated plan."}
                  </p>
                </div>
                <div className="skol-ecosystem-intro-rule"><i /></div>
              </div>
              <BentoGrid />
            </ParticleAssembly>
          </div>
        </main>
        <DeferredSection minHeight="760px" mobileMinHeight="1140px">
          <Suspense fallback={null}><FeaturesCarousel /></Suspense>
        </DeferredSection>
        <DeferredSection minHeight="580px" mobileMinHeight="650px">
          <Suspense fallback={null}><StatsSection /></Suspense>
        </DeferredSection>
        <DeferredSection minHeight="440px" mobileMinHeight="980px">
          <Suspense fallback={null}><ProcessSection /></Suspense>
        </DeferredSection>
        <DeferredSection minHeight="350px" mobileMinHeight="400px">
          <Suspense fallback={null}><CTASection /></Suspense>
        </DeferredSection>
        <div data-skol-reveal><Suspense fallback={null}><Footer /></Suspense></div>
      </div>
    </div>
  );
};

export default Index;
