import { motion } from "framer-motion";
import { Shield, Award, Leaf } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{t("about.title")}</h1>
        <p className="text-muted-foreground mb-10">{t("about.subtitle")}</p>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="glass-card p-8 mb-8">
          <p className="text-foreground/90 leading-relaxed text-lg">{t("about.story")}</p>
          <p className="text-primary font-display font-semibold mt-4">{t("about.mission")}</p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {values.map((v, i) => (
          <AnimatedSection key={v.titleKey} delay={0.2 + i * 0.12}>
            <motion.div
              className="glass-card-hover p-6 h-full group"
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{t(v.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(v.descKey)}</p>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
