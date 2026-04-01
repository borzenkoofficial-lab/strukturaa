import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Banknote, Plus, Phone, User, FileText, Loader2, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AnimatedSection from "@/components/AnimatedSection";
import SuccessOverlay from "@/components/SuccessOverlay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

const sampleGigs = [
  {
    id: "1",
    title: "Разнорабочий на демонтаж",
    location: "Москва, ЦАО",
    pay: "3 500 ₽/день",
    schedule: "1–3 дня",
    description: "Нужен помощник на демонтаж перегородок в офисном здании. Опыт не обязателен.",
    urgent: true,
  },
  {
    id: "2",
    title: "Вывоз строительного мусора",
    location: "Москва, СВАО",
    pay: "5 000 ₽",
    schedule: "1 день",
    description: "Загрузка и вывоз мусора после ремонта квартиры. Нужна своя газель.",
    urgent: false,
  },
  {
    id: "3",
    title: "Подсобник на стройку",
    location: "МО, Химки",
    pay: "3 000 ₽/день",
    schedule: "Неделя",
    description: "Подсобные работы на объекте: подача материалов, уборка территории.",
    urgent: false,
  },
  {
    id: "4",
    title: "Грузчик на переезд",
    location: "Москва, ЮАО",
    pay: "4 000 ₽",
    schedule: "1 день",
    description: "Помощь с переездом офиса. Перенос мебели и оборудования.",
    urgent: true,
  },
];

const GigsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    pay: "",
    schedule: "",
    description: "",
    phone: "",
    name: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.phone.trim() || !form.name.trim()) return;
    setSubmitting(true);

    try {
      const message = [
        `Подработка: ${form.title}`,
        form.location && `Район: ${form.location}`,
        form.pay && `Оплата: ${form.pay}`,
        form.schedule && `Сроки: ${form.schedule}`,
        form.description && `Описание: ${form.description}`,
      ]
        .filter(Boolean)
        .join("\n");

      await supabase.functions.invoke("notify-request", {
        body: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          message,
          service: "Подработка",
          source: "gigs_page",
        },
      });

      setShowSuccess(true);
      setForm({ title: "", location: "", pay: "", schedule: "", description: "", phone: "", name: "" });
      setShowForm(false);
    } catch {
      toast({
        title: "Ошибка",
        description: "Попробуйте позвонить: +7 (936) 666-99-58",
        variant: "destructive",
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background gradient-dark">
      <SEOHead
        title="Подработка — STRUKTURA"
        description="Найдите подработку в строительстве и демонтаже. Короткие заявки, быстрая оплата."
        canonical="/gigs"
      />
      <Header />
      <SuccessOverlay open={showSuccess} onClose={() => setShowSuccess(false)} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">🔨 Подработка</h1>
              <p className="text-sm text-muted-foreground mt-1">Короткие заявки — быстрый заработок</p>
            </div>
            <motion.button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Разместить</span>
            </motion.button>
          </div>
        </AnimatedSection>

        {/* Create gig form */}
        {showForm && (
          <AnimatedSection>
            <motion.form
              onSubmit={handleSubmit}
              className="glass-card p-5 sm:p-6 mb-6 space-y-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-base font-display font-bold text-foreground">Новая подработка</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Название *
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="Разнорабочий на демонтаж"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Район
                  </label>
                  <input
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="Москва, ЦАО"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5" /> Оплата
                  </label>
                  <input
                    value={form.pay}
                    onChange={(e) => update("pay", e.target.value)}
                    placeholder="3 500 ₽/день"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Сроки
                  </label>
                  <input
                    value={form.schedule}
                    onChange={(e) => update("schedule", e.target.value)}
                    placeholder="1–3 дня"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Описание</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Что нужно делать, требования..."
                  rows={2}
                  className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Ваше имя *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Иван"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Телефон *
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                {submitting ? "Отправляем..." : "Опубликовать подработку"}
              </motion.button>
            </motion.form>
          </AnimatedSection>
        )}

        {/* Gigs list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sampleGigs.map((gig, i) => (
            <AnimatedSection key={gig.id} delay={i * 0.08}>
              <motion.div
                className="glass-card-hover p-4 sm:p-5 flex flex-col gap-3 group"
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-display font-bold text-foreground leading-tight">{gig.title}</h3>
                  {gig.urgent && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-destructive/15 text-[10px] font-bold text-destructive uppercase">Срочно</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{gig.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-auto">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {gig.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {gig.schedule}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-display font-bold text-primary">{gig.pay}</span>
                  <motion.button
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    Откликнуться
                  </motion.button>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GigsPage;
