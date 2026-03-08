import { motion } from "framer-motion";
import { Search, Menu, Sun, Moon, Globe, User, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems: { label: string; path: string }[] = [
    { label: t("nav.services"), path: "/services" },
    { label: t("nav.projects"), path: "/projects" },
    { label: t("nav.marketplace"), path: "/marketplace" },
    { label: t("nav.blog"), path: "/blog" },
    { label: t("nav.about"), path: "/about" },
    { label: t("nav.contacts"), path: "/contacts" },
  ];

  return (
    <>
      <motion.header
        className="w-full pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:pt-[max(1rem,env(safe-area-inset-top))] sm:pb-4 px-4 sm:px-6 sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile back button */}
            {!isHome && (
              <motion.button
                className="lg:hidden p-2 rounded-xl bg-secondary text-secondary-foreground"
                onClick={() => navigate(-1)}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            )}
            <motion.div
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate("/")}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-xs sm:text-sm text-primary-foreground">S</span>
              </div>
              <span className="font-display font-bold text-base sm:text-lg text-foreground tracking-tight">STRUKTURA</span>
            </motion.div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 cursor-pointer" onClick={() => setSearchOpen(true)}>
            <div className="glass-card flex items-center w-full px-4 py-2.5 gap-2 hover:bg-card/80 transition-colors">
              <span className="text-sm text-muted-foreground">{t("header.search")}</span>
              <Search className="w-4 h-4 text-muted-foreground ml-auto" />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, i) => (
              <motion.button
                key={item.path}
                className="px-3 xl:px-4 py-2 rounded-xl text-sm font-medium text-secondary-foreground hover:bg-secondary transition-colors"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                whileHover={{ y: -2 }}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <motion.button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-xl bg-secondary text-secondary-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={() => setLang(lang === "ru" ? "en" : "ru")}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold uppercase"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === "ru" ? "EN" : "RU"}</span>
            </motion.button>

            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-secondary text-secondary-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {user ? (
              <motion.button
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard")}
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">{t("header.dashboard")}</span>
              </motion.button>
            ) : (
              <motion.button
                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t("header.signIn")}</span>
              </motion.button>
            )}

            <motion.button
              className="lg:hidden p-2 rounded-xl bg-secondary text-secondary-foreground"
              onClick={() => setMenuOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
