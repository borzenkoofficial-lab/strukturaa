import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface SearchItem {
  title: string;
  desc: string;
  path: string;
  category: string;
}

const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const items: SearchItem[] = useMemo(() => [
    { title: t("services.demolition"), desc: t("services.demolitionDesc"), path: "/services", category: t("nav.services") },
    { title: t("services.construction"), desc: t("services.constructionDesc"), path: "/services", category: t("nav.services") },
    { title: t("services.renovation"), desc: t("services.renovationDesc"), path: "/services", category: t("nav.services") },
    { title: t("services.apartmentDemo"), desc: t("services.apartmentDemoDesc"), path: "/services", category: t("nav.services") },
    { title: t("services.buildingDemo"), desc: t("services.buildingDemoDesc"), path: "/services", category: t("nav.services") },
    { title: t("services.wasteRemoval"), desc: t("services.wasteRemovalDesc"), path: "/services", category: t("nav.services") },
    { title: t("services.dismantling"), desc: t("services.dismantlingDesc"), path: "/services", category: t("nav.services") },
    { title: t("services.concrete"), desc: t("services.concreteDesc"), path: "/services", category: t("nav.services") },
    { title: t("nav.about"), desc: t("about.subtitle"), path: "/about", category: t("nav.about") },
    { title: t("nav.contacts"), desc: t("contacts.subtitle"), path: "/contacts", category: t("nav.contacts") },
    { title: t("nav.projects"), desc: t("projects.subtitle"), path: "/projects", category: t("nav.projects") },
    { title: t("nav.news"), desc: t("news.1.title"), path: "/news", category: t("nav.news") },
  ], [t, lang]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items.slice(0, 6);
    const q = query.toLowerCase();
    return items.filter(i => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
  }, [query, items]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="skol-search-backdrop fixed inset-0 z-[90] bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="skol-search-window fixed top-0 left-0 right-0 z-[95] max-w-2xl mx-auto mt-20 p-4"
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="glass-card p-2 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t("search.placeholder")}
                  className="flex-1 bg-transparent text-foreground text-lg font-medium placeholder:text-muted-foreground focus:outline-none"
                />
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="border-t border-border/30 mt-1 pt-2 max-h-80 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">{t("search.noResults")}</p>
                ) : (
                  filtered.map((item, i) => (
                    <motion.button
                      key={item.title + item.path}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors text-left group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => handleSelect(item.path)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0 px-2 py-1 rounded-md bg-secondary/50">
                        {item.category}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
