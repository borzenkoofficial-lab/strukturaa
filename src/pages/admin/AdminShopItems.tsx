import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Trash2, MoreVertical, Wrench, Plus, X, Save,
  Eye, EyeOff, Pencil, RussianRuble, Package, Image as ImageIcon
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShopItem {
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

const CATEGORY_LABELS: Record<string, string> = {
  power_tools: "Электроинструмент",
  hand_tools: "Ручной инструмент",
  measurement: "Измерительные",
  safety: "Защита и СИЗ",
  consumables: "Расходники",
  other: "Другое",
};

const CONDITION_LABELS: Record<string, string> = {
  new: "Новый",
  like_new: "Как новый",
  used_good: "Б/У хорошее",
  used_fair: "Б/У среднее",
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Активен", color: "bg-green-500/20 text-green-400" },
  sold: { label: "Продан", color: "bg-primary/20 text-primary" },
  hidden: { label: "Скрыт", color: "bg-muted text-muted-foreground" },
};

const AdminShopItems = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<ShopItem | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", price: 0, category: "", condition: "", status: "" });
  const { toast } = useToast();

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await (supabase.from as any)("shop_items")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as ShopItem[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openEdit = (item: ShopItem) => {
    setEditItem(item);
    setEditForm({
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      condition: item.condition,
      status: item.status,
    });
  };

  const saveEdit = async () => {
    if (!editItem) return;
    const { error } = await (supabase.from as any)("shop_items")
      .update({
        title: editForm.title,
        description: editForm.description,
        price: editForm.price,
        category: editForm.category,
        condition: editForm.condition,
        status: editForm.status,
      })
      .eq("id", editItem.id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Товар обновлён" });
      setEditItem(null);
      fetchItems();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await (supabase.from as any)("shop_items").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Статус изменён на "${STATUS_CONFIG[status]?.label || status}"` });
      fetchItems();
    }
  };

  const deleteItem = async (id: string, title: string) => {
    if (!confirm(`Удалить товар "${title}"?`)) return;
    const { error } = await (supabase.from as any)("shop_items").delete().eq("id", id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Товар удалён" });
      fetchItems();
    }
  };

  const filtered = items.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || i.status === filterStatus;
    const matchCat = filterCategory === "all" || i.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const activeCount = items.filter(i => i.status === "active").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Маркетплейс</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Всего {items.length} · Активных {activeCount}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center">
          <div className="font-display text-2xl font-bold text-foreground">{items.length}</div>
          <div className="text-xs text-muted-foreground">Всего</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="font-display text-2xl font-bold text-green-400">{activeCount}</div>
          <div className="text-xs text-muted-foreground">Активные</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="font-display text-2xl font-bold text-muted-foreground">{items.length - activeCount}</div>
          <div className="text-xs text-muted-foreground">Скрытые/Проданные</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск товаров..." className="pl-10" />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground"
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="sold">Проданные</option>
          <option value="hidden">Скрытые</option>
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

      {/* Items grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 rounded-2xl bg-card animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Wrench className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Товаров не найдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => {
            const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.active;
            return (
              <motion.div
                key={item.id}
                className="glass-card overflow-hidden flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {/* Photo */}
                <div className="aspect-[4/3] bg-secondary/30 relative">
                  {item.photos && item.photos.length > 0 ? (
                    <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(item)}>
                          <Pencil className="w-4 h-4 mr-2" />Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {item.status !== "active" && (
                          <DropdownMenuItem onClick={() => updateStatus(item.id, "active")}>
                            <Eye className="w-4 h-4 mr-2" />Активировать
                          </DropdownMenuItem>
                        )}
                        {item.status !== "hidden" && (
                          <DropdownMenuItem onClick={() => updateStatus(item.id, "hidden")}>
                            <EyeOff className="w-4 h-4 mr-2" />Скрыть
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => deleteItem(item.id, item.title)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2">{item.title}</h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge variant="secondary" className="text-[10px]">
                      {CATEGORY_LABELS[item.category] || item.category}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {CONDITION_LABELS[item.condition] || item.condition}
                    </Badge>
                    <Badge className={`text-[10px] ${statusCfg.color} border-0`}>
                      {statusCfg.label}
                    </Badge>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-display font-bold text-primary text-lg">
                      {item.price.toLocaleString()} ₽
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString("ru-RU")}
                    </span>
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
                <h2 className="font-display font-bold text-lg text-foreground">Редактировать товар</h2>
                <button onClick={() => setEditItem(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Название</label>
                  <Input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Описание</label>
                  <Textarea value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Цена (₽)</label>
                    <Input type="number" value={editForm.price} onChange={e => setEditForm(p => ({ ...p, price: Number(e.target.value) }))} />
                  </div>
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
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Состояние</label>
                    <select
                      value={editForm.condition}
                      onChange={e => setEditForm(p => ({ ...p, condition: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground"
                    >
                      {Object.entries(CONDITION_LABELS).map(([k, v]) => (
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
                      <option value="active">Активен</option>
                      <option value="sold">Продан</option>
                      <option value="hidden">Скрыт</option>
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

export default AdminShopItems;
