import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Plus, ArrowLeft, Home, User, Wrench, Tag, Package, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import ShopItemDetail from "@/components/shop/ShopItemDetail";
import ShopIntro from "@/components/shop/ShopIntro";

const SHOP_CATEGORIES = [
  { value: "all", label: "Все" },
  { value: "power_tools", label: "Электроинструмент" },
  { value: "hand_tools", label: "Ручной инструмент" },
  { value: "measurement", label: "Измерительные" },
  { value: "safety", label: "Защита и СИЗ" },
  { value: "consumables", label: "Расходники" },
  { value: "other", label: "Другое" },
];

const CONDITION_LABELS: Record<string, string> = {
  new: "Новый",
  like_new: "Как новый",
  used_good: "Б/У хорошее",
  used_fair: "Б/У среднее",
};

const CONDITION_COLORS: Record<string, string> = {
  new: "bg-primary/15 text-primary",
  like_new: "bg-accent/15 text-accent",
  used_good: "bg-secondary text-secondary-foreground",
  used_fair: "bg-destructive/15 text-destructive",
};

export interface ShopItem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  photos: string[];
  status: string;
  created_at: string;
}

const ShopPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    let query = (supabase.from as any)("shop_items").select("*").eq("status", "active").order("created_at", { ascending: false });
    if (category !== "all") query = query.eq("category", category);
    if (search) query = query.ilike("title", `%${search}%`);
    const { data } = await query;
    setItems((data as ShopItem[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [category, search]);

  const filteredItems = activeTab === "my"
    ? items.filter(i => i.user_id === user?.id)
    : items;

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "только что";
    if (hours < 24) return `${hours}ч назад`;
    const days = Math.floor(hours / 24);
    return `${days}д назад`;
  };

  return (
    <>
      <SEOHead title="Магазин инструментов — STRUKTURA" description="Б/У и новый строительный инструмент. Покупайте и продавайте электроинструмент, ручной инструмент и расходники." canonical="/shop" />

      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/30">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => navigate("/")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
              </motion.button>
              <div>
                <h1 className="font-display font-bold text-lg text-foreground leading-tight">Магазин</h1>
                <p className="text-[10px] text-muted-foreground">Б/У и новый инструмент</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user && (
                <motion.button
                  onClick={() => navigate("/dashboard")}
                  whileHover={{ scale: 1.05 }}
                  className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
                >
                  <User className="w-4 h-4 text-secondary-foreground" />
                </motion.button>
              )}
              <motion.button
                onClick={() => navigate("/")}
                whileHover={{ scale: 1.05 }}
                className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
              >
                <Home className="w-4 h-4 text-secondary-foreground" />
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-6xl mx-auto px-4 flex gap-1 pb-2 overflow-x-auto scrollbar-hide">
            {[
              { key: "all" as const, label: "Все товары", icon: Package },
              { key: "my" as const, label: "Мои", icon: User },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Search & filters */}
        <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск инструментов..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-card border-border/50 rounded-xl"
              />
            </div>
            {!user && (
              <Button onClick={() => navigate("/auth")} variant="outline" className="rounded-xl gap-2 shrink-0">
                <User className="w-4 h-4" />
                Войти
              </Button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SHOP_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat.value
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-card text-muted-foreground hover:bg-secondary border border-border/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items grid */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="h-56 rounded-2xl bg-card animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Wrench className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {activeTab === "my" ? "У вас пока нет товаров" : "Товаров не найдено"}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {activeTab === "my" ? "Разместите инструмент на продажу" : "Попробуйте изменить фильтры"}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  {/* Photo placeholder */}
                  <div className="aspect-square bg-secondary/50 flex items-center justify-center">
                    {item.photos && item.photos.length > 0 ? (
                      <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <Wrench className="w-8 h-8 text-muted-foreground/30" />
                    )}
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <Badge variant="secondary" className={`text-[10px] font-semibold ${CONDITION_COLORS[item.condition] || ""}`}>
                        {CONDITION_LABELS[item.condition] || item.condition}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{timeAgo(item.created_at)}</span>
                    </div>

                    <h3 className="font-display font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-base font-bold text-primary">
                      {item.price.toLocaleString()} ₽
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        {/* Detail modal */}
        <AnimatePresence>
          {selectedItem && (
            <ShopItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ShopPage;
