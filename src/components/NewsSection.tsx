import { motion } from "framer-motion";
import { ArrowUpRight, Newspaper } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const NewsSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const news: { titleKey: TranslationKey; dateKey: TranslationKey; descKey: TranslationKey }[] = [
    { titleKey: "news.1.title", dateKey: "news.1.date", descKey: "news.1.desc" },
    { titleKey: "news.2.title", dateKey: "news.2.date", descKey: "news.2.desc" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Newspaper className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-display font-bold text-foreground">{t("news.title")}</h2>
          </div>
          <motion.button
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ x: 4 }}
            onClick={() => navigate("/news")}
          >
            {t("news.readMore")} <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news.map((item, i) => (
          <AnimatedSection key={item.titleKey} delay={i * 0.15}>
            <motion.div
              className="glass-card-hover p-6 cursor-pointer group relative overflow-hidden"
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate("/news")}
            >
              <span className="text-xs text-muted-foreground">{t(item.dateKey)}</span>
              <h3 className="font-display font-semibold text-foreground mt-2 mb-2 group-hover:text-primary transition-colors">
                {t(item.titleKey)}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{t(item.descKey)}</p>
              <motion.div
                className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowUpRight className="w-4 h-4 text-primary" />
              </motion.div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
