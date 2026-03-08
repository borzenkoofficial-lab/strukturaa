import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, X, Save, FolderOpen } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<{ name: string; slug: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
  };

  useEffect(() => { fetchCategories(); }, []);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  const openNew = () => {
    setEditing({ name: "", slug: "" });
    setEditingId(null);
  };

  const openEdit = (cat: Category) => {
    setEditing({ name: cat.name, slug: cat.slug });
    setEditingId(cat.id);
  };

  const handleSave = async () => {
    if (!editing || !editing.name) return;
    setLoading(true);

    const slug = editing.slug || generateSlug(editing.name);
    const payload = { name: editing.name, slug };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("categories").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("categories").insert(payload));
    }

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Категория обновлена" : "Категория создана" });
      setEditing(null);
      setEditingId(null);
      fetchCategories();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эту категорию? Статьи в ней останутся без категории.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Категория удалена" });
      fetchCategories();
    }
  };

  // Count articles per category
  const [articleCounts, setArticleCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    const fetchCounts = async () => {
      const { data } = await supabase.from("articles").select("category_id");
      if (data) {
        const counts: Record<string, number> = {};
        data.forEach(a => {
          if (a.category_id) counts[a.category_id] = (counts[a.category_id] || 0) + 1;
        });
        setArticleCounts(counts);
      }
    };
    fetchCounts();
  }, [categories]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Категории</h1>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          Новая категория
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Категории определяют где будут отображаться статьи: блог, новости, услуги, проекты и т.д.
      </p>

      <AnimatePresence>
        {editing && (
          <motion.div
            className="glass-card p-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">
                {editingId ? "Редактировать категорию" : "Новая категория"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => { setEditing(null); setEditingId(null); }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Название *</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: generateSlug(e.target.value) })}
                  placeholder="Например: Блог, Новости, Услуги"
                />
              </div>
              <div className="space-y-2">
                <Label>URL (slug)</Label>
                <Input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="blog, news, services"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={loading || !editing.name}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Сохранение..." : "Сохранить"}
              </Button>
              <Button variant="outline" onClick={() => { setEditing(null); setEditingId(null); }}>
                Отмена
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p>Категорий пока нет. Создайте первую!</p>
            <p className="text-xs mt-1">Например: Блог, Новости, Услуги, Проекты</p>
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">{cat.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      /{cat.slug} · {articleCounts[cat.id] || 0} статей
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
