import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, X, Eye, Save, Upload, Image as ImageIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  published: boolean;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  category_id: string | null;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const PLACEMENT_OPTIONS = [
  { value: "blog", label: "Блог" },
  { value: "news", label: "Новости" },
  { value: "services", label: "Услуги" },
  { value: "main", label: "Главная страница" },
];

const emptyArticle = {
  title: "", slug: "", content: "", excerpt: "", featured_image: "",
  published: false, tags: [] as string[], seo_title: "", seo_description: "", category_id: "",
};

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<typeof emptyArticle | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    setArticles(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      openNew();
    }
  }, [searchParams]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  const openNew = () => {
    setEditing({ ...emptyArticle });
    setEditingId(null);
    setTagsInput("");
  };

  const openEdit = (article: Article) => {
    setEditing({
      title: article.title,
      slug: article.slug,
      content: article.content || "",
      excerpt: article.excerpt || "",
      featured_image: article.featured_image || "",
      published: article.published,
      tags: article.tags || [],
      seo_title: article.seo_title || "",
      seo_description: article.seo_description || "",
      category_id: article.category_id || "",
    });
    setEditingId(article.id);
    setTagsInput((article.tags || []).join(", "));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `article-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("media").getPublicUrl(fileName);
      setEditing({ ...editing, featured_image: data.publicUrl });
      toast({ title: "Изображение загружено" });
    } catch (err: any) {
      toast({ title: "Ошибка загрузки", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editing || !user) return;
    setLoading(true);

    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const slug = editing.slug || generateSlug(editing.title);

    const payload = {
      title: editing.title,
      slug,
      content: editing.content,
      excerpt: editing.excerpt,
      featured_image: editing.featured_image || null,
      published: editing.published,
      tags,
      seo_title: editing.seo_title || null,
      seo_description: editing.seo_description || null,
      category_id: editing.category_id || null,
      author_id: user.id,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("articles").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("articles").insert(payload));
    }

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Статья обновлена" : "Статья создана" });
      setEditing(null);
      setEditingId(null);
      fetchArticles();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эту статью?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Статья удалена" });
      fetchArticles();
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    await supabase.from("articles").update({ published: !published }).eq("id", id);
    fetchArticles();
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return null;
    return categories.find(c => c.id === categoryId)?.name || null;
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = !filterCategory || article.category_id === filterCategory;
    const matchesSearch = !searchQuery || article.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Статьи</h1>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          Новая статья
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
                {editingId ? "Редактировать статью" : "Новая статья"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => { setEditing(null); setEditingId(null); }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Заголовок *</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: generateSlug(e.target.value) })}
                  placeholder="Название статьи"
                />
              </div>
              <div className="space-y-2">
                <Label>URL (slug)</Label>
                <Input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="url-slug"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Краткое описание</Label>
              <Input
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                placeholder="Краткое описание для превью"
              />
            </div>

            <div className="space-y-2">
              <Label>Содержание</Label>
              <Textarea
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                rows={12}
                placeholder="Текст статьи (поддерживается markdown)"
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Обложка статьи</Label>
                <div className="flex gap-2">
                  <Input
                    value={editing.featured_image}
                    onChange={(e) => setEditing({ ...editing, featured_image: e.target.value })}
                    placeholder="URL изображения"
                    className="flex-1"
                  />
                  <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    <Upload className="w-4 h-4" />
                  </Button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
                {editing.featured_image && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-border/30">
                    <img src={editing.featured_image} alt="Превью" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Категория (размещение)</Label>
                <select
                  value={editing.category_id}
                  onChange={(e) => setEditing({ ...editing, category_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground"
                >
                  <option value="">Без категории</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Выберите категорию для размещения на нужной странице
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Теги (через запятую)</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="демонтаж, строительство, советы"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SEO заголовок</Label>
                <Input
                  value={editing.seo_title}
                  onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })}
                  placeholder="Заголовок для поисковиков"
                />
              </div>
              <div className="space-y-2">
                <Label>SEO описание</Label>
                <Input
                  value={editing.seo_description}
                  onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })}
                  placeholder="Мета-описание для поисковиков"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={editing.published}
                onCheckedChange={(checked) => setEditing({ ...editing, published: checked })}
              />
              <Label>Опубликовать</Label>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={loading || !editing.title}>
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию..."
          className="sm:max-w-xs"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground sm:max-w-xs"
        >
          <option value="">Все категории</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        {filteredArticles.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {articles.length === 0 ? "Статей пока нет" : "Ничего не найдено"}
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {filteredArticles.map((article) => (
              <div key={article.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {article.featured_image ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border/20">
                      <img src={article.featured_image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">{article.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{new Date(article.created_at).toLocaleDateString("ru-RU")}</span>
                      <span>·</span>
                      <span>/{article.slug}</span>
                      {getCategoryName(article.category_id) && (
                        <>
                          <span>·</span>
                          <span className="text-primary">{getCategoryName(article.category_id)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePublish(article.id, article.published)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                      article.published
                        ? "bg-accent/20 text-accent hover:bg-accent/30"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {article.published ? "Опубликовано" : "Черновик"}
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(article)}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => window.open(`/blog/${article.slug}`, "_blank")}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
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

export default AdminArticles;
