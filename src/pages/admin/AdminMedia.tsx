import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Upload, Trash2, Copy, Image as ImageIcon } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string | null;
  size: number | null;
  created_at: string;
}

const AdminMedia = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMedia = async () => {
    const { data } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    setMedia(data || []);
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file);

      if (uploadError) {
        toast({ title: "Ошибка загрузки", description: uploadError.message, variant: "destructive" });
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);

      await supabase.from("media").insert({
        name: file.name,
        url: publicUrl,
        type: file.type,
        size: file.size,
        uploaded_by: user.id,
      });
    }

    setUploading(false);
    fetchMedia();
    toast({ title: "Загрузка завершена" });
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Удалить "${item.name}"?`)) return;
    const urlParts = item.url.split("/media/");
    const storagePath = urlParts[urlParts.length - 1];
    if (storagePath) {
      await supabase.storage.from("media").remove([storagePath]);
    }
    await supabase.from("media").delete().eq("id", item.id);
    fetchMedia();
    toast({ title: "Удалено" });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL скопирован!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Медиа менеджер</h1>
        <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Загрузка..." : "Загрузить"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {media.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Медиафайлов пока нет. Загрузите первый!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item, i) => (
            <motion.div
              key={item.id}
              className="glass-card overflow-hidden group"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="aspect-square bg-muted relative">
                {item.type?.startsWith("image/") ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" onClick={() => copyUrl(item.url)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(item)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <div className="text-xs font-medium text-foreground truncate">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.size ? `${(item.size / 1024).toFixed(0)} КБ` : ""}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
