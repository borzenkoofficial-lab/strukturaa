import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, LogOut, Edit3, Camera, ArrowLeft, Shield, FileText, Heart, Megaphone, Bookmark, Wrench, Newspaper, Trash2, HardHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";

const serviceNames: Record<string, string> = {
  demolition: "Демонтаж",
  exclusive: "Алмазная резка",
  renovation: "Ремонт",
  "best-deals": "Лучшие предложения",
};

const DashboardPage = () => {
  const { user, profile, isAdmin, signOut, updateProfile, refreshProfile } = useAuth();
  const { favoritesList, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "favorites">("profile");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) {
    navigate("/auth");
    return null;
  }

  const initials = (profile?.display_name || user.email || "U").slice(0, 2).toUpperCase();

  const serviceFavs = favoritesList.filter(f => f.item_type === "service");
  const articleFavs = favoritesList.filter(f => f.item_type === "article");

  const handleSave = async () => {
    const { error } = await updateProfile({ display_name: displayName, bio });
    if (error) {
      toast({ title: "Ошибка", description: String(error), variant: "destructive" });
    } else {
      toast({ title: "Профиль обновлён!" });
      setEditing(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Ошибка загрузки", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await updateProfile({ avatar_url: publicUrl });
    await refreshProfile();
    setUploading(false);
    toast({ title: "Аватар обновлён!" });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleRemoveFav = (itemId: string, itemType: string) => {
    toggleFavorite(itemId, itemType);
    toast({ title: "Удалено из избранного" });
  };

  return (
    <>
    <SEOHead title="Личный кабинет" description="Управляйте профилем, избранным и заказами в личном кабинете STRUKTURA." canonical="/dashboard" noindex />
    <div className="min-h-screen bg-background gradient-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> На главную
          </button>
          <div className="flex gap-2">
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin")}>
                <Shield className="w-4 h-4 mr-2" /> Админ
              </Button>
            )}
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Выйти
            </Button>
          </div>
        </div>

        {/* Profile card */}
        <motion.div className="glass-card p-8 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-display">{initials}</AvatarFallback>
              </Avatar>
              <button onClick={() => fileRef.current?.click()} className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" disabled={uploading}>
                <Camera className="w-6 h-6 text-foreground" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-display text-2xl font-bold text-foreground">
                Добро пожаловать, {profile?.display_name || "Пользователь"}!
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 justify-center sm:justify-start mt-1">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              {profile?.bio && !editing && <p className="text-secondary-foreground mt-2 text-sm">{profile.bio}</p>}
            </div>
            <Button variant="outline" size="sm" onClick={() => { setEditing(!editing); setDisplayName(profile?.display_name || ""); setBio(profile?.bio || ""); }}>
              <Edit3 className="w-4 h-4 mr-2" /> {editing ? "Отмена" : "Редактировать"}
            </Button>
          </div>

          {editing && (
            <motion.div className="mt-6 space-y-4 border-t border-border/30 pt-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Имя</label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">О себе</label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
              </div>
              <Button onClick={handleSave}>Сохранить</Button>
            </motion.div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "profile" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            <User className="w-4 h-4 inline mr-2" /> Профиль
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "favorites" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            <Heart className="w-4 h-4 inline mr-2" /> Избранное ({favoritesList.length})
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: FileText, label: "Статьи", value: String(articleFavs.length) },
              { icon: Heart, label: "Избранное", value: String(favoritesList.length) },
              { icon: Shield, label: "Роль", value: isAdmin ? "Админ" : "Пользователь" },
              { icon: Megaphone, label: "Биржа", value: "→", onClick: () => navigate("/marketplace") },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className={`glass-card p-6 text-center ${stat.onClick ? "cursor-pointer hover:border-primary/30" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                onClick={stat.onClick}
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="space-y-4">
            {/* Services */}
            {serviceFavs.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-primary" /> Услуги
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceFavs.map((fav) => (
                    <motion.div
                      key={fav.item_id}
                      className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => navigate(`/services/${fav.item_id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                          <Wrench className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{serviceNames[fav.item_id] || fav.item_id}</p>
                          <p className="text-xs text-muted-foreground">{new Date(fav.created_at).toLocaleDateString("ru-RU")}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveFav(fav.item_id, "service"); }}
                        className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Articles */}
            {articleFavs.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-primary" /> Статьи
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {articleFavs.map((fav) => (
                    <motion.div
                      key={fav.item_id}
                      className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => navigate("/blog")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                          <Bookmark className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Статья</p>
                          <p className="text-xs text-muted-foreground">{new Date(fav.created_at).toLocaleDateString("ru-RU")}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveFav(fav.item_id, "article"); }}
                        className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {favoritesList.length === 0 && (
              <div className="glass-card p-12 text-center">
                <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">У вас пока нет избранных элементов</p>
                <p className="text-xs text-muted-foreground mt-1">Нажмите ❤️ на услугах или 🔖 на статьях</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default DashboardPage;
