import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (id: string) => boolean; // returns new state
  isFavorite: (id: string) => boolean;
  ratings: Record<string, number>;
  setRating: (id: string, rating: number) => void;
  getRating: (id: string) => number;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("struktura-favs");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("struktura-ratings");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const toggleFavorite = useCallback((id: string) => {
    let added = false;
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); added = false; }
      else { next.add(id); added = true; }
      localStorage.setItem("struktura-favs", JSON.stringify([...next]));
      return next;
    });
    return added;
  }, []);

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  const setRating = useCallback((id: string, rating: number) => {
    setRatings(prev => {
      const next = { ...prev, [id]: rating };
      localStorage.setItem("struktura-ratings", JSON.stringify(next));
      return next;
    });
  }, []);

  const getRating = useCallback((id: string) => ratings[id] ?? 0, [ratings]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, ratings, setRating, getRating }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};
