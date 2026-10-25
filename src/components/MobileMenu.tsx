import { X, Home, Briefcase, FolderOpen, Users, Phone, Newspaper, BookOpen } from "lucide-react";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  icon: typeof Home;
  labelKey: TranslationKey;
  path: string;
}

const menuItems: MenuItem[] = [
  { icon: Home, labelKey: "menu.home", path: "/" },
  { icon: Briefcase, labelKey: "nav.services", path: "/services" },
  { icon: FolderOpen, labelKey: "nav.projects", path: "/projects" },
  { icon: BookOpen, labelKey: "nav.blog", path: "/blog" },
  { icon: Newspaper, labelKey: "nav.news", path: "/news" },
  { icon: Users, labelKey: "nav.about", path: "/about" },
  { icon: Phone, labelKey: "nav.contacts", path: "/contacts" },
];

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const goTo = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Закрыть меню"
        className="skol-mobile-backdrop absolute inset-0 bg-background/75"
        onClick={onClose}
      />
      <aside
        id="skol-mobile-menu"
        aria-label="Мобильная навигация"
        className="skol-mobile-menu absolute inset-y-0 right-0 z-[95] flex w-full max-w-sm flex-col overflow-y-auto border-l border-border bg-card p-5 sm:p-6"
      >
        <div className="mb-7 flex items-center justify-between border-b border-border pb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">СКОЛ / НАВИГАЦИЯ</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-foreground">{t("menu.title")}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть меню"
            className="flex h-10 w-10 items-center justify-center border border-border text-secondary-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="grid grid-cols-1 gap-1.5">
          {menuItems.map((item, index) => (
            <button
              type="button"
              key={item.path}
              onClick={() => goTo(item.path)}
              className="group flex min-h-14 items-center gap-4 border-b border-border/70 px-3 py-3 text-left transition-colors hover:border-primary/60 hover:bg-secondary/40"
            >
              <span className="w-7 font-mono text-[11px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-border/70 text-primary transition-colors group-hover:border-primary/50">
                <item.icon className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <span className="flex-1 text-sm font-medium text-foreground">{t(item.labelKey)}</span>
              <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary">↗</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-border pt-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Москва и Московская область</p>
          <button
            type="button"
            onClick={() => goTo("/contacts")}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-105"
          >
            Обсудить объект
          </button>
        </div>
      </aside>
    </div>
  );
};

export default MobileMenu;
