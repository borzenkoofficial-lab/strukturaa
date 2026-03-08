import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, FileText, Image, Users, Settings, LogOut,
  ChevronLeft, Menu, ArrowLeft, CircleDot, FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Главная", path: "/admin", icon: LayoutDashboard },
  { label: "Истории", path: "/admin/stories", icon: CircleDot },
  { label: "Статьи", path: "/admin/articles", icon: FileText },
  { label: "Категории", path: "/admin/categories", icon: FolderOpen },
  { label: "Медиа", path: "/admin/media", icon: Image },
  { label: "Пользователи", path: "/admin/users", icon: Users },
  { label: "Настройки", path: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-sm text-primary-foreground">S</span>
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-foreground">Админ</span>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/30 space-y-1">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Мой кабинет</span>}
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Выйти</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background gradient-dark flex">
      <motion.aside
        className="hidden md:flex flex-col border-r border-border/30 bg-card/40 backdrop-blur-xl shrink-0"
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3 }}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-3 border-t border-border/30 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border/30 z-50 md:hidden"
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border/30 flex items-center px-4 gap-4 bg-card/20 backdrop-blur-sm">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex-1" />
          <span className="text-sm text-muted-foreground">{profile?.display_name || "Админ"}</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
