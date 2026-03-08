import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

const ContactsPage = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const contactInfo = [
    { icon: Phone, label: t("contacts.phone"), value: "+7 (936) 666-99-58", href: "tel:+79366669958" },
    { icon: Mail, label: t("contacts.email"), value: "borzenkos@vk.com", href: "mailto:borzenkos@vk.com" },
    { icon: MapPin, label: t("contacts.address"), value: t("bento.address") },
    { icon: Clock, label: t("contacts.workHours"), value: t("bento.hours") },
  ];

  return (
    <>
      <SEOHead title="Контакты" description="Свяжитесь с STRUKTURA: телефон, email, адрес офиса. Бесплатная консультация по строительным и демонтажным работам." canonical="/contacts" />
      <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{t("contacts.title")}</h1>
        <p className="text-muted-foreground mb-10">{t("contacts.subtitle")}</p>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contactInfo.map((info, i) => (
            <AnimatedSection key={info.label} delay={i * 0.1}>
              <motion.div
                className="glass-card-hover p-5 group"
                whileHover={{ y: -4 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-3 group-hover:bg-primary/25 transition-colors">
                  <info.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{info.label}</p>
                {(info as any).href ? (
                  <a href={(info as any).href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">{info.value}</a>
                ) : (
                  <p className="text-sm font-medium text-foreground">{info.value}</p>
                )}
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <motion.form
            className="glass-card p-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t("contacts.formName")}
                required
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="tel"
                placeholder={t("contacts.formPhone")}
                required
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <textarea
                placeholder={t("contacts.formMessage")}
                rows={4}
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
              <motion.button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitted ? <CheckCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                {submitted ? t("contacts.formSuccess") : t("contacts.formSubmit")}
              </motion.button>
            </div>
          </motion.form>
        </AnimatedSection>
      </div>
    </div>
    </>
  );
};

export default ContactsPage;
