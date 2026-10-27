import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Loader2, ArrowUpRight, FileText } from "lucide-react";
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
      const { error } = await supabase.functions.invoke("notify-request", {
        body: {
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim() || null,
          source: "contacts_page",
        },
      });
      if (error) throw error;

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
    { icon: Phone, label: t("contacts.phone"), value: "+7 (936) 666-99-58", href: "tel:+79366669958", note: "Прямой звонок" },
    { icon: Mail, label: t("contacts.email"), value: "borzenkos@vk.com", href: "mailto:borzenkos@vk.com", note: "Написать письмо" },
    { icon: MapPin, label: t("contacts.address"), value: t("bento.address"), note: "География работы" },
    { icon: Clock, label: t("contacts.workHours"), value: t("bento.hours"), note: "Время для связи" },
  ];

  return (
    <>
      <SuccessOverlay open={showSuccess} onClose={() => setShowSuccess(false)} />
      <SEOHead title="Контакты — СКОЛ" description="Свяжитесь со СКОЛ по вопросам демонтажных, монтажных и комплексных строительных работ в Москве и Московской области." canonical="/contacts" />
      <main className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <AnimatedSection>
          <header className="relative mb-8 grid overflow-hidden border border-border/60 bg-card/35 shadow-[0_28px_90px_-56px_hsl(var(--primary)/0.35)] lg:grid-cols-[1fr_.72fr]">
            <div className="relative z-10 flex flex-col justify-center p-6 sm:p-9 lg:p-11">
              <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-primary sm:text-xs">
                <span className="h-px w-8 bg-primary" /> СКОЛ / СВЯЗЬ ПО ОБЪЕКТУ
              </p>
              <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[.98] tracking-[-.045em] text-foreground sm:text-5xl lg:text-6xl">{t("contacts.title")}</h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{t("contacts.subtitle")}</p>
              <div className="mt-7 flex items-center gap-3 border-t border-border/60 pt-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-primary/35 bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
                <p className="max-w-md text-xs leading-6 text-muted-foreground sm:text-sm">Для первичной оценки достаточно описания задачи, адреса или района объекта и нескольких фотографий.</p>
              </div>
            </div>
            <div className="relative min-h-[220px] overflow-hidden border-t border-border/50 sm:min-h-[300px] lg:border-l lg:border-t-0">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85)" }} role="img" aria-label="Визуальный образ рабочей площадки" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-background/5 lg:bg-gradient-to-r lg:from-background/20 lg:via-transparent lg:to-background/15" />
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)/.2) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/.2) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                <div>
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[.18em] text-primary">СКОЛ / CONTACT</span>
                  <p className="max-w-sm text-xl font-medium leading-snug text-white sm:text-2xl">Обсудим задачу и определим следующий шаг.</p>
                </div>
                <span className="hidden border border-white/25 bg-black/25 px-3 py-2 text-[9px] uppercase tracking-[.15em] text-white/80 backdrop-blur-sm sm:inline-block">Визуальный образ</span>
              </div>
            </div>
          </header>
        </AnimatedSection>

        <div className="mb-5 flex items-end justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-primary">01 / Каналы связи</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Как с нами связаться</h2>
          </div>
          <span className="hidden font-mono text-xs text-muted-foreground sm:block">СКОЛ / СВЯЗЬ</span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[.9fr_1.1fr] lg:gap-7">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:content-start">
            {contactInfo.map((info, i) => (
              <AnimatedSection key={info.label} delay={i * 0.06}>
                <motion.div className="group relative flex h-full min-h-[172px] flex-col border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/40 hover:bg-card/65 sm:p-6" whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center border border-border/70 bg-background/55 text-primary transition-colors group-hover:border-primary/40">
                      <info.icon className="h-5 w-5" strokeWidth={1.6} />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground">{info.label}</p>
                  {info.href ? (
                    <a href={info.href} className="break-words text-sm font-semibold leading-6 text-foreground transition-colors hover:text-primary">{info.value}</a>
                  ) : (
                    <p className="break-words text-sm font-semibold leading-6 text-foreground">{info.value}</p>
                  )}
                  <span className="mt-auto pt-4 text-[10px] uppercase tracking-[.12em] text-muted-foreground">{info.note}</span>
                </motion.div>
              </AnimatedSection>
            ))}
            <AnimatedSection delay={0.24} className="sm:col-span-2">
              <div className="relative overflow-hidden border border-border/60 bg-background/35 p-5 sm:p-6">
                <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full border border-primary/15" />
                <p className="relative mb-2 text-[10px] font-semibold uppercase tracking-[.17em] text-primary">Что подготовить</p>
                <p className="relative max-w-lg text-sm leading-6 text-muted-foreground">Тип объекта, ориентировочный объём, адрес или район, желаемые сроки и фотографии — это поможет точнее понять задачу до выезда.</p>
              </div>
            </AnimatedSection>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <AnimatedSection delay={0.1}>
              <motion.form className="relative overflow-hidden border border-border/70 bg-card/55 p-5 sm:p-8" onSubmit={handleSubmit}>
                <div className="pointer-events-none absolute right-0 top-0 h-px w-2/3 bg-gradient-to-l from-primary/70 to-transparent" />
                <div className="mb-7 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-primary">02 / Заявка</p>
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Обсудим ваш объект</h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Оставьте контакт и краткое описание. Используем эти данные, чтобы вернуться к предметному разговору.</p>
                  </div>
                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center border border-border/70 bg-background/50 text-primary sm:flex"><Send className="h-5 w-5" /></div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-xs font-medium text-foreground">{t("contacts.formName")}</label>
                    <input id="contact-name" type="text" placeholder="Как к вам обращаться" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className="w-full rounded-sm border border-border/80 bg-background/60 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/15" />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="mb-2 block text-xs font-medium text-foreground">{t("contacts.formPhone")}</label>
                    <input id="contact-phone" type="tel" placeholder="+7 (___) ___-__-__" value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" className="w-full rounded-sm border border-border/80 bg-background/60 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/15" />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="mb-2 block text-xs font-medium text-foreground">{t("contacts.formMessage")}</label>
                    <textarea id="contact-message" placeholder="Что требуется сделать, где находится объект, какие сроки?" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full resize-y rounded-sm border border-border/80 bg-background/60 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/15" />
                  </div>
                  <motion.button type="submit" disabled={submitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 font-display text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50" whileTap={{ scale: 0.99 }}>
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : submitted ? <CheckCircle className="h-5 w-5" /> : <Send className="h-4 w-4" />}
                    {submitting ? "Отправляем..." : submitted ? t("contacts.formSuccess") : t("contacts.formSubmit")}
                    {!submitting && !submitted && <ArrowUpRight className="ml-auto h-4 w-4" />}
                  </motion.button>
                  <p className="text-[11px] leading-5 text-muted-foreground">Отправляя заявку, вы передаёте указанные контактные данные для связи по вашему обращению.</p>
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
