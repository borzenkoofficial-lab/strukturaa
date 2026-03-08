import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";


interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (id: string, type?: string) => boolean;
  isFavorite: (id: string) => boolean;
  ratings: Record<string, number>;
  setRating: (id: string, rating: number) => void;
  getRating: (id: string) => number;
  requireAuth: () => boolean;
  articleLikes: Set<string>;
  toggleArticleLike: (articleId: string) => void;
  isArticleLiked: (articleId: string) => boolean;
  getArticleLikeCount: (articleId: string) => number;
  articleLikeCounts: Record<string, number>;
  loadArticleLikeCounts: (articleIds: string[]) => void;
  favoritesList: { item_id: string; item_type: string; created_at: string }[];
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoritesList, setFavoritesList] = useState<{ item_id: string; item_type: string; created_at: string }[]>([]);
  const [articleLikes, setArticleLikes] = useState<Set<string>>(new Set());
  const [articleLikeCounts, setArticleLikeCounts] = useState<Record<string, number>>({});

  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("struktura-ratings");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // Load user favorites from DB
  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      setFavoritesList([]);
      setArticleLikes(new Set());
      return;
    }
    const load = async () => {
      const { data: favs } = await supabase
        .from("favorites")
        .select("item_id, item_type, created_at")
        .eq("user_id", user.id);
      if (favs) {
        setFavorites(new Set(favs.map(f => f.item_id)));
        setFavoritesList(favs);
      }
      const { data: likes } = await supabase
        .from("article_likes")
        .select("article_id")
        .eq("user_id", user.id);
      if (likes) {
        setArticleLikes(new Set(likes.map(l => l.article_id)));
      }
    };
    load();
  }, [user]);

  const requireAuth = useCallback(() => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт, чтобы добавить в избранное",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }, [user, toast]);

  const toggleFavorite = useCallback((id: string, type: string = "service") => {
    if (!user) return false;
    const was = favorites.has(id);
    setFavorites(prev => {
      const next = new Set(prev);
      if (was) next.delete(id); else next.add(id);
      return next;
    });
    if (was) {
      supabase.from("favorites").delete().eq("user_id", user.id).eq("item_id", id).eq("item_type", type).then();
      setFavoritesList(prev => prev.filter(f => f.item_id !== id));
    } else {
      supabase.from("favorites").insert({ user_id: user.id, item_id: id, item_type: type }).then();
      setFavoritesList(prev => [...prev, { item_id: id, item_type: type, created_at: new Date().toISOString() }]);
    }
    return !was;
  }, [user, favorites]);

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  const setRating = useCallback((id: string, rating: number) => {
    setRatings(prev => {
      const next = { ...prev, [id]: rating };
      localStorage.setItem("struktura-ratings", JSON.stringify(next));
      return next;
    });
  }, []);

  const getRating = useCallback((id: string) => ratings[id] ?? 0, [ratings]);

  const toggleArticleLike = useCallback((articleId: string) => {
    if (!user) return;
    const was = articleLikes.has(articleId);
    setArticleLikes(prev => {
      const next = new Set(prev);
      if (was) next.delete(articleId); else next.add(articleId);
      return next;
    });
    setArticleLikeCounts(prev => ({
      ...prev,
      [articleId]: (prev[articleId] || 0) + (was ? -1 : 1),
    }));
    if (was) {
      supabase.from("article_likes").delete().eq("user_id", user.id).eq("article_id", articleId).then();
    } else {
      supabase.from("article_likes").insert({ user_id: user.id, article_id: articleId }).then();
    }
  }, [user, articleLikes]);

  const isArticleLiked = useCallback((id: string) => articleLikes.has(id), [articleLikes]);
  const getArticleLikeCount = useCallback((id: string) => articleLikeCounts[id] ?? 0, [articleLikeCounts]);

  const loadArticleLikeCounts = useCallback(async (articleIds: string[]) => {
    if (!articleIds.length) return;
    const counts: Record<string, number> = {};
    for (const id of articleIds) {
      const { count } = await supabase
        .from("article_likes")
        .select("id", { count: "exact", head: true })
        .eq("article_id", id);
      counts[id] = count || 0;
    }
    setArticleLikeCounts(prev => ({ ...prev, ...counts }));
  }, []);

  return (
    <FavoritesContext.Provider value={{
      favorites, toggleFavorite, isFavorite, ratings, setRating, getRating,
      requireAuth, articleLikes, toggleArticleLike, isArticleLiked,
      getArticleLikeCount, articleLikeCounts, loadArticleLikeCounts, favoritesList,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};
