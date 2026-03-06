import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Briefcase, FolderOpen, Users, Phone, Newspaper, Heart, Search } from "lucide-react";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";

interface RippleState { x: number; y: number; id: number; }

const menuItems: { icon: typeof Home; labelKey: TranslationKey; path: string }[] = [
  { icon: Home, labelKey: "menu.home", path: "/" },
  { icon: Briefcase, labelKey: "nav.services", path: "/services" },
  { icon: FolderOpen, labelKey: "nav.projects", path: "/projects" },
  { icon: Newspaper, labelKey: "nav.news", path: "/news" },
  { icon: Users, labelKey: "nav.about", path: "/about" },
  { icon: Phone, labelKey: "nav.contacts", path: "/contacts" },
];

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [ripples, setRipples] = useState<Record<number, RippleState>>({});

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>, path: string, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => ({ ...prev, [index]: { x, y, id } }));
    
    setTimeout(() => {
      navigate(path);
      onClose();
    }, 400);
  }, [navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 right-0 z-[95] w-full max-w-sm bg-card border-l border-border p-6 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-bold text-foreground">{t("menu.title")}</h2>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  className="glass-card-hover p-5 flex flex-col items-center gap-3 cursor-pointer relative overflow-hidden select-none"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.06, type: "spring", damping: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleClick(e, item.path, i)}
                >
                  {/* Ripple effect */}
                  <AnimatePresence>
                    {ripples[i] && (
                      <motion.span
                        key={ripples[i].id}
                        className="absolute rounded-full bg-primary/30 pointer-events-none"
                        style={{ left: ripples[i].x, top: ripples[i].y, width: 10, height: 10, marginLeft: -5, marginTop: -5 }}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 30, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        onAnimationComplete={() => setRipples(prev => { const n = { ...prev }; delete n[i]; return n; })}
                      />
                    )}
                  </AnimatePresence>
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground text-center">{t(item.labelKey)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
