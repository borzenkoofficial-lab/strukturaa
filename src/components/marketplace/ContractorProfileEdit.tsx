import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  X, Save, Upload, Plus, Trash2, Building2, User, Briefcase,
  MapPin, Phone, Globe, Camera, CheckCircle, ArrowLeft, ArrowRight,
  HardHat, Zap, Droplets, Hammer, Building, Wrench, Truck, Shovel,
  Mountain, PaintBucket, Wind, Landmark
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SPECIALIZATIONS = [
  { value: "demolition", label: "Демонтаж", icon: HardHat },
  { value: "construction", label: "Строительство", icon: Building2 },
  { value: "renovation", label: "Ремонт", icon: Hammer },
  { value: "facades", label: "Фасады", icon: Building },
  { value: "roofing", label: "Кровля", icon: Landmark },
  { value: "electrical", label: "Электрика", icon: Zap },
  { value: "plumbing", label: "Сантехника", icon: Droplets },
  { value: "earthwork", label: "Земляные работы", icon: Shovel },
  { value: "landscaping", label: "Благоустройство", icon: Mountain },
  { value: "painting", label: "Малярные работы", icon: PaintBucket },
  { value: "hvac", label: "Вентиляция", icon: Wind },
  { value: "mounting", label: "Монтаж", icon: Wrench },
  { value: "logistics", label: "Вывоз мусора", icon: Truck },
];

const COMPANY_TYPES = [
  { value: "individual", label: "Физлицо", desc: "Самозанятый / частный мастер" },
  { value: "ip", label: "ИП", desc: "Индивидуальный предприниматель" },
  { value: "ooo", label: "ООО", desc: "Общество с ограниченной ответственностью" },
];

interface Props {
  onClose: () => void;
  onSaved?: () => void;
}

const ContractorProfileEdit = ({ onClose, onSaved }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const [form, setForm] = useState({
    company_name: "",
    company_type: "individual",
    inn: "",
    description: "",
    specializations: [] as string[],
    experience_years: 0,
    city: "",
    phone: "",
    website: "",
    avatar_url: "",
    portfolio_photos: [] as string[],
    published: false,
  });

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contractor_profiles")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();
    if (data) {
      setForm({
        company_name: data.company_name || "",
        company_type: data.company_type || "individual",
        inn: data.inn || "",
        description: data.description || "",
        specializations: (data.specializations as string[]) || [],
        experience_years: data.experience_years || 0,
        city: data.city || "",
        phone: data.phone || "",
        website: data.website || "",
        avatar_url: data.avatar_url || "",
        portfolio_photos: (data.portfolio_photos as string[]) || [],
        published: data.published || false,
      });
    }
    setLoading(false);
  };

  const toggleSpec = (val: string) => {
    setForm(prev => ({
      ...prev,
      specializations: prev.specializations.includes(val)
        ? prev.specializations.filter(s => s !== val)
        : [...prev.specializations, val],
    }));
  };

  const uploadFile = async (file: File, path: string) => {
    const ext = file.name.split(".").pop();
    const filePath = `${path}/${user!.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from("media").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const url = await uploadFile(file, "contractor-avatars");
      setForm(prev => ({ ...prev, avatar_url: url }));
    } catch {
      toast({ title: "Ошибка загрузки", variant: "destructive" });
    }
    setUploadingAvatar(false);
  };

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploadingPhotos(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, "contractor-portfolio");
        urls.push(url);
      }
      setForm(prev => ({ ...prev, portfolio_photos: [...prev.portfolio_photos, ...urls] }));
    } catch {
      toast({ title: "Ошибка загрузки", variant: "destructive" });
    }
    setUploadingPhotos(false);
  };

  const removePhoto = (idx: number) => {
    setForm(prev => ({
      ...prev,
      portfolio_photos: prev.portfolio_photos.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const payload = { ...form, user_id: user.id };
      const { data: existing } = await supabase
        .from("contractor_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("contractor_profiles").update(payload).eq("user_id", user.id);
      } else {
        await supabase.from("contractor_profiles").insert(payload);
      }
      toast({ title: "Профиль сохранён!" });
      onSaved?.();
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
    setSaving(false);
  };

  const steps = [
    { title: "Тип деятельности", icon: Building2 },
    { title: "О вас", icon: User },
    { title: "Специализация", icon: Briefcase },
    { title: "Портфолио", icon: Camera },
  ];

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-primary animate-pulse" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl overflow-y-auto"
    >
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.button onClick={onClose} whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center">
              <X className="w-5 h-5 text-muted-foreground" />
            </motion.button>
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">Профиль исполнителя</h2>
              <p className="text-xs text-muted-foreground">Шаг {step + 1} из {steps.length}</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} size="sm" className="rounded-xl gap-2">
            <Save className="w-4 h-4" />
            {saving ? "..." : "Сохранить"}
          </Button>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button key={i} onClick={() => setStep(i)}
                className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-xs font-medium ${
                  i === step
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : i < step
                      ? "bg-primary/5 border-primary/10 text-primary/60"
                      : "bg-card border-border/30 text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline truncate">{s.title}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">Форма деятельности</label>
                  <div className="grid gap-3">
                    {COMPANY_TYPES.map(ct => (
                      <motion.button key={ct.value} whileTap={{ scale: 0.98 }}
                        onClick={() => setForm(p => ({ ...p, company_type: ct.value }))}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                          form.company_type === ct.value
                            ? "bg-primary/10 border-primary/30 shadow-md shadow-primary/10"
                            : "bg-card border-border/30 hover:border-primary/20"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          form.company_type === ct.value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        }`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-foreground">{ct.label}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">{ct.desc}</p>
                        </div>
                        {form.company_type === ct.value && <CheckCircle className="w-5 h-5 text-primary ml-auto shrink-0" />}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Название компании / ФИО</label>
                    <Input value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))}
                      placeholder="ИП Иванов И.И." className="rounded-xl h-11" />
                  </div>
                  {form.company_type !== "individual" && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">ИНН</label>
                      <Input value={form.inn} onChange={e => setForm(p => ({ ...p, inn: e.target.value }))}
                        placeholder="1234567890" className="rounded-xl h-11" maxLength={12} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {form.avatar_url ? (
                      <img src={form.avatar_url} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg">
                      <Camera className="w-4 h-4 text-primary-foreground" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Фото профиля</p>
                    <p className="text-xs text-muted-foreground">
                      {uploadingAvatar ? "Загрузка..." : "JPG, PNG до 5МБ"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">О себе / компании</label>
                  <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Расскажите о вашем опыте, подходе к работе, преимуществах..."
                    className="rounded-xl min-h-[120px] resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Опыт (лет)</label>
                    <Input type="number" value={form.experience_years || ""} min={0} max={50}
                      onChange={e => setForm(p => ({ ...p, experience_years: parseInt(e.target.value) || 0 }))}
                      className="rounded-xl h-11" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Выполнено проектов</label>
                    <Input type="number" value={form.experience_years > 0 ? undefined : ""} disabled
                      placeholder="Автоматически" className="rounded-xl h-11" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Город
                    </label>
                    <Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                      placeholder="Москва" className="rounded-xl h-11" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Телефон
                    </label>
                    <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+7 999 123-45-67" className="rounded-xl h-11" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Сайт
                  </label>
                  <Input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
                    placeholder="https://example.com" className="rounded-xl h-11" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">Выберите специализации</label>
                <p className="text-xs text-muted-foreground mb-4">Отметьте виды работ, которые вы выполняете</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SPECIALIZATIONS.map(s => {
                    const Icon = s.icon;
                    const active = form.specializations.includes(s.value);
                    return (
                      <motion.button key={s.value} whileTap={{ scale: 0.95 }}
                        onClick={() => toggleSpec(s.value)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                          active
                            ? "bg-primary/10 border-primary/30 shadow-sm"
                            : "bg-card border-border/30 hover:border-primary/20"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                          {s.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">Портфолио работ</label>
                  <p className="text-xs text-muted-foreground mb-4">Добавьте фото выполненных проектов</p>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {form.portfolio_photos.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3 text-destructive-foreground" />
                        </motion.button>
                      </div>
                    ))}

                    <label className="aspect-square rounded-xl border-2 border-dashed border-border/50 hover:border-primary/40 flex flex-col items-center justify-center cursor-pointer transition-colors">
                      {uploadingPhotos ? (
                        <div className="w-6 h-6 rounded-md bg-primary animate-pulse" />
                      ) : (
                        <>
                          <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                          <span className="text-[10px] text-muted-foreground">Добавить</span>
                        </>
                      )}
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosUpload} />
                    </label>
                  </div>
                </div>

                {/* Publish toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/30">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Опубликовать профиль</p>
                    <p className="text-xs text-muted-foreground">Ваш профиль будет виден заказчикам</p>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }}
                    onClick={() => setForm(p => ({ ...p, published: !p.published }))}
                    className={`w-12 h-7 rounded-full p-0.5 transition-colors ${form.published ? "bg-primary" : "bg-secondary"}`}
                  >
                    <motion.div animate={{ x: form.published ? 20 : 0 }}
                      className="w-6 h-6 rounded-full bg-white shadow-sm" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-4 border-t border-border/20">
          <Button variant="outline" onClick={() => step > 0 ? setStep(step - 1) : onClose}
            className="rounded-xl gap-2">
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? "Закрыть" : "Назад"}
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="rounded-xl gap-2">
              Далее <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={saving} className="rounded-xl gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Сохранение..." : "Сохранить и опубликовать"}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ContractorProfileEdit;
