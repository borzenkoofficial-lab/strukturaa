import { motion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";

const CTASection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <AnimatedSection>
        <motion.div
          className="skol-cta-panel relative overflow-hidden border border-border/70 p-8 sm:p-10 md:p-14"
          style={{ background: "linear-gradient(135deg, rgba(112,45,59,0.28), rgba(36,38,41,0.94) 58%, rgba(29,30,32,0.98))" }}
        >
          <div
            className="skol-cta-decoration absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-60"
            style={{ background: "radial-gradient(circle, rgba(112,45,59,0.26), transparent 70%)" }}
          />
          <div className="relative flex flex-col items-stretch justify-between gap-6 sm:gap-8 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">{t("cta.title")}</h2>
              <p className="text-muted-foreground max-w-lg">{t("cta.desc")}</p>
            </div>
            <div className="skol-cta-actions flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <motion.a
                href="tel:+79366669958"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3.5 font-display font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto sm:px-8 sm:py-4"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Phone className="w-5 h-5" />
                {t("cta.call")}
              </motion.a>
              <motion.button
                onClick={() => navigate("/contacts")}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-secondary px-5 py-3.5 font-display font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 sm:w-auto sm:px-8 sm:py-4"
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
