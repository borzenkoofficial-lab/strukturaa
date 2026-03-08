import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Users, Image, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ articles: 0, users: 0, media: 0, published: 0 });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const [articles, profiles, media] = await Promise.all([
        supabase.from("articles").select("id, published", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("media").select("id", { count: "exact" }),
      ]);
      const publishedCount = articles.data?.filter(a => a.published).length || 0;
      setStats({
        articles: articles.count || 0,
        users: profiles.count || 0,
        media: media.count || 0,
        published: publishedCount,
      });
    };

    const fetchRecent = async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, title, published, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentArticles(data || []);
    };

    fetchStats();
    fetchRecent();
  }, []);

  const cards = [
    { icon: FileText, label: "Total Articles", value: stats.articles, color: "text-primary" },
    { icon: Eye, label: "Published", value: stats.published, color: "text-accent" },
    { icon: Users, label: "Users", value: stats.users, color: "text-primary" },
    { icon: Image, label: "Media Files", value: stats.media, color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <Button onClick={() => navigate("/admin/articles?new=1")}>+ New Article</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <card.icon className={`w-8 h-8 ${card.color} mb-3`} />
            <div className="font-display text-3xl font-bold text-foreground">{card.value}</div>
            <div className="text-sm text-muted-foreground">{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Recent Articles</h2>
        {recentArticles.length === 0 ? (
          <p className="text-muted-foreground text-sm">No articles yet. Create your first one!</p>
        ) : (
          <div className="space-y-3">
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between py-2 border-b border-border/20 last:border-0"
              >
                <div>
                  <div className="text-sm font-medium text-foreground">{article.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(article.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    article.published
                      ? "bg-accent/20 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {article.published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
