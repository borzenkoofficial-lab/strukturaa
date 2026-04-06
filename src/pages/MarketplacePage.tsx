import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search, Plus, ArrowLeft, MessageCircle, User, Home,
  Briefcase, Flame, HardHat, Building2, Hammer, Building,
  Landmark, Zap, Droplets, ClipboardList, Wallet,
  Shovel, Mountain, PaintBucket, Wind, Wrench, Truck,
  ChevronRight, TrendingUp, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateListingModal from "@/components/marketplace/CreateListingModal";
import ListingCard from "@/components/marketplace/ListingCard";
import ListingDetail from "@/components/marketplace/ListingDetail";
import MarketplaceChat from "@/components/marketplace/MarketplaceChat";
import MarketplaceIntro from "@/components/marketplace/MarketplaceIntro";
import ContractorProfileEdit from "@/components/marketplace/ContractorProfileEdit";
import ContractorProfileView from "@/components/marketplace/ContractorProfileView";
import SEOHead from "@/components/SEOHead";

const CATEGORIES = [
  { value: "all", label: "Все заявки", icon: Flame, desc: "Все категории" },
  { value: "demolition", label: "Демонтаж", icon: HardHat, desc: "Снос и разборка" },
  { value: "construction", label: "Строительство", icon: Building2, desc: "Возведение зданий" },
  { value: "renovation", label: "Ремонт", icon: Hammer, desc: "Отделка и ремонт" },
  { value: "facades", label: "Фасады", icon: Building, desc: "Облицовка и утепление" },
  { value: "roofing", label: "Кровля", icon: Landmark, desc: "Монтаж крыш" },
  { value: "electrical", label: "Электрика", icon: Zap, desc: "Проводка и монтаж" },
  { value: "plumbing", label: "Сантехника", icon: Droplets, desc: "Водоснабжение" },
  { value: "earthwork", label: "Земляные работы", icon: Shovel, desc: "Котлованы, планировка" },
  { value: "landscaping", label: "Благоустройство", icon: Mountain, desc: "Озеленение, дорожки" },
  { value: "painting", label: "Малярные работы", icon: PaintBucket, desc: "Покраска, штукатурка" },
  { value: "hvac", label: "Вентиляция", icon: Wind, desc: "Климат и вентиляция" },
  { value: "mounting", label: "Монтаж", icon: Wrench, desc: "Установка конструкций" },
  { value: "logistics", label: "Вывоз мусора", icon: Truck, desc: "Транспортировка" },
  { value: "other", label: "Другое", icon: ClipboardList, desc: "Прочие работы" },
];

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  address: string | null;
  photos: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [introComplete, setIntroComplete] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [chatPartnerId, setChatPartnerId] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [listingCount, setListingCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"feed" | "my" | "messages">("feed");
  const [showContractorEdit, setShowContractorEdit] = useState(false);
  const [viewContractorId, setViewContractorId] = useState<string | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    let query = supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (category !== "all") query = query.eq("category", category);
    if (search) query = query.ilike("title", `%${search}%`);
    const { data } = await query;
    setListings((data as Listing[]) || []);
    setListingCount((data as Listing[])?.length || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
    loadBalance();
  }, [category, search]);

  const loadBalance = async () => {
    if (!user) return;
    const { data } = await supabase.from("wallets").select("balance").eq("user_id", user.id).maybeSingle();
    if (data) setWalletBalance(Number(data.balance));
  };

  const filteredListings = activeTab === "my"
    ? listings.filter(l => l.user_id === user?.id)
    : listings;

  const activeCat = CATEGORIES.find(c => c.value === category);

  return (
    <>
      <SEOHead title="Биржа заказов — STRUKTURA" description="Строительная биржа: размещайте заявки на демонтаж, ремонт и строительство." canonical="/marketplace" />

      <AnimatePresence>
        {!introComplete && <MarketplaceIntro onComplete={() => setIntroComplete(true)} />}
      </AnimatePresence>

      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {/* ═══ Sticky Header ═══ */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => navigate("/")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-secondary/80 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
              </motion.button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-base text-foreground leading-none">Биржа</h1>
                  <p className="text-[10px] text-muted-foreground">{listingCount} заявок</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user && walletBalance !== null && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                  <Wallet className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-primary">{walletBalance.toLocaleString()} ₽</span>
                </div>
              )}
              {user && (
                <motion.button onClick={() => navigate("/dashboard")} whileHover={{ scale: 1.05 }} className="w-9 h-9 rounded-xl bg-secondary/80 flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </motion.button>
              )}
              <motion.button onClick={() => navigate("/")} whileHover={{ scale: 1.05 }} className="w-9 h-9 rounded-xl bg-secondary/80 flex items-center justify-center">
                <Home className="w-4 h-4 text-secondary-foreground" />
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 pb-2 overflow-x-auto scrollbar-hide">
            {([
              { key: "feed" as const, label: "Лента", icon: Briefcase },
              { key: "my" as const, label: "Мои заявки", icon: User },
              { key: "messages" as const, label: "Сообщения", icon: MessageCircle },
            ]).map(tab => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </header>

        {activeTab === "messages" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <MarketplaceChat initialPartnerId={chatPartnerId} />
          </div>
        ) : (
          <>
            {/* ═══ Hero Section ═══ */}
            <section className="relative overflow-hidden">
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-6"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">{listingCount} активных заявок</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight mb-3">
                    Найдите{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      идеального подрядчика
                    </span>
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
                    Публикуйте заявки, получайте предложения от проверенных специалистов и выбирайте лучшее
                  </p>
                </motion.div>

                {/* Search bar */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="max-w-2xl mx-auto flex gap-2"
                >
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск по заявкам..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="pl-11 h-12 bg-card/80 backdrop-blur-sm border-border/40 rounded-2xl text-sm shadow-sm focus:shadow-md focus:shadow-primary/5 transition-shadow"
                    />
                  </div>
                  {user ? (
                    <div className="flex gap-2">
                      <Button onClick={() => setShowContractorEdit(true)} variant="outline" className="h-12 rounded-2xl gap-2 px-4">
                        <HardHat className="w-4 h-4" />
                        <span className="hidden sm:inline">Я исполнитель</span>
                      </Button>
                      <Button onClick={() => setShowCreate(true)} className="h-12 rounded-2xl gap-2 px-5 shadow-md shadow-primary/20">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Создать</span>
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => navigate("/auth")} variant="outline" className="h-12 rounded-2xl gap-2 px-5">
                      <User className="w-4 h-4" />
                      Войти
                    </Button>
                  )}
                </motion.div>
              </div>
            </section>

            {/* ═══ Category Grid ═══ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">Категории работ</h3>
                  {category !== "all" && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setCategory("all")}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      Показать все
                      <ChevronRight className="w-3 h-3" />
                    </motion.button>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2 sm:gap-3">
                  {CATEGORIES.map((cat, i) => {
                    const Icon = cat.icon;
                    const isActive = category === cat.value;
                    return (
                      <motion.button
                        key={cat.value}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.35 }}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCategory(cat.value)}
                        className={`group relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border transition-all duration-200 ${
                          isActive
                            ? "bg-primary/10 border-primary/30 shadow-md shadow-primary/10"
                            : "bg-card/60 border-border/30 hover:border-primary/20 hover:bg-card hover:shadow-sm"
                        }`}
                      >
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : "bg-secondary/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight transition-colors ${
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        }`}>
                          {cat.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </section>

            {/* ═══ Active filter badge ═══ */}
            {category !== "all" && activeCat && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 pb-4"
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/15">
                  {activeCat && <activeCat.icon className="w-5 h-5 text-primary" />}
                  <div>
                    <span className="text-sm font-semibold text-foreground">{activeCat.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">— {activeCat.desc}</span>
                  </div>
                  <span className="ml-auto text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {filteredListings.length}
                  </span>
                </div>
              </motion.div>
            )}

            {/* ═══ Listings Feed ═══ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">
                  {activeTab === "my" ? "Мои заявки" : "Последние заявки"}
                </h3>
                <span className="text-xs text-muted-foreground">{filteredListings.length} объявлений</span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-2xl bg-card border border-border/30 overflow-hidden"
                    >
                      <div className="h-3 bg-gradient-to-r from-secondary via-secondary/50 to-secondary animate-pulse" />
                      <div className="p-5 space-y-3">
                        <div className="h-5 w-20 rounded-full bg-secondary animate-pulse" />
                        <div className="h-4 w-3/4 rounded bg-secondary animate-pulse" />
                        <div className="h-3 w-full rounded bg-secondary/60 animate-pulse" />
                        <div className="h-3 w-2/3 rounded bg-secondary/60 animate-pulse" />
                        <div className="flex gap-2 pt-2">
                          <div className="h-8 w-24 rounded-xl bg-secondary animate-pulse" />
                          <div className="h-8 w-20 rounded-xl bg-secondary animate-pulse" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : filteredListings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 rounded-3xl bg-secondary/50 flex items-center justify-center mx-auto mb-5">
                    <Briefcase className="w-9 h-9 text-muted-foreground/40" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {activeTab === "my" ? "У вас пока нет заявок" : "Заявок не найдено"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                    {activeTab === "my"
                      ? "Создайте первую заявку, чтобы найти подрядчиков для вашего проекта"
                      : "Попробуйте изменить фильтры или создайте свою заявку"}
                  </p>
                  {user && (
                    <Button onClick={() => setShowCreate(true)} className="rounded-2xl gap-2 shadow-md shadow-primary/20">
                      <Plus className="w-4 h-4" />
                      Создать заявку
                    </Button>
                  )}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredListings.map((listing, i) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      index={i}
                      onClick={() => setSelectedListing(listing)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* ═══ CTA bottom ═══ */}
            {!user && (
              <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto px-4 sm:px-6 pb-12"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-primary/15 p-8 sm:p-10 text-center">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground mb-3 relative">
                    Присоединяйтесь к бирже
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto relative">
                    Зарегистрируйтесь, чтобы создавать заявки, откликаться на заказы и общаться с подрядчиками
                  </p>
                  <Button onClick={() => navigate("/auth")} size="lg" className="rounded-2xl gap-2 shadow-lg shadow-primary/20 relative">
                    Начать бесплатно
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.section>
            )}
          </>
        )}

        {/* Modals */}
        <AnimatePresence>
          {showCreate && (
            <CreateListingModal
              onClose={() => setShowCreate(false)}
              onCreated={() => { setShowCreate(false); fetchListings(); }}
            />
          )}
          {selectedListing && (
            <ListingDetail
              listing={selectedListing}
              onClose={() => setSelectedListing(null)}
              onChat={(receiverId, _listingId) => {
                setChatPartnerId(receiverId);
                setSelectedListing(null);
                setActiveTab("messages");
              }}
              onRefresh={fetchListings}
            />
          )}
          {showContractorEdit && (
            <ContractorProfileEdit
              onClose={() => setShowContractorEdit(false)}
              onSaved={() => setShowContractorEdit(false)}
            />
          )}
          {viewContractorId && (
            <ContractorProfileView
              userId={viewContractorId}
              onClose={() => setViewContractorId(null)}
              onChat={(uid) => {
                setChatPartnerId(uid);
                setViewContractorId(null);
                setActiveTab("messages");
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default MarketplacePage;
