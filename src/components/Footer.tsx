import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const serviceLinks = [
    { label: t("services.demolition"), path: "/services" },
    { label: t("services.construction"), path: "/services" },
    { label: t("services.renovation"), path: "/services" },
    { label: t("services.concrete"), path: "/services" },
  ];

  const companyLinks = [
    { label: t("nav.about"), path: "/about" },
    { label: t("nav.projects"), path: "/projects" },
    { label: t("nav.news"), path: "/news" },
    { label: t("nav.contacts"), path: "/contacts" },
  ];

  return (
    <motion.footer
      className="skol-site-footer border-t border-border/30"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <motion.div
              className="flex items-center gap-2 cursor-pointer mb-4"
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate("/")}
            >
              <div className="skol-footer-mark w-9 h-9 border border-primary/70 flex items-center justify-center">
                <span className="font-display font-bold text-sm text-foreground">С</span>
              </div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight">СКОЛ</span>
            </motion.div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("about.mission")}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t("footer.servicesTitle")}</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t("footer.companyTitle")}</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t("footer.contactTitle")}</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+79366669958" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  {t("footer.phone")}
                </a>
              </li>
              <li>
                <a href="mailto:borzenkos@vk.com" className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  {t("footer.email")}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {t("footer.address")}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">{t("footer.rights")}</p>
          <button
            onClick={() => navigate("/contacts")}
            className="group inline-flex items-center gap-2 text-xs font-medium text-foreground/75 transition-colors hover:text-foreground"
          >
            Обсудить объект
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
