import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, FileText, Image, Users, Settings, LogOut,
  ChevronLeft, Menu, ArrowLeft, CircleDot, FolderOpen, Briefcase,
  HardHat, ShoppingBag, ClipboardList, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navGroups = [
  {
    label: "Обзор",
    items: [
      { label: "Дашборд", path: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Контент",
    items: [
      { label: "Статьи", path: "/admin/articles", icon: FileText },
      { label: "Категории", path: "/admin/categories", icon: FolderOpen },
      { label: "Истории", path: "/admin/stories", icon: CircleDot },
      { label: "Медиа", path: "/admin/media", icon: Image },
    ],
  },
  {
    label: "Бизнес",
    items: [
      { label: "Биржа заявок", path: "/admin/listings", icon: Briefcase },
      { label: "Маркетплейс", path: "/admin/shop", icon: ShoppingBag },
      { label: "Проекты", path: "/admin/projects", icon: HardHat },
      { label: "Лиды с сайта", path: "/admin/requests", icon: ClipboardList },
    ],
  },
  {
    label: "Система",
    items: [
      { label: "Пользователи", path: "/admin/users", icon: Users },
      { label: "Настройки", path: "/admin/settings", icon: Settings },
    ],
  },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, profile, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-display font-bold text-sm text-foreground">STRUKTURA</span>
              <span className="block text-[10px] text-muted-foreground -mt-0.5">Admin Panel</span>
            </div>
          )}
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 p-2 overflow-y-auto space-y-4">
        {navGroups.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t border-border/20 space-y-0.5">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Мой кабинет</span>}
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Выйти</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <motion.aside
        className="hidden md:flex flex-col border-r border-border/20 bg-card/60 backdrop-blur-xl shrink-0"
        animate={{ width: collapsed ? 64 : 230 }}
        transition={{ duration: 0.25 }}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2.5 border-t border-border/20 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-60 bg-card border-r border-border/20 z-50 md:hidden"
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 border-b border-border/20 flex items-center px-4 gap-3 bg-card/30 backdrop-blur-sm">
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setMobileOpen(true)}>
            <Menu className="w-4 h-4" />
          </Button>
          <div className="flex-1" />
          <Badge variant="outline" className="text-[10px] hidden sm:flex">
            <Shield className="w-3 h-3 mr-1" />Admin
          </Badge>
          <span className="text-xs text-muted-foreground">{profile?.display_name || "Админ"}</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
