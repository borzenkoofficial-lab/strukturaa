import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Plus, Filter, MapPin, Calendar, RussianRuble, ArrowLeft, MessageCircle, ChevronDown, Briefcase, Home, User, Bell, Flame, HardHat, Building2, Hammer, Building, Landmark, Zap, Droplets, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CreateListingModal from "@/components/marketplace/CreateListingModal";
import ListingCard from "@/components/marketplace/ListingCard";
import ListingDetail from "@/components/marketplace/ListingDetail";
import MarketplaceChat from "@/components/marketplace/MarketplaceChat";
import MarketplaceIntro from "@/components/marketplace/MarketplaceIntro";
import SEOHead from "@/components/SEOHead";

const CATEGORIES = [
  { value: "all", label: "Все", icon: Flame },
  { value: "demolition", label: "Демонтаж", icon: HardHat },
  { value: "construction", label: "Строительство", icon: Building2 },
  { value: "renovation", label: "Ремонт", icon: Hammer },
  { value: "facades", label: "Фасады", icon: Building },
  { value: "roofing", label: "Кровля", icon: Landmark },
  { value: "electrical", label: "Электрика", icon: Zap },
  { value: "plumbing", label: "Сантехника", icon: Droplets },
  { value: "other", label: "Другое", icon: ClipboardList },
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
  const [chatListing, setChatListing] = useState<{ listing: Listing; receiverId: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"feed" | "my" | "messages">("feed");

  const fetchListings = async () => {
    setLoading(true);
    let query = supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (category !== "all") query = query.eq("category", category);
    if (search) query = query.ilike("title", `%${search}%`);
    const { data } = await query;
    setListings((data as Listing[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, [category, search]);

  const filteredListings = activeTab === "my" 
    ? listings.filter(l => l.user_id === user?.id)
    : listings;

  return (
    <>
      <SEOHead title="Доска объявлений — STRUKTURA" description="Строительная биржа: размещайте заявки на демонтаж, ремонт и строительство. Находите подрядчиков и заказчиков." canonical="/marketplace" />
      
      <AnimatePresence>
        {!introComplete && <MarketplaceIntro onComplete={() => setIntroComplete(true)} />}
      </AnimatePresence>

      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
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
                <h1 className="font-display font-bold text-lg text-foreground leading-tight">Биржа</h1>
                <p className="text-[10px] text-muted-foreground">Строительные заявки</p>
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

          {/* Navigation tabs */}
          <div className="max-w-6xl mx-auto px-4 flex gap-1 pb-2">
            {[
              { key: "feed" as const, label: "Все заявки", icon: Briefcase },
              { key: "my" as const, label: "Мои заявки", icon: User },
              { key: "messages" as const, label: "Сообщения", icon: MessageCircle },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {activeTab === "messages" ? (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <MarketplaceChat />
          </div>
        ) : (
          <>
            {/* Search & filters */}
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск заявок..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 bg-card border-border/50 rounded-xl"
                  />
                </div>
                {user && (
                  <Button onClick={() => setShowCreate(true)} className="rounded-xl gap-2 shrink-0">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Создать заявку</span>
                  </Button>
                )}
                {!user && (
                  <Button onClick={() => navigate("/auth")} variant="outline" className="rounded-xl gap-2 shrink-0">
                    <User className="w-4 h-4" />
                    Войти
                  </Button>
                )}
              </div>

              {/* Category pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      category === cat.value
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-card text-muted-foreground hover:bg-secondary border border-border/50"
                    }`}
                  >
                    <cat.icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings grid */}
            <div className="max-w-6xl mx-auto px-4 pb-8">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-64 rounded-2xl bg-card animate-pulse" />
                  ))}
                </div>
              ) : filteredListings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {activeTab === "my" ? "У вас пока нет заявок" : "Заявок не найдено"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {activeTab === "my" ? "Создайте первую заявку, чтобы найти подрядчиков" : "Попробуйте изменить фильтры или создайте свою заявку"}
                  </p>
                  {user && (
                    <Button onClick={() => setShowCreate(true)} className="rounded-xl gap-2">
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
            </div>
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
              onChat={(receiverId) => {
                setChatListing({ listing: selectedListing, receiverId });
                setSelectedListing(null);
                setActiveTab("messages");
              }}
              onRefresh={fetchListings}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default MarketplacePage;
