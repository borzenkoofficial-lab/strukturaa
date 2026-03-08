import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, ArrowRight, Heart, Bookmark } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { useFavorites } from "@/contexts/FavoritesContext";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  created_at: string;
  tags: string[] | null;
  profiles: { display_name: string | null } | null;
}

const BlogPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, requireAuth, isArticleLiked, toggleArticleLike, getArticleLikeCount, loadArticleLikeCounts } = useFavorites();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, featured_image, created_at, tags, profiles!articles_author_id_fkey(display_name)")
        .eq("published", true)
        .order("created_at", { ascending: false });
      const arts = (data as any) || [];
      setArticles(arts);
      setLoading(false);
      if (arts.length) {
        loadArticleLikeCounts(arts.map((a: Article) => a.id));
      }
    };
    fetch();
  }, [loadArticleLikeCounts]);

  const handleFav = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    if (!requireAuth()) { navigate("/auth"); return; }
    toggleFavorite(articleId, "article");
  };

  const handleLike = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    if (!requireAuth()) { navigate("/auth"); return; }
    toggleArticleLike(articleId);
  };

  return (
    <div className="py-12 sm:py-20">
      <SEOHead title="Блог" description="Статьи о строительстве, ремонте и демонтаже от компании STRUKTURA." canonical="/blog" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.h1
          className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Блог
        </motion.h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="h-48 bg-muted rounded-t-2xl" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">Статей пока нет.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <motion.article
                key={article.id}
                className="glass-card-hover overflow-hidden cursor-pointer group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/blog/${article.slug}`)}
              >
                {article.featured_image && (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={(e) => handleFav(e, article.id)}
                        className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110 ${isFavorite(article.id) ? "bg-primary/40" : "bg-background/60"}`}
                      >
                        <Bookmark className={`w-4 h-4 ${isFavorite(article.id) ? "text-primary fill-primary" : "text-foreground"}`} />
                      </button>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.created_at).toLocaleDateString("ru-RU")}
                    </span>
                    {article.profiles?.display_name && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {article.profiles.display_name}
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                  )}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      Читать <ArrowRight className="w-4 h-4" />
                    </div>
                    <button
                      onClick={(e) => handleLike(e, article.id)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isArticleLiked(article.id) ? "text-destructive fill-destructive" : ""}`} />
                      <span>{getArticleLikeCount(article.id) || ""}</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
