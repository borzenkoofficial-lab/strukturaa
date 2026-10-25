import { Search, Menu, Sun, Moon, Globe, User, ChevronLeft, ArrowUpRight } from "lucide-react";
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
    { label: t("nav.news"), path: "/news" },
    { label: t("nav.about"), path: "/about" },
    { label: t("nav.contacts"), path: "/contacts" },
  ];

  return (
    <>
      <header
        className="skol-site-header w-full pt-[max(0.65rem,env(safe-area-inset-top))] pb-2.5 sm:pt-[max(0.85rem,env(safe-area-inset-top))] sm:pb-3 px-4 sm:px-6 sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/30"
       
       
       
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile back button */}
            {!isHome && (
              <button
                className="lg:hidden p-2 text-secondary-foreground"
                onClick={() => navigate(-1)}
               
               
               
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer"
             
              onClick={() => navigate("/")}
            >
              <div className="skol-brand-mark w-8 h-8 sm:w-9 sm:h-9 rounded-sm border border-primary/70 bg-transparent flex items-center justify-center" aria-hidden="true">
                <span className="skol-monogram font-display font-semibold text-sm sm:text-base text-foreground">С</span>
                <i className="skol-mark-cut" />
              </div>
              <span className="font-display font-semibold text-base sm:text-lg text-foreground tracking-[0.18em]">СКОЛ</span>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 cursor-pointer" onClick={() => setSearchOpen(true)}>
            <div className="glass-card flex items-center w-full px-4 py-2.5 gap-2 hover:bg-card/80 transition-colors">
              <span className="text-sm text-muted-foreground">{t("header.search")}</span>
              <Search className="w-4 h-4 text-muted-foreground ml-auto" />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, i) => (
              <button
                key={item.path}
                className={`skol-nav-link px-3 xl:px-4 py-2 text-[12px] font-medium tracking-wide transition-colors ${location.pathname === item.path || location.pathname.startsWith(item.path + "/") ? "text-foreground is-active" : "text-secondary-foreground hover:text-foreground"}`}
               
               
               
               
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 text-secondary-foreground"
             
             
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setLang(lang === "ru" ? "en" : "ru")}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 border border-border/70 text-secondary-foreground text-xs font-semibold uppercase transition-colors hover:border-primary/50"
             
             
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === "ru" ? "EN" : "RU"}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 text-secondary-foreground transition-colors hover:text-foreground"
             
             
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <button
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold"
               
               
                onClick={() => navigate("/dashboard")}
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">{t("header.dashboard")}</span>
              </button>
            ) : (
              <button
                className="skol-header-cta hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold"
               
                onClick={() => navigate("/contacts")}
              >
                <span>Обсудить объект</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            )}

            <button
              className="lg:hidden p-2 text-secondary-foreground"
              onClick={() => setMenuOpen(true)}
             
             
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
