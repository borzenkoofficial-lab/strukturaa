import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

const newsItems: { titleKey: TranslationKey; dateKey: TranslationKey; descKey: TranslationKey }[] = [
  { titleKey: "news.1.title", dateKey: "news.1.date", descKey: "news.1.desc" },
  { titleKey: "news.2.title", dateKey: "news.2.date", descKey: "news.2.desc" },
  { titleKey: "news.3.title", dateKey: "news.3.date", descKey: "news.3.desc" },
  { titleKey: "news.4.title", dateKey: "news.4.date", descKey: "news.4.desc" },
  { titleKey: "news.5.title", dateKey: "news.5.date", descKey: "news.5.desc" },
  { titleKey: "news.6.title", dateKey: "news.6.date", descKey: "news.6.desc" },
  { titleKey: "news.7.title", dateKey: "news.7.date", descKey: "news.7.desc" },
  { titleKey: "news.8.title", dateKey: "news.8.date", descKey: "news.8.desc" },
];

const NewsPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEOHead title="Материалы — СКОЛ" description="Практические материалы о подготовке объектов, сметах, демонтаже и организации строительных работ." canonical="/news" />
      <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection>
        <div className="flex items-center gap-3 mb-2">
          <Newspaper className="w-6 h-6 text-primary" />
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{t("news.title")}</h1>
        </div>
        <p className="text-muted-foreground mb-10">{t("projects.subtitle")}</p>
      </AnimatedSection>

      <div className="space-y-6">
        {newsItems.map((item, i) => (
          <AnimatedSection key={item.titleKey} delay={i * 0.12}>
            <motion.article
              className="glass-card-hover p-8 group cursor-pointer"
              whileHover={{ y: -4, scale: 1.005 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{t(item.dateKey)}</span>
              <h2 className="text-xl font-display font-semibold text-foreground mt-2 mb-3 group-hover:text-primary transition-colors">
                {t(item.titleKey)}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t(item.descKey)}</p>
            </motion.article>
          </AnimatedSection>
        ))}
      </div>
    </div>
    </>
  );
};

export default NewsPage;
