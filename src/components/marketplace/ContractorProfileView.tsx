import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  X, MapPin, Phone, Globe, Building2, CheckCircle, Star,
  Briefcase, Calendar, ChevronLeft, ChevronRight, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const specLabels: Record<string, string> = {
  demolition: "Демонтаж", construction: "Строительство", renovation: "Ремонт",
  facades: "Фасады", roofing: "Кровля", electrical: "Электрика",
  plumbing: "Сантехника", earthwork: "Земляные работы", landscaping: "Благоустройство",
  painting: "Малярные работы", hvac: "Вентиляция", mounting: "Монтаж", logistics: "Вывоз мусора",
};

const companyTypeLabels: Record<string, string> = {
  individual: "Частный мастер", ip: "ИП", ooo: "ООО",
};

interface ContractorProfile {
  id: string;
  user_id: string;
  company_name: string | null;
  company_type: string | null;
  inn: string | null;
  description: string | null;
  specializations: string[] | null;
  experience_years: number | null;
  city: string | null;
  phone: string | null;
  website: string | null;
  avatar_url: string | null;
  portfolio_photos: string[] | null;
  completed_projects: number | null;
  verified: boolean | null;
  published: boolean | null;
}

interface Props {
  userId: string;
  onClose: () => void;
  onChat?: (userId: string) => void;
}

const ContractorProfileView = ({ userId, onClose, onChat }: Props) => {
  const [profile, setProfile] = useState<ContractorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [galleryIdx, setGalleryIdx] = useState<number | null>(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("contractor_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    setProfile(data as ContractorProfile | null);
    setLoading(false);
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-primary animate-pulse" />
      </motion.div>
    );
  }

  if (!profile) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Профиль не найден</p>
          <Button onClick={onClose} variant="outline" className="rounded-xl">Закрыть</Button>
        </div>
      </motion.div>
    );
  }

  const photos = profile.portfolio_photos || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl overflow-y-auto"
    >
      {/* Gallery Lightbox */}
      <AnimatePresence>
        {galleryIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center"
            onClick={() => setGalleryIdx(null)}
          >
            <motion.button onClick={() => setGalleryIdx(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </motion.button>
            {galleryIdx > 0 && (
              <motion.button whileTap={{ scale: 0.9 }}
                onClick={e => { e.stopPropagation(); setGalleryIdx(galleryIdx - 1); }}
                className="absolute left-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-white" />
              </motion.button>
            )}
            {galleryIdx < photos.length - 1 && (
              <motion.button whileTap={{ scale: 0.9 }}
                onClick={e => { e.stopPropagation(); setGalleryIdx(galleryIdx + 1); }}
                className="absolute right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.button>
            )}
            <motion.img
              key={galleryIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={photos[galleryIdx]}
              alt=""
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {galleryIdx + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <motion.button onClick={onClose} whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center">
            <X className="w-5 h-5 text-muted-foreground" />
          </motion.button>
          <h2 className="font-display font-bold text-lg text-foreground">Профиль исполнителя</h2>
        </div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border/30 p-6 sm:p-8 mb-6 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

          <div className="flex flex-col sm:flex-row items-start gap-5 relative">
            {/* Avatar */}
            <div className="relative shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-24 h-24 rounded-2xl object-cover shadow-lg" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center shadow-lg">
                  <Building2 className="w-10 h-10 text-primary" />
                </div>
              )}
              {profile.verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <CheckCircle className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-display font-bold text-xl text-foreground">
                  {profile.company_name || "Исполнитель"}
                </h3>
                {profile.verified && (
                  <Badge className="bg-primary/15 text-primary text-[10px]">Проверен</Badge>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
                {profile.company_type && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {companyTypeLabels[profile.company_type] || profile.company_type}
                  </span>
                )}
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {profile.city}
                  </span>
                )}
                {(profile.experience_years ?? 0) > 0 && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {profile.experience_years} лет опыта
                  </span>
                )}
              </div>

              {profile.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.description}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: "Опыт", value: `${profile.experience_years || 0} лет`, icon: Briefcase },
              { label: "Проекты", value: `${profile.completed_projects || 0}`, icon: Star },
              { label: "Фото работ", value: `${photos.length}`, icon: Calendar },
            ].map((s, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-background/50 border border-border/20">
                <s.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="font-bold text-foreground text-sm">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card border border-border/30 p-5 mb-4"
        >
          <h4 className="font-display font-semibold text-sm text-foreground mb-3">Контакты</h4>
          <div className="space-y-2">
            {profile.phone && (
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-foreground">{profile.phone}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-2.5 text-sm">
                <Globe className="w-4 h-4 text-primary" />
                <a href={profile.website} target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline">{profile.website}</a>
              </div>
            )}
            {profile.inn && (
              <div className="flex items-center gap-2.5 text-sm">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">ИНН: {profile.inn}</span>
              </div>
            )}
          </div>

          {onChat && (
            <Button onClick={() => onChat(profile.user_id)} className="w-full mt-4 rounded-xl gap-2">
              <MessageCircle className="w-4 h-4" />
              Написать сообщение
            </Button>
          )}
        </motion.div>

        {/* Specializations */}
        {profile.specializations && profile.specializations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-card border border-border/30 p-5 mb-4"
          >
            <h4 className="font-display font-semibold text-sm text-foreground mb-3">Специализация</h4>
            <div className="flex flex-wrap gap-2">
              {profile.specializations.map(s => (
                <Badge key={s} variant="secondary" className="rounded-lg px-3 py-1.5 text-xs">
                  {specLabels[s] || s}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Portfolio Gallery */}
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card border border-border/30 p-5"
          >
            <h4 className="font-display font-semibold text-sm text-foreground mb-3">
              Портфолио работ ({photos.length})
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {photos.map((url, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setGalleryIdx(i)}
                  className="aspect-square rounded-xl overflow-hidden cursor-pointer"
                >
                  <img src={url} alt="" className="w-full h-full object-cover hover:brightness-110 transition-all" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ContractorProfileView;
