import { useState } from "react";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";

const categories: { key: TranslationKey; slug: string }[] = [
  { key: "cat.demolition", slug: "demolition" },
  { key: "cat.construction", slug: "construction" },
  { key: "cat.renovation", slug: "renovation" },
  { key: "cat.facades", slug: "dismantling" },
  { key: "cat.roofing", slug: "building-demolition" },
  { key: "cat.foundation", slug: "diamond-cutting" },
  { key: "cat.electrical", slug: "waste-removal" },
  { key: "cat.apartments", slug: "apartment-demolition" },
  { key: "cat.buildings", slug: "building-demolition" },
];

const CategoryPills = () => {
  const [active, setActive] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Set<number>>(new Set([0]));
  const { t } = useLanguage();
  const navigate = useNavigate();

  const toggleFilter = (i: number) => {
    setSelectedFilters(prev => {
      const next = new Set(prev);
      if (next.has(i)) {
        if (next.size > 1) next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
        <motion.button
          className="p-2 sm:p-2.5 rounded-xl bg-secondary text-secondary-foreground shrink-0 relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {selectedFilters.size > 1 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
              {selectedFilters.size}
            </span>
          )}
        </motion.button>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {categories.map((cat, i) => (
            <button
              key={cat.key}
              onClick={() => { setActive(i); navigate(`/services/${cat.slug}`); }}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                active === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {t(cat.key)}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {filterOpen && (
          <motion.div
            className="absolute left-4 sm:left-6 right-4 sm:right-6 top-full z-30 mt-2 glass-card p-4 sm:p-5"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground text-sm">{t("filter.title")}</h3>
              <motion.button
                onClick={() => setFilterOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5 text-secondary-foreground" />
              </motion.button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.key}
                  onClick={() => toggleFilter(i)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    selectedFilters.has(i)
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-secondary text-secondary-foreground border border-transparent hover:bg-secondary/80"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {selectedFilters.has(i) && <Check className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate">{t(cat.key)}</span>
                </motion.button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <motion.button
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilterOpen(false)}
              >
                {t("filter.apply")}
              </motion.button>
              <motion.button
                className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelectedFilters(new Set([0])); setFilterOpen(false); }}
              >
                {t("filter.reset")}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryPills;
