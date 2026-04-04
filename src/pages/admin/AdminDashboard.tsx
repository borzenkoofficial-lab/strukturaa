import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText, Users, Image, Briefcase, CircleDot, ShoppingBag,
  TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, MessageSquare, ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const CATEGORY_LABELS: Record<string, string> = {
  demolition: "Демонтаж", construction: "Строительство", renovation: "Ремонт",
  facades: "Фасады", roofing: "Кровля", electrical: "Электрика",
  plumbing: "Сантехника", other: "Другое",
};

const PIE_COLORS = [
  "hsl(var(--primary))", "hsl(142,71%,45%)", "hsl(217,91%,60%)",
  "hsl(262,83%,58%)", "hsl(38,92%,50%)", "hsl(0,84%,60%)",
  "hsl(180,70%,45%)", "hsl(300,60%,50%)",
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    articles: 0, published: 0, users: 0, media: 0,
    listings: 0, activeListings: 0, stories: 0,
    shopItems: 0, activeShop: 0, requests: 0,
    messages: 0, totalRevenue: 0,
  });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [articles, profiles, media, listings, stories, shopItems, requests, messages, transactions] =
        await Promise.all([
          supabase.from("articles").select("id, published, created_at", { count: "exact" }),
          supabase.from("profiles").select("id, created_at", { count: "exact" }),
          supabase.from("media").select("id", { count: "exact" }),
          supabase.from("listings").select("id, status, category, created_at", { count: "exact" }),
          supabase.from("stories").select("id", { count: "exact" }),
          supabase.from("shop_items").select("id, status", { count: "exact" }),
          supabase.from("contact_requests").select("id, created_at", { count: "exact" }),
          supabase.from("messages").select("id", { count: "exact" }),
          supabase.from("wallet_transactions").select("amount, type"),
        ]);

      const publishedCount = articles.data?.filter(a => a.published).length || 0;
      const activeListingsCount = listings.data?.filter(l => l.status === "active").length || 0;
      const activeShopCount = (shopItems.data as any[])?.filter(s => s.status === "active").length || 0;
      const revenue = (transactions.data || [])
        .filter((t: any) => t.type === "payment")
        .reduce((sum: number, t: any) => sum + Math.abs(Number(t.amount)), 0);

      setStats({
        articles: articles.count || 0, published: publishedCount,
        users: profiles.count || 0, media: media.count || 0,
        listings: listings.count || 0, activeListings: activeListingsCount,
        stories: stories.count || 0,
        shopItems: (shopItems.count as number) || 0, activeShop: activeShopCount,
        requests: requests.count || 0,
        messages: messages.count || 0, totalRevenue: revenue,
      });

      // Category distribution
      const catMap: Record<string, number> = {};
      (listings.data || []).forEach((l: any) => {
        catMap[l.category] = (catMap[l.category] || 0) + 1;
      });
      setCategoryData(Object.entries(catMap).map(([name, value]) => ({
        name: CATEGORY_LABELS[name] || name, value,
      })));

      // Weekly activity (last 7 days)
      const days: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        days.push(d.toISOString().split("T")[0]);
      }
      const weekly = days.map(day => {
        const dayLabel = new Date(day).toLocaleDateString("ru-RU", { weekday: "short", day: "numeric" });
        const usersCount = (profiles.data || []).filter((p: any) => p.created_at?.startsWith(day)).length;
        const listingsCount = (listings.data || []).filter((l: any) => l.created_at?.startsWith(day)).length;
        const requestsCount = (requests.data || []).filter((r: any) => r.created_at?.startsWith(day)).length;
        return { name: dayLabel, users: usersCount, listings: listingsCount, requests: requestsCount };
      });
      setWeeklyData(weekly);
    };

    const fetchRecent = async () => {
      const [arts, lsts, reqs] = await Promise.all([
        supabase.from("articles").select("id, title, published, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("listings").select("id, title, status, category, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("contact_requests").select("id, name, phone, service, source, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      setRecentArticles(arts.data || []);
      setRecentListings(lsts.data || []);
      setRecentRequests(reqs.data || []);
    };

    fetchAll();
    fetchRecent();
  }, []);

  const mainCards = [
    { icon: Users, label: "Пользователи", value: stats.users, sub: "зарегистрировано", color: "text-blue-400", path: "/admin/users" },
    { icon: FileText, label: "Статьи", value: stats.articles, sub: `${stats.published} опубл.`, color: "text-primary", path: "/admin/articles" },
    { icon: Briefcase, label: "Заявки биржи", value: stats.listings, sub: `${stats.activeListings} активных`, color: "text-green-400", path: "/admin/listings" },
    { icon: ShoppingBag, label: "Маркетплейс", value: stats.shopItems, sub: `${stats.activeShop} активных`, color: "text-purple-400", path: "/admin/shop" },
    { icon: ClipboardList, label: "Лиды", value: stats.requests, sub: "с сайта", color: "text-orange-400", path: "/admin/requests" },
    { icon: Wallet, label: "Доход", value: `${stats.totalRevenue.toLocaleString()} ₽`, sub: "с откликов", color: "text-emerald-400", path: "/admin/users" },
    { icon: CircleDot, label: "Истории", value: stats.stories, sub: "создано", color: "text-pink-400", path: "/admin/stories" },
    { icon: Image, label: "Медиа", value: stats.media, sub: "файлов", color: "text-cyan-400", path: "/admin/media" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Панель управления</h1>
        <p className="text-sm text-muted-foreground mt-1">Обзор платформы и ключевые метрики</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {mainCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="bg-card border border-border/30 rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-all hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => navigate(card.path)}
          >
            <div className="flex items-center justify-between mb-2">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            </div>
            <div className="font-display text-xl font-bold text-foreground">{card.value}</div>
            <div className="text-[11px] text-muted-foreground">{card.label}</div>
            <div className="text-[10px] text-muted-foreground/60">{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly activity */}
        <div className="lg:col-span-2 bg-card border border-border/30 rounded-xl p-5">
          <h2 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Активность за неделю
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217,91%,60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217,91%,60%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142,71%,45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142,71%,45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="users" name="Пользователи" stroke="hsl(217,91%,60%)" fill="url(#colorUsers)" strokeWidth={2} />
                <Area type="monotone" dataKey="listings" name="Заявки" stroke="hsl(142,71%,45%)" fill="url(#colorListings)" strokeWidth={2} />
                <Area type="monotone" dataKey="requests" name="Лиды" stroke="hsl(38,92%,50%)" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category pie */}
        <div className="bg-card border border-border/30 rounded-xl p-5">
          <h2 className="font-display text-sm font-semibold text-foreground mb-4">
            Категории заявок
          </h2>
          {categoryData.length > 0 ? (
            <div className="h-56 flex flex-col items-center">
              <ResponsiveContainer width="100%" height="70%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center">
                {categoryData.slice(0, 4).map((c, i) => (
                  <div key={c.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    {c.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">
              Нет данных
            </div>
          )}
        </div>
      </div>

      {/* Three column recent items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent articles */}
        <div className="bg-card border border-border/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Последние статьи
            </h2>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/admin/articles")}>
              Все →
            </Button>
          </div>
          {recentArticles.length === 0 ? (
            <p className="text-muted-foreground text-sm">Нет статей</p>
          ) : (
            <div className="space-y-2.5">
              {recentArticles.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-1.5 border-b border-border/10 last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">{a.title}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                  <Badge variant={a.published ? "default" : "secondary"} className="text-[9px] shrink-0 ml-2">
                    {a.published ? "Опубл." : "Черновик"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent listings */}
        <div className="bg-card border border-border/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-green-400" />
              Последние заявки
            </h2>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/admin/listings")}>
              Все →
            </Button>
          </div>
          {recentListings.length === 0 ? (
            <p className="text-muted-foreground text-sm">Нет заявок</p>
          ) : (
            <div className="space-y-2.5">
              {recentListings.map((l) => (
                <div key={l.id} className="flex items-center justify-between py-1.5 border-b border-border/10 last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">{l.title}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {CATEGORY_LABELS[l.category] || l.category} · {new Date(l.created_at).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-[9px] shrink-0 ml-2 ${l.status === "active" ? "bg-green-500/20 text-green-400" : ""}`}
                  >
                    {l.status === "active" ? "Активна" : "Закрыта"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent leads */}
        <div className="bg-card border border-border/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-orange-400" />
              Последние заявки с сайта
            </h2>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/admin/requests")}>
              Все →
            </Button>
          </div>
          {recentRequests.length === 0 ? (
            <p className="text-muted-foreground text-sm">Нет заявок</p>
          ) : (
            <div className="space-y-2.5">
              {recentRequests.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-1.5 border-b border-border/10 last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">{r.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {r.phone} · {r.service || r.source}
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground shrink-0 ml-2">
                    {new Date(r.created_at).toLocaleDateString("ru-RU")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-card border border-border/30 rounded-xl p-5">
        <h2 className="font-display text-sm font-semibold text-foreground mb-3">Быстрые действия</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {[
            { label: "Новая статья", path: "/admin/articles?new=1", icon: FileText },
            { label: "Добавить историю", path: "/admin/stories", icon: CircleDot },
            { label: "Загрузить медиа", path: "/admin/media", icon: Image },
            { label: "Управление заявками", path: "/admin/listings", icon: Briefcase },
            { label: "Товары", path: "/admin/shop", icon: ShoppingBag },
            { label: "Настройки", path: "/admin/settings", icon: TrendingUp },
          ].map(action => (
            <Button
              key={action.label}
              variant="outline"
              className="justify-start gap-2 h-auto py-3 text-xs"
              onClick={() => navigate(action.path)}
            >
              <action.icon className="w-4 h-4 shrink-0" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
