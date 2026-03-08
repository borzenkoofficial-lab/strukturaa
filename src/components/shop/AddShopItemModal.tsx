import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Plus, Loader2, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { value: "power_tools", label: "Электроинструмент" },
  { value: "hand_tools", label: "Ручной инструмент" },
  { value: "measurement", label: "Измерительные" },
  { value: "safety", label: "Защита и СИЗ" },
  { value: "consumables", label: "Расходники" },
  { value: "other", label: "Другое" },
];

const CONDITIONS = [
  { value: "new", label: "Новый" },
  { value: "like_new", label: "Как новый" },
  { value: "used_good", label: "Б/У хорошее" },
  { value: "used_fair", label: "Б/У среднее" },
];

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const AddShopItemModal = ({ onClose, onCreated }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "power_tools",
    condition: "used_good",
    price: "",
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user || photos.length >= 5) return;

    setUploading(true);
    const newPhotos: string[] = [];

    for (const file of Array.from(files).slice(0, 5 - photos.length)) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `shop/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (!error) {
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
        newPhotos.push(urlData.publicUrl);
      }
    }

    setPhotos(prev => [...prev, ...newPhotos]);
    setUploading(false);
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title.trim()) {
      toast({ title: "Укажите название товара", variant: "destructive" });
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast({ title: "Укажите цену", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("shop_items").insert({
      user_id: user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      condition: form.condition,
      price: Number(form.price),
      photos: photos.length > 0 ? photos : [],
    });

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Товар добавлен!" });
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
          <div>
            <h2 className="font-display font-bold text-lg text-foreground">Продать инструмент</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Заполните информацию о товаре</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Photos */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Фото <span className="text-muted-foreground font-normal">(до 5 штук)</span>
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {photos.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-5 h-5 text-destructive" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[8px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-md font-bold">
                      Главное
                    </span>
                  )}
                </div>
              ))}

              {photos.length < 5 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors shrink-0">
                  {uploading ? (
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                  ) : (
                    <>
                      <ImagePlus className="w-5 h-5 text-muted-foreground mb-0.5" />
                      <span className="text-[9px] text-muted-foreground">Добавить</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Название *</label>
            <Input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Например: Перфоратор Bosch GBH 2-26"
              className="rounded-xl"
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Описание</label>
            <Textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Состояние, комплектация, причина продажи..."
              className="rounded-xl min-h-[80px]"
              maxLength={2000}
            />
          </div>

          {/* Category */}
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

          {/* Condition */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Состояние</label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, condition: c.value }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    form.condition === c.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Цена, ₽ *</label>
            <Input
              type="number"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              placeholder="5 000"
              className="rounded-xl"
              min={0}
            />
          </div>

          <Button type="submit" className="w-full rounded-xl" disabled={submitting || uploading}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Публикуем...
              </>
            ) : (
              "Опубликовать товар"
            )}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddShopItemModal;
