import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle, Briefcase, User, Calendar, MapPin, Clock, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SuccessOverlay from "@/components/SuccessOverlay";

interface JobApplicationModalProps {
  open: boolean;
  onClose: () => void;
}

const scheduleOptions = [
  "Полный день (5/2)",
  "Сменный (2/2, 3/3)",
  "Вахта",
  "Гибкий график",
  "Подработка",
];

const JobApplicationModal = ({ open, onClose }: JobApplicationModalProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    age: "",
    experience: "",
    district: "",
    schedule: "",
    comment: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim()) return;
    setSubmitting(true);

    try {
      const message = [
        form.age && `Возраст: ${form.age}`,
        form.experience && `Опыт: ${form.experience}`,
        form.district && `Район: ${form.district}`,
        form.schedule && `График: ${form.schedule}`,
        form.comment && `Комментарий: ${form.comment}`,
      ]
        .filter(Boolean)
        .join("\n");

      await supabase.functions.invoke("notify-request", {
        body: {
          name: form.fullName.trim(),
          phone: form.phone.trim(),
          message: message || null,
          service: "Трудоустройство — анкета соискателя",
          source: "job_application",
        },
      });

      setShowSuccess(true);
      setForm({ fullName: "", phone: "", age: "", experience: "", district: "", schedule: "", comment: "" });
      setTimeout(() => onClose(), 2500);
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
    <>
      <SuccessOverlay open={showSuccess} onClose={() => setShowSuccess(false)} />
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-display font-bold text-foreground">Устроиться на работу</h2>
                    <p className="text-xs text-muted-foreground">Заполните анкету — мы свяжемся с вами</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <X className="w-4 h-4 text-secondary-foreground" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* ФИО */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> ФИО *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="Иванов Иван Иванович"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  />
                </div>

                {/* Телефон */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  />
                </div>

                {/* Возраст + Опыт */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Возраст
                    </label>
                    <input
                      type="number"
                      min="16"
                      max="70"
                      value={form.age}
                      onChange={(e) => update("age", e.target.value)}
                      placeholder="25"
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Опыт работы
                    </label>
                    <input
                      type="text"
                      value={form.experience}
                      onChange={(e) => update("experience", e.target.value)}
                      placeholder="3 года"
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    />
                  </div>
                </div>

                {/* Район */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Район проживания
                  </label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => update("district", e.target.value)}
                    placeholder="Москва, ЮАО"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  />
                </div>

                {/* График */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Желаемый график
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {scheduleOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => update("schedule", form.schedule === opt ? "" : opt)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          form.schedule === opt
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-input border-border text-foreground hover:border-primary/40"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Комментарий */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Дополнительно</label>
                  <textarea
                    value={form.comment}
                    onChange={(e) => update("comment", e.target.value)}
                    placeholder="Расскажите о себе, навыках, пожеланиях..."
                    rows={3}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow resize-none"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-display font-semibold text-sm disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {submitting ? "Отправляем..." : "Отправить анкету"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JobApplicationModal;
