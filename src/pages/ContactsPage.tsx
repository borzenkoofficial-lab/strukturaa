import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import SuccessOverlay from "@/components/SuccessOverlay";

const ContactsPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);

    try {
      await supabase.functions.invoke("notify-request", {
        body: {
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim() || null,
          source: "contacts_page",
        },
      });

      setShowSuccess(true);
      setSubmitted(true);
      setName("");
      setPhone("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      toast({
        title: "Ошибка",
        description: "Попробуйте позвонить: +7 (936) 666-99-58",
        variant: "destructive",
      });
    }
    setSubmitting(false);
  };

  const contactInfo = [
    { icon: Phone, label: t("contacts.phone"), value: "+7 (936) 666-99-58", href: "tel:+79366669958" },
    { icon: Mail, label: t("contacts.email"), value: "borzenkos@vk.com", href: "mailto:borzenkos@vk.com" },
    { icon: MapPin, label: t("contacts.address"), value: t("bento.address") },
    { icon: Clock, label: t("contacts.workHours"), value: t("bento.hours") },
  ];

  return (
    <>
      <SuccessOverlay open={showSuccess} onClose={() => setShowSuccess(false)} />
      <SEOHead title="Контакты" description="Свяжитесь с STRUKTURA: телефон, email, адрес офиса. Бесплатная консультация по строительным и демонтажным работам." canonical="/contacts" />
      <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8">
      <AnimatedSection>
        <header className="skol-page-intro">
          <p className="skol-page-kicker">СКОЛ / СВЯЗАТЬСЯ</p>
          <h1 className="skol-page-title text-foreground">{t("contacts.title")}</h1>
          <p className="skol-page-subtitle">{t("contacts.subtitle")}</p>
        </header>
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:content-start">
          {contactInfo.map((info, i) => (
            <AnimatedSection key={info.label} delay={i * 0.1}>
              <motion.div
                className="glass-card-hover group p-5"
                whileHover={{ y: -4 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-secondary/60 text-primary transition-colors group-hover:border-primary/40">
                  <info.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{info.label}</p>
                {info.href ? (
                  <a href={info.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">{info.value}</a>
                ) : (
                  <p className="text-sm font-medium text-foreground">{info.value}</p>
                )}
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <div className="lg:sticky lg:top-36 lg:self-start">
        <AnimatedSection delay={0.12}>
          <motion.form
            className="glass-card p-5 sm:p-7"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t("contacts.formName")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="tel"
                placeholder={t("contacts.formPhone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <textarea
                placeholder={t("contacts.formMessage")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : submitted ? <CheckCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                {submitting ? "Отправляем..." : submitted ? t("contacts.formSuccess") : t("contacts.formSubmit")}
              </motion.button>
            </div>
          </motion.form>
        </AnimatedSection>
        </div>
      </div>
      </main>
    </>
  );
};

export default ContactsPage;
