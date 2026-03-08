import { motion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";

const CTASection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <AnimatedSection>
        <motion.div
          className="relative rounded-3xl overflow-hidden p-8 md:p-14"
          style={{ background: "linear-gradient(135deg, hsl(35 80% 55% / 0.2), hsl(30 60% 40% / 0.1))" }}
        >
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-60"
            style={{ background: "radial-gradient(circle, hsl(35 80% 55% / 0.15), transparent 70%)" }}
          />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">{t("cta.title")}</h2>
              <p className="text-muted-foreground max-w-lg">{t("cta.desc")}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <motion.a
                href="tel:+79366669958"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Phone className="w-5 h-5" />
                {t("cta.call")}
              </motion.a>
              <motion.button
                onClick={() => navigate("/contacts")}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-secondary text-secondary-foreground font-display font-semibold hover:bg-secondary/80 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {t("cta.request")}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatedSection>
    </div>
  );
};

export default CTASection;
