import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, GripVertical, Edit2, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Story {
  id: string;
  title: string;
  image_url: string;
  overlay_text: string | null;
  cta_label: string | null;
  cta_link: string | null;
  sort_order: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
}

const emptyStory = {
  title: "",
  image_url: "",
  overlay_text: "",
  cta_label: "",
  cta_link: "",
  sort_order: 0,
  active: true,
  expires_at: "",
};

const AdminStories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyStory);
  const [uploading, setUploading] = useState(false);

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["admin-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("sort_order")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Story[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (storyData: typeof form) => {
      const payload = {
        title: storyData.title,
        image_url: storyData.image_url,
        overlay_text: storyData.overlay_text || null,
        cta_label: storyData.cta_label || null,
        cta_link: storyData.cta_link || null,
        sort_order: storyData.sort_order,
        active: storyData.active,
        expires_at: storyData.expires_at || null,
      };

      if (editingId) {
        const { error } = await supabase.from("stories").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("stories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast({ title: editingId ? "История обновлена" : "История создана" });
      resetForm();
    },
    onError: (err: any) => {
      toast({ title: "Ошибка", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("stories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast({ title: "История удалена" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("stories").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const resetForm = () => {
    setForm(emptyStory);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (story: Story) => {
    setForm({
      title: story.title,
      image_url: story.image_url,
      overlay_text: story.overlay_text || "",
      cta_label: story.cta_label || "",
      cta_link: story.cta_link || "",
      sort_order: story.sort_order,
      active: story.active,
      expires_at: story.expires_at ? story.expires_at.slice(0, 16) : "",
    });
    setEditingId(story.id);
    setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `story-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("media").getPublicUrl(fileName);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast({ title: "Изображение загружено" });
    } catch (err: any) {
      toast({ title: "Ошибка загрузки", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Истории</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Добавить
        </Button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="glass-card p-6 mb-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {editingId ? "Редактировать историю" : "Новая история"}
              </h3>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Заголовок *</label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Название истории"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Изображение *</label>
                  <div className="flex gap-2">
                    <Input
                      value={form.image_url}
                      onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                      placeholder="URL изображения"
                      className="flex-1"
                    />
                    <label className="cursor-pointer">
                      <Button variant="secondary" disabled={uploading} asChild>
                        <span>{uploading ? "..." : "Загрузить"}</span>
                      </Button>
                      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Текст на истории</label>
                  <Textarea
                    value={form.overlay_text}
                    onChange={(e) => setForm((f) => ({ ...f, overlay_text: e.target.value }))}
                    placeholder="Описание поверх изображения"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Текст кнопки CTA</label>
                  <Input
                    value={form.cta_label}
                    onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))}
                    placeholder="Например: Узнать подробнее"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Ссылка кнопки</label>
                  <Input
                    value={form.cta_link}
                    onChange={(e) => setForm((f) => ({ ...f, cta_link: e.target.value }))}
                    placeholder="/services или https://..."
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Порядок сортировки</label>
                  <Input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Истекает (опционально)</label>
                  <Input
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            {form.image_url && (
              <div className="relative w-32 h-48 rounded-xl overflow-hidden border border-border">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-[10px] font-semibold truncate">{form.title || "Заголовок"}</p>
                </div>
              </div>
            )}

            <Button
              onClick={() => saveMutation.mutate(form)}
              disabled={!form.title || !form.image_url || saveMutation.isPending}
              className="w-full"
            >
              <Check className="w-4 h-4 mr-2" />
              {editingId ? "Сохранить" : "Создать"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stories list */}
      {isLoading ? (
        <p className="text-muted-foreground">Загрузка...</p>
      ) : stories.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground">Историй пока нет. Создайте первую!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              className="glass-card p-4 flex items-center gap-4"
              layout
            >
              <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/30">
                <img src={story.image_url} alt={story.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{story.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {story.overlay_text || "Без текста"}
                  {story.cta_label && ` • ${story.cta_label}`}
                </p>
              </div>
              <Switch
                checked={story.active}
                onCheckedChange={(active) => toggleActive.mutate({ id: story.id, active })}
              />
              <Button variant="ghost" size="icon" onClick={() => startEdit(story)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => deleteMutation.mutate(story.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminStories;
