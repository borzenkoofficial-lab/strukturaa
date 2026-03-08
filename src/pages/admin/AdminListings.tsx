import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Trash2, Eye, EyeOff, MoreVertical, Briefcase,
  MapPin, Calendar, RussianRuble, CheckCircle, XCircle, Clock,
  Pencil, X, Save
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  address: string | null;
  status: string;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  demolition: "Демонтаж",
  construction: "Строительство",
  renovation: "Ремонт",
  facades: "Фасады",
  roofing: "Кровля",
  electrical: "Электрика",
  plumbing: "Сантехника",
  other: "Другое",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: "Активна", color: "bg-green-500/20 text-green-400", icon: CheckCircle },
  closed: { label: "Закрыта", color: "bg-muted text-muted-foreground", icon: XCircle },
  moderation: { label: "На модерации", color: "bg-yellow-500/20 text-yellow-400", icon: Clock },
};

const AdminListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Listing | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", budget_min: 0, budget_max: 0, address: "", category: "", status: "" });
  const { toast } = useToast();

  const fetchListings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });
    setListings((data as Listing[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  const openEdit = (item: Listing) => {
    setEditItem(item);
    setEditForm({
      title: item.title,
      description: item.description,
      budget_min: item.budget_min || 0,
      budget_max: item.budget_max || 0,
      address: item.address || "",
      category: item.category,
      status: item.status,
    });
  };

  const saveEdit = async () => {
    if (!editItem) return;
    const { error } = await supabase.from("listings").update({
      title: editForm.title,
      description: editForm.description,
      budget_min: editForm.budget_min || null,
      budget_max: editForm.budget_max || null,
      address: editForm.address || null,
      category: editForm.category,
      status: editForm.status,
    }).eq("id", editItem.id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Заявка обновлена" });
      setEditItem(null);
      fetchListings();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("listings").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Статус изменён на "${STATUS_CONFIG[status]?.label || status}"` });
      fetchListings();
    }
  };

  const deleteListing = async (id: string, title: string) => {
    if (!confirm(`Удалить заявку "${title}"?`)) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Заявка удалена" });
      fetchListings();
    }
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `${min.toLocaleString("ru-RU")} – ${max.toLocaleString("ru-RU")} ₽`;
    if (min) return `от ${min.toLocaleString("ru-RU")} ₽`;
    return `до ${max!.toLocaleString("ru-RU")} ₽`;
  };

  const filtered = listings.filter(l => {
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    const matchCat = filterCategory === "all" || l.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const activeCount = listings.filter(l => l.status === "active").length;
  const closedCount = listings.filter(l => l.status === "closed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Заявки биржи</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Всего {listings.length} · Активных {activeCount} · Закрытых {closedCount}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center">
          <div className="font-display text-2xl font-bold text-foreground">{listings.length}</div>
          <div className="text-xs text-muted-foreground">Всего</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="font-display text-2xl font-bold text-green-400">{activeCount}</div>
          <div className="text-xs text-muted-foreground">Активные</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="font-display text-2xl font-bold text-muted-foreground">{closedCount}</div>
          <div className="text-xs text-muted-foreground">Закрытые</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск заявок..." className="pl-10" />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground"
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="closed">Закрытые</option>
          <option value="moderation">На модерации</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground"
        >
          <option value="all">Все категории</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Listings grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 rounded-2xl bg-card animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Briefcase className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Заявок не найдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((listing, i) => {
            const budget = formatBudget(listing.budget_min, listing.budget_max);
            const statusCfg = STATUS_CONFIG[listing.status] || STATUS_CONFIG.active;
            const StatusIcon = statusCfg.icon;

            return (
              <motion.div
                key={listing.id}
                className="glass-card p-5 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2">{listing.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{listing.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(listing)}>
                        <Pencil className="w-4 h-4 mr-2" />Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {listing.status !== "active" && (
                        <DropdownMenuItem onClick={() => updateStatus(listing.id, "active")}>
                          <Eye className="w-4 h-4 mr-2" />Активировать
                        </DropdownMenuItem>
                      )}
                      {listing.status !== "closed" && (
                        <DropdownMenuItem onClick={() => updateStatus(listing.id, "closed")}>
                          <EyeOff className="w-4 h-4 mr-2" />Закрыть
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteListing(listing.id, listing.title)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge variant="secondary" className="text-[10px]">
                    {CATEGORY_LABELS[listing.category] || listing.category}
                  </Badge>
                  <Badge className={`text-[10px] ${statusCfg.color} border-0`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusCfg.label}
                  </Badge>
                </div>

                <div className="mt-auto space-y-1.5 text-xs text-muted-foreground">
                  {budget && (
                    <div className="flex items-center gap-1.5">
                      <RussianRuble className="w-3.5 h-3.5" />
                      <span>{budget}</span>
                    </div>
                  )}
                  {listing.address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{listing.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(listing.created_at).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      <AnimatePresence>
        {editItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setEditItem(null)} />
            <motion.div
              className="relative w-full max-w-lg bg-card border border-border/50 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-foreground">Редактировать заявку</h2>
                <button onClick={() => setEditItem(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Заголовок</label>
                  <Input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Описание</label>
                  <Textarea value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Бюджет от (₽)</label>
                    <Input type="number" value={editForm.budget_min} onChange={e => setEditForm(p => ({ ...p, budget_min: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Бюджет до (₽)</label>
                    <Input type="number" value={editForm.budget_max} onChange={e => setEditForm(p => ({ ...p, budget_max: Number(e.target.value) }))} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Адрес</label>
                  <Input value={editForm.address} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Категория</label>
                    <select
                      value={editForm.category}
                      onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground"
                    >
                      {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Статус</label>
                    <select
                      value={editForm.status}
                      onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground"
                    >
                      <option value="active">Активна</option>
                      <option value="closed">Закрыта</option>
                      <option value="moderation">На модерации</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditItem(null)}>Отмена</Button>
                <Button className="flex-1 gap-2" onClick={saveEdit}>
                  <Save className="w-4 h-4" />Сохранить
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminListings;
