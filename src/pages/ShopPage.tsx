import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search, Plus, ArrowLeft, Home, User, Wrench, Package, Heart,
  Zap, Shield, Ruler, HardHat, CircleDot, LayoutGrid, List,
  SlidersHorizontal, X, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import ShopItemDetail from "@/components/shop/ShopItemDetail";
import ShopIntro from "@/components/shop/ShopIntro";
import AddShopItemModal from "@/components/shop/AddShopItemModal";

const SHOP_CATEGORIES = [
  { value: "all", label: "Все", icon: Sparkles },
  { value: "power_tools", label: "Электро", icon: Zap },
  { value: "hand_tools", label: "Ручной", icon: Wrench },
  { value: "measurement", label: "Измерение", icon: Ruler },
  { value: "safety", label: "Защита", icon: Shield },
  { value: "consumables", label: "Расходники", icon: CircleDot },
  { value: "other", label: "Другое", icon: Package },
];

const CONDITION_LABELS: Record<string, string> = {
  new: "Новый",
  like_new: "Как новый",
  used_good: "Б/У хорошее",
  used_fair: "Б/У среднее",
};

const CONDITION_COLORS: Record<string, string> = {
  new: "bg-primary/15 text-primary border-primary/20",
  like_new: "bg-accent/15 text-accent-foreground border-accent/20",
  used_good: "bg-secondary text-secondary-foreground border-border/50",
  used_fair: "bg-destructive/15 text-destructive border-destructive/20",
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
  const [introComplete, setIntroComplete] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    let query = supabase.from("shop_items").select("*").eq("status", "active").order("created_at", { ascending: false });
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

  const categoryCount = (val: string) => {
    if (val === "all") return items.length;
    return items.filter(i => i.category === val).length;
  };

  return (
    <>
      <SEOHead title="Магазин инструментов — STRUKTURA" description="Б/У и новый строительный инструмент. Покупайте и продавайте электроинструмент, ручной инструмент и расходники." canonical="/shop" />

      <AnimatePresence>
        {!introComplete && <ShopIntro onComplete={() => setIntroComplete(true)} />}
      </AnimatePresence>

      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {/* ── Premium Header ── */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/20">
          {/* Brand bar */}
          <div className="max-w-7xl mx-auto px-4 pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => navigate("/")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-2xl bg-card border border-border/50 flex items-center justify-center hover:border-primary/30 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </motion.button>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="font-display font-bold text-base text-primary-foreground">S</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h1 className="font-display font-bold text-base text-foreground tracking-tight">STRUKTURA</h1>
                      <span className="text-muted-foreground/50 font-light">|</span>
                      <span className="font-display font-medium text-sm text-primary">Маркетплейс</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">Строительный инструмент и оборудование</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {user && (
                  <motion.button
                    onClick={() => navigate("/dashboard")}
                    whileHover={{ scale: 1.05 }}
                    className="w-10 h-10 rounded-2xl bg-card border border-border/50 flex items-center justify-center hover:border-primary/30 transition-colors"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                )}
                <motion.button
                  onClick={() => navigate("/")}
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 rounded-2xl bg-card border border-border/50 flex items-center justify-center hover:border-primary/30 transition-colors"
                >
                  <Home className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="max-w-7xl mx-auto px-4 pb-3">
            <div className="flex items-center gap-2">
              {[
                { key: "all" as const, label: "Все товары", icon: Package },
                { key: "my" as const, label: "Мои товары", icon: User },
              ].map(tab => (
                <motion.button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.key
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/20"
                  }`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                  {tab.key === "my" && user && activeTab !== "my" && items.filter(i => i.user_id === user.id).length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center">
                      {items.filter(i => i.user_id === user.id).length}
                    </span>
                  )}
                </motion.button>
              ))}

              <div className="flex-1" />

              {user && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={() => setShowAddModal(true)} className="rounded-2xl gap-2 shadow-lg shadow-primary/20 px-5">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Продать</span>
                  </Button>
                </motion.div>
              )}
              {!user && (
                <Button onClick={() => navigate("/auth")} variant="outline" className="rounded-2xl gap-2">
                  <User className="w-4 h-4" />
                  Войти
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* ── Search & Category Section ── */}
        <div className="max-w-7xl mx-auto px-4 pt-5 pb-2 space-y-4">
          {/* Search bar */}
          <motion.div
            className={`relative rounded-2xl transition-all duration-300 ${
              searchFocused ? "ring-2 ring-primary/30 shadow-lg shadow-primary/10" : ""
            }`}
          >
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
              searchFocused ? "text-primary" : "text-muted-foreground"
            }`} />
            <Input
              placeholder="Искать инструменты, оборудование..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="pl-12 pr-12 py-6 bg-card border-border/30 rounded-2xl text-base placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </motion.div>

          {/* Category pills with icons */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {SHOP_CATEGORIES.map((cat, i) => {
              const isActive = category === cat.value;
              const count = categoryCount(cat.value);
              return (
                <motion.button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border/40 hover:border-primary/20"
                  }`}
                >
                  <cat.icon className="w-4 h-4 shrink-0" />
                  <span>{cat.label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center ${
                      isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                      {count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-sm text-muted-foreground">
              {loading ? "Загрузка..." : (
                <>
                  <span className="font-semibold text-foreground">{filteredItems.length}</span>
                  {" "}
                  {filteredItems.length === 1 ? "товар" : filteredItems.length < 5 ? "товара" : "товаров"}
                  {category !== "all" && (
                    <span> в категории <span className="text-primary font-medium">{SHOP_CATEGORIES.find(c => c.value === category)?.label}</span></span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        {/* ── Items Grid ── */}
        <div className="max-w-7xl mx-auto px-4 pb-12 pt-2">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="rounded-2xl bg-card border border-border/30 overflow-hidden">
                  <div className="aspect-square bg-secondary/30 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-secondary/50 rounded-full w-16 animate-pulse" />
                    <div className="h-4 bg-secondary/40 rounded-full w-full animate-pulse" />
                    <div className="h-5 bg-secondary/30 rounded-full w-20 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-3xl bg-card border border-border/50 flex items-center justify-center mx-auto mb-5">
                <Wrench className="w-9 h-9 text-muted-foreground/30" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {activeTab === "my" ? "У вас пока нет товаров" : "Ничего не найдено"}
              </h3>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
                {activeTab === "my"
                  ? "Разместите инструмент на продажу — это быстро и бесплатно"
                  : "Попробуйте изменить параметры поиска или выберите другую категорию"}
              </p>
              {user && activeTab === "my" && (
                <Button onClick={() => setShowAddModal(true)} className="rounded-2xl gap-2 px-6 shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4" />
                  Разместить товар
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer rounded-2xl bg-card border border-border/30 overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  {/* Photo */}
                  <div className="relative aspect-square bg-secondary/30 overflow-hidden">
                    {item.photos && item.photos.length > 0 ? (
                      <img
                        src={item.photos[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Wrench className="w-10 h-10 text-muted-foreground/20" />
                      </div>
                    )}

                    {/* Condition badge overlay */}
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-bold border backdrop-blur-md ${CONDITION_COLORS[item.condition] || "bg-secondary text-secondary-foreground"}`}
                      >
                        {CONDITION_LABELS[item.condition] || item.condition}
                      </Badge>
                    </div>

                    {/* Time overlay */}
                    <div className="absolute bottom-2 right-2 bg-background/70 backdrop-blur-md rounded-lg px-2 py-0.5">
                      <span className="text-[10px] text-foreground/80 font-medium">{timeAgo(item.created_at)}</span>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="p-3 md:p-4 space-y-2">
                    <h3 className="font-display font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
                      {item.title}
                    </h3>

                    <div className="flex items-end justify-between gap-1">
                      <p className="text-lg font-bold text-primary tracking-tight font-display">
                        {item.price.toLocaleString()}<span className="text-sm ml-0.5">₽</span>
                      </p>
                    </div>
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
          {showAddModal && (
            <AddShopItemModal
              onClose={() => setShowAddModal(false)}
              onCreated={() => { setShowAddModal(false); fetchItems(); }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ShopPage;
