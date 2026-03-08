import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  created_at: string;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
  categories: { name: string } | null;
}

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("articles")
        .select("*, profiles!articles_author_id_fkey(display_name, avatar_url), categories(name)")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      setArticle(data as any);

      if (data?.category_id) {
        const { data: rel } = await supabase
          .from("articles")
          .select("id, title, slug, featured_image")
          .eq("published", true)
          .eq("category_id", data.category_id)
          .neq("id", data.id)
          .limit(3);
        setRelated(rel || []);
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  useEffect(() => {
    if (article?.seo_title) document.title = article.seo_title;
  }, [article]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return (
      <div className="py-20 max-w-3xl mx-auto px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-64 bg-muted rounded-2xl" />
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground mb-4">Article not found</h1>
        <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20">
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {article.categories?.name && (
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {article.categories.name}
            </span>
          )}

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-4 mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            {article.profiles?.display_name && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.profiles.display_name}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(article.created_at).toLocaleDateString()}
            </span>
          </div>

          {article.featured_image && (
            <div className="rounded-2xl overflow-hidden mb-8">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/30">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share buttons */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border/30">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share:
            </span>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Twitter className="w-4 h-4 text-secondary-foreground" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Facebook className="w-4 h-4 text-secondary-foreground" />
            </a>
            <button
              onClick={() => { navigator.clipboard.writeText(shareUrl); }}
              className="text-xs px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Copy Link
            </button>
          </div>
        </motion.div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <div
                  key={r.id}
                  className="glass-card-hover overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/blog/${r.slug}`)}
                >
                  {r.featured_image && (
                    <img src={r.featured_image} alt={r.title} className="h-32 w-full object-cover" loading="lazy" />
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-foreground">{r.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default ArticlePage;
