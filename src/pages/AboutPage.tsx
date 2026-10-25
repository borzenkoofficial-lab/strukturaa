import { motion } from "framer-motion";
import { Shield, Award, Leaf, ArrowUpRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

const values: { icon: typeof Shield; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: Shield, titleKey: "about.value1", descKey: "about.value1Desc" },
  { icon: Award, titleKey: "about.value2", descKey: "about.value2Desc" },
  { icon: Leaf, titleKey: "about.value3", descKey: "about.value3Desc" },
];

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEOHead title="О компании — СКОЛ" description="Подход СКОЛ к демонтажным и строительным работам: понятные этапы, согласованные объёмы и контроль исполнения." canonical="/about" />
      <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8">
        <AnimatedSection>
          <header className="skol-page-intro">
            <p className="skol-page-kicker">СКОЛ / ПОДХОД</p>
            <h1 className="skol-page-title text-foreground">{t("about.title")}</h1>
            <p className="skol-page-subtitle">{t("about.subtitle")}</p>
          </header>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <section className="relative mb-8 overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-5 sm:p-8 lg:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-50">
              <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-foreground/[0.07]" />
              <div className="absolute -right-4 -top-8 h-40 w-40 rounded-full border border-foreground/[0.07]" />
              <div className="absolute bottom-0 right-0 h-px w-full bg-gradient-to-l from-primary/60 to-transparent" />
            </div>
            <div className="relative max-w-4xl">
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">01 / Как мы работаем</p>
              <p className="text-xl font-medium leading-relaxed tracking-tight text-foreground sm:text-2xl lg:text-3xl">{t("about.story")}</p>
              <div className="mt-7 flex items-start gap-3 border-l-2 border-primary pl-4">
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{t("about.mission")}</p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="skol-page-kicker mb-0">Принципы работы</p>
          <span className="font-mono text-xs text-muted-foreground">02—04</span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:gap-4">
          {values.map((value, i) => (
            <AnimatedSection key={value.titleKey} delay={0.12 + i * 0.07}>
              <motion.article className="glass-card-hover group h-full p-5 sm:p-6" whileHover={{ y: -3 }} transition={{ duration: 0.22 }}>
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">0{i + 2} / PRINCIPLE</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-secondary/60 text-primary transition-colors group-hover:border-primary/40">
                    <value.icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                </div>
                <h2 className="mb-2 text-lg font-semibold tracking-tight text-foreground">{t(value.titleKey)}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{t(value.descKey)}</p>
                <div className="mt-6 flex justify-end border-t border-border/60 pt-4 text-muted-foreground">
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </motion.article>
            </AnimatedSection>
          ))}
        </div>
      </main>
    </>
  );
};

export default AboutPage;
