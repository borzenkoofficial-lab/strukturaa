import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";

const TestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials: { nameKey: TranslationKey; roleKey: TranslationKey; textKey: TranslationKey; rating: number }[] = [
    { nameKey: "testimonial.1.name", roleKey: "testimonial.1.role", textKey: "testimonial.1.text", rating: 5 },
    { nameKey: "testimonial.2.name", roleKey: "testimonial.2.role", textKey: "testimonial.2.text", rating: 5 },
    { nameKey: "testimonial.3.name", roleKey: "testimonial.3.role", textKey: "testimonial.3.text", rating: 5 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <AnimatedSection>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">{t("testimonials.title")}</h2>
        <p className="text-muted-foreground mb-10">{t("testimonials.subtitle")}</p>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((item, i) => (
          <AnimatedSection key={item.nameKey} delay={i * 0.15}>
            <motion.div
              className="glass-card-hover p-6 h-full flex flex-col justify-between relative overflow-hidden group"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-primary" />
              </div>
              <div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{t(item.textKey)}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-border/30">
                <p className="text-sm font-display font-semibold text-foreground">{t(item.nameKey)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t(item.roleKey)}</p>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
