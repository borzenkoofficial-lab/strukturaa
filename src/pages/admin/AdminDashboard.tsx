import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Users, Image, Eye, Briefcase, CircleDot, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    articles: 0, users: 0, media: 0, published: 0,
    listings: 0, activeListings: 0, stories: 0,
  });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      const [articles, profiles, media, listings, stories] = await Promise.all([
        supabase.from("articles").select("id, published", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("media").select("id", { count: "exact" }),
        supabase.from("listings").select("id, status", { count: "exact" }),
        supabase.from("stories").select("id", { count: "exact" }),
      ]);

      const publishedCount = articles.data?.filter(a => a.published).length || 0;
      const activeListingsCount = listings.data?.filter(l => l.status === "active").length || 0;

      setStats({
        articles: articles.count || 0,
        users: profiles.count || 0,
        media: media.count || 0,
        published: publishedCount,
        listings: listings.count || 0,
        activeListings: activeListingsCount,
        stories: stories.count || 0,
      });
    };

    const fetchRecent = async () => {
      const [arts, lsts] = await Promise.all([
        supabase.from("articles").select("id, title, published, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("listings").select("id, title, status, category, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      setRecentArticles(arts.data || []);
      setRecentListings(lsts.data || []);
    };

    fetchAll();
    fetchRecent();
  }, []);

  const cards = [
    { icon: FileText, label: "Статьи", value: stats.articles, sub: `${stats.published} опубл.`, color: "text-primary", path: "/admin/articles" },
    { icon: Briefcase, label: "Заявки", value: stats.listings, sub: `${stats.activeListings} активных`, color: "text-green-400", path: "/admin/listings" },
    { icon: Users, label: "Пользователи", value: stats.users, sub: "зарегистрировано", color: "text-blue-400", path: "/admin/users" },
    { icon: CircleDot, label: "Истории", value: stats.stories, sub: "создано", color: "text-purple-400", path: "/admin/stories" },
    { icon: Image, label: "Медиа", value: stats.media, sub: "файлов", color: "text-accent", path: "/admin/media" },
  ];

  const CATEGORY_LABELS: Record<string, string> = {
    demolition: "Демонтаж", construction: "Строительство", renovation: "Ремонт",
    facades: "Фасады", roofing: "Кровля", electrical: "Электрика",
    plumbing: "Сантехника", other: "Другое",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Панель управления</h1>
          <p className="text-sm text-muted-foreground mt-1">Обзор всех разделов сайта</p>
        </div>
        <Button onClick={() => navigate("/admin/articles?new=1")}>+ Новая статья</Button>
      </div>

      {/* Stats tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="glass-card p-5 cursor-pointer hover:border-primary/30 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => navigate(card.path)}
          >
            <card.icon className={`w-7 h-7 ${card.color} mb-2`} />
            <div className="font-display text-2xl font-bold text-foreground">{card.value}</div>
            <div className="text-xs text-muted-foreground">{card.label}</div>
            <div className="text-[10px] text-muted-foreground/70 mt-0.5">{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Two column recent items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent articles */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Последние статьи
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/articles")}>
              Все →
            </Button>
          </div>
          {recentArticles.length === 0 ? (
            <p className="text-muted-foreground text-sm">Статей пока нет</p>
          ) : (
            <div className="space-y-2">
              {recentArticles.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">{a.title}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                  <Badge variant={a.published ? "default" : "secondary"} className="text-[10px] shrink-0">
                    {a.published ? "Опубл." : "Черновик"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent listings */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-green-400" />
              Последние заявки
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/listings")}>
              Все →
            </Button>
          </div>
          {recentListings.length === 0 ? (
            <p className="text-muted-foreground text-sm">Заявок пока нет</p>
          ) : (
            <div className="space-y-2">
              {recentListings.map((l) => (
                <div key={l.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">{l.title}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {CATEGORY_LABELS[l.category] || l.category} · {new Date(l.created_at).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] shrink-0 ${l.status === "active" ? "bg-green-500/20 text-green-400" : ""}`}
                  >
                    {l.status === "active" ? "Активна" : "Закрыта"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass-card p-5">
        <h2 className="font-display text-base font-semibold text-foreground mb-3">Быстрые действия</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Новая статья", path: "/admin/articles?new=1", icon: FileText },
            { label: "Добавить историю", path: "/admin/stories", icon: CircleDot },
            { label: "Загрузить медиа", path: "/admin/media", icon: Image },
            { label: "Настройки", path: "/admin/settings", icon: TrendingUp },
          ].map(action => (
            <Button
              key={action.label}
              variant="outline"
              className="justify-start gap-2 h-auto py-3"
              onClick={() => navigate(action.path)}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
