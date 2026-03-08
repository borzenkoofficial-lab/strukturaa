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

      setSubmitted(true);
      toast({
        title: "✅ Заявка отправлена!",
        description: "Мы перезвоним в течение 30 минут. Или звоните: +7 (936) 666-99-58",
      });
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
      <SEOHead title="Контакты" description="Свяжитесь с STRUKTURA: телефон, email, адрес офиса. Бесплатная консультация по строительным и демонтажным работам." canonical="/contacts" />
      <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{t("contacts.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("contacts.subtitle")}</p>
      </AnimatedSection>

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
                {info.href ? (
                  <a href={info.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">{info.value}</a>
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
    </>
  );
};

export default ContactsPage;
