import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const navItems = [t("nav.services"), t("nav.projects"), t("nav.about"), t("nav.contacts")];

  return (
    <motion.footer
      className="max-w-7xl mx-auto px-6 py-12 border-t border-border"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.03 }}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-sm text-primary-foreground">S</span>
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">STRUKTURA</span>
        </motion.div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          {navItems.map((item) => (
            <motion.a key={item} href="#" className="hover:text-foreground transition-colors" whileHover={{ y: -2 }}>
              {item}
            </motion.a>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{t("footer.rights")}</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
