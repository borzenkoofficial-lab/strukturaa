import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, X, Eye, Save } from "lucide-react";

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
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    setArticles(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

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
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Article updated" : "Article created" });
      setEditing(null);
      setEditingId(null);
      fetchArticles();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Article deleted" });
      fetchArticles();
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    await supabase.from("articles").update({ published: !published }).eq("id", id);
    fetchArticles();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Articles</h1>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

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
                {editingId ? "Edit Article" : "New Article"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => { setEditing(null); setEditingId(null); }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: generateSlug(e.target.value) })}
                  placeholder="Article title"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="url-slug"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Input
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                placeholder="Short description"
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                rows={12}
                placeholder="Article content (supports markdown)"
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Featured Image URL</Label>
                <Input
                  value={editing.featured_image}
                  onChange={(e) => setEditing({ ...editing, featured_image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  value={editing.category_id}
                  onChange={(e) => setEditing({ ...editing, category_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">None</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="demolition, construction, tips"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input
                  value={editing.seo_title}
                  onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })}
                  placeholder="SEO title"
                />
              </div>
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Input
                  value={editing.seo_description}
                  onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })}
                  placeholder="SEO meta description"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={editing.published}
                onCheckedChange={(checked) => setEditing({ ...editing, published: checked })}
              />
              <Label>Published</Label>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={loading || !editing.title}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => { setEditing(null); setEditingId(null); }}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card overflow-hidden">
        {articles.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No articles yet</div>
        ) : (
          <div className="divide-y divide-border/20">
            {articles.map((article) => (
              <div key={article.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground truncate">{article.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(article.created_at).toLocaleDateString()} · /{article.slug}
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
                    {article.published ? "Published" : "Draft"}
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
