import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { value: "demolition", label: "Демонтаж" },
  { value: "construction", label: "Строительство" },
  { value: "renovation", label: "Ремонт" },
  { value: "facades", label: "Фасады" },
  { value: "roofing", label: "Кровля" },
  { value: "electrical", label: "Электрика" },
  { value: "plumbing", label: "Сантехника" },
  { value: "other", label: "Другое" },
];

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const CreateListingModal = ({ onClose, onCreated }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "demolition",
    budget_min: "",
    budget_max: "",
    deadline: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title.trim() || !form.description.trim()) {
      toast({ title: "Заполните обязательные поля", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("listings").insert({
      user_id: user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      budget_min: form.budget_min ? Number(form.budget_min) : null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      deadline: form.deadline || null,
      address: form.address.trim() || null,
    });

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Заявка создана!" });
      onCreated();
    }
    setSubmitting(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <h2 className="font-display font-bold text-lg text-foreground">Новая заявка</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Заголовок *</label>
            <Input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Например: Демонтаж перегородок в офисе"
              className="rounded-xl"
              maxLength={200}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Описание *</label>
            <Textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Опишите объём работ, требования, особенности объекта..."
              className="rounded-xl min-h-[100px]"
              maxLength={2000}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Категория</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat.value }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    form.category === cat.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Бюджет от, ₽</label>
              <Input
                type="number"
                value={form.budget_min}
                onChange={e => setForm(f => ({ ...f, budget_min: e.target.value }))}
                placeholder="50 000"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Бюджет до, ₽</label>
              <Input
                type="number"
                value={form.budget_max}
                onChange={e => setForm(f => ({ ...f, budget_max: e.target.value }))}
                placeholder="200 000"
                className="rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Дедлайн</label>
            <Input
              type="date"
              value={form.deadline}
              onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
              className="rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Адрес / район</label>
            <Input
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="г. Москва, ЦАО"
              className="rounded-xl"
              maxLength={300}
            />
          </div>

          <Button type="submit" className="w-full rounded-xl" disabled={submitting}>
            {submitting ? "Создаём..." : "Опубликовать заявку"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateListingModal;
