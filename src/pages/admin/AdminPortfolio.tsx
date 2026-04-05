import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, X, Save, Upload, ImagePlus, GripVertical } from "lucide-react";

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  area: string;
  duration: string;
  featured_image: string | null;
  gallery: string[];
  published: boolean;
  sort_order: number;
  created_at: string;
}

const CATEGORIES = ["Демонтаж", "Фасад", "Ремонт", "Реконструкция", "Демонтаж стен", "Алмазная резка", "Вывоз мусора"];

const emptyForm = {
  title: "", description: "", category: "Демонтаж", area: "", duration: "",
  featured_image: "", gallery: [] as string[], published: false, sort_order: 0,
};

const AdminPortfolio = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [editing, setEditing] = useState<typeof emptyForm | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("sort_order", { ascending: true });
    setProjects((data as any[]) || []);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openNew = () => {
    setEditing({ ...emptyForm, sort_order: projects.length });
    setEditingId(null);
  };

  const openEdit = (p: PortfolioProject) => {
    setEditing({
      title: p.title, description: p.description || "", category: p.category,
      area: p.area || "", duration: p.duration || "",
      featured_image: p.featured_image || "", gallery: p.gallery || [],
      published: p.published, sort_order: p.sort_order,
    });
    setEditingId(p.id);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(fileName, file);
    if (error) { toast({ title: "Ошибка загрузки", variant: "destructive" }); return null; }
    return supabase.storage.from("media").getPublicUrl(fileName).data.publicUrl;
  };

  const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setEditing({ ...editing, featured_image: url });
    setUploading(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editing) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }
    setEditing({ ...editing, gallery: [...editing.gallery, ...urls] });
    setUploading(false);
  };

  const removeGalleryImage = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, gallery: editing.gallery.filter((_, i) => i !== idx) });
  };

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);
    const payload = {
      title: editing.title,
      description: editing.description,
      category: editing.category,
      area: editing.area,
      duration: editing.duration,
      featured_image: editing.featured_image || null,
      gallery: editing.gallery,
      published: editing.published,
      sort_order: editing.sort_order,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("portfolio_projects").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("portfolio_projects").insert(payload));
    }

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Проект обновлён" : "Проект создан" });
      setEditing(null);
      setEditingId(null);
      fetchProjects();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот проект из портфолио?")) return;
    await supabase.from("portfolio_projects").delete().eq("id", id);
    toast({ title: "Проект удалён" });
    fetchProjects();
  };

  const togglePublish = async (id: string, published: boolean) => {
    await supabase.from("portfolio_projects").update({ published: !published }).eq("id", id);
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Портфолио / Проекты</h1>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Новый проект
        </Button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            className="glass-card p-6 space-y-5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">
                {editingId ? "Редактировать проект" : "Новый проект"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => { setEditing(null); setEditingId(null); }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Название *</Label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Название проекта" />
              </div>
              <div className="space-y-2">
                <Label>Категория</Label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={4}
                placeholder="Подробное описание проекта"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Площадь / объём</Label>
                <Input value={editing.area} onChange={(e) => setEditing({ ...editing, area: e.target.value })} placeholder="8 500 м²" />
              </div>
              <div className="space-y-2">
                <Label>Срок</Label>
                <Input value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} placeholder="60 дней" />
              </div>
            </div>

            {/* Main image */}
            <div className="space-y-2">
              <Label>Главное фото</Label>
              <div className="flex gap-2">
                <Input
                  value={editing.featured_image}
                  onChange={(e) => setEditing({ ...editing, featured_image: e.target.value })}
                  placeholder="URL или загрузите"
                  className="flex-1"
                />
                <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  <Upload className="w-4 h-4" />
                </Button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
              </div>
              {editing.featured_image && (
                <div className="w-full h-32 rounded-lg overflow-hidden border border-border/30">
                  <img src={editing.featured_image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Gallery */}
            <div className="space-y-2">
              <Label>Галерея</Label>
              <div className="flex flex-wrap gap-2">
                {editing.gallery.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className="w-20 h-20 rounded-lg object-cover border border-border/30" />
                    <button
                      onClick={() => removeGalleryImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-destructive-foreground" />
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                  {uploading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  ) : (
                    <ImagePlus className="w-5 h-5 text-muted-foreground" />
                  )}
                  <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={editing.published} onCheckedChange={(checked) => setEditing({ ...editing, published: checked })} />
              <Label>Опубликовать на сайте</Label>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={loading || !editing.title}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Сохранение..." : "Сохранить"}
              </Button>
              <Button variant="outline" onClick={() => { setEditing(null); setEditingId(null); }}>Отмена</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="glass-card overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Проектов в портфолио пока нет</div>
        ) : (
          <div className="divide-y divide-border/20">
            {projects.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {p.featured_image ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border/20">
                      <img src={p.featured_image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <ImagePlus className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">{p.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{p.category}</span>
                      {p.area && <><span>·</span><span>{p.area}</span></>}
                      {p.duration && <><span>·</span><span>{p.duration}</span></>}
                      <span>·</span>
                      <span>{p.gallery.length} фото</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePublish(p.id, p.published)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                      p.published ? "bg-accent/20 text-accent hover:bg-accent/30" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {p.published ? "Опубликовано" : "Черновик"}
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Edit3 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortfolio;
