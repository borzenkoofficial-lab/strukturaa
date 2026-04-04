import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Shield, User, Search, Trash2, ShieldCheck, MoreVertical, UserX,
  ShieldAlert, Wallet, MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub,
  DropdownMenuSubTrigger, DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  roles: AppRole[];
  balance: number;
  messagesCount: number;
  listingsCount: number;
}

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  admin: { label: "Админ", color: "bg-primary text-primary-foreground", icon: Shield },
  moderator: { label: "Модератор", color: "bg-blue-500/20 text-blue-400", icon: ShieldAlert },
  user: { label: "Пользователь", color: "bg-secondary text-secondary-foreground", icon: User },
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const [profilesRes, rolesRes, walletsRes, messagesRes, listingsRes] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, avatar_url, bio, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("wallets").select("user_id, balance"),
      supabase.from("messages").select("sender_id"),
      supabase.from("listings").select("user_id"),
    ]);

    const profiles = profilesRes.data || [];
    const roles = rolesRes.data || [];
    const wallets = walletsRes.data || [];
    const messages = messagesRes.data || [];
    const listings = listingsRes.data || [];

    const usersWithData: UserProfile[] = profiles.map((p) => ({
      ...p,
      roles: roles.filter(r => r.user_id === p.user_id).map(r => r.role),
      balance: Number(wallets.find(w => w.user_id === p.user_id)?.balance || 0),
      messagesCount: messages.filter(m => m.sender_id === p.user_id).length,
      listingsCount: listings.filter(l => l.user_id === p.user_id).length,
    }));

    setUsers(usersWithData);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const setRole = async (userId: string, newRole: AppRole) => {
    // Remove existing non-user roles
    await supabase.from("user_roles").delete().eq("user_id", userId).neq("role", "user");

    if (newRole !== "user") {
      await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    }

    toast({ title: `Роль изменена на "${ROLE_CONFIG[newRole]?.label}"` });
    fetchUsers();
  };

  const deleteUser = async (userId: string, displayName: string | null) => {
    if (!confirm(`Удалить пользователя "${displayName || "Аноним"}"? Это действие необратимо.`)) return;
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("user_id", userId);
    toast({ title: "Пользователь удалён" });
    fetchUsers();
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = !search || (u.display_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" ||
      (filterRole === "admin" && u.roles.includes("admin")) ||
      (filterRole === "moderator" && u.roles.includes("moderator" as AppRole)) ||
      (filterRole === "user" && !u.roles.includes("admin") && !u.roles.includes("moderator" as AppRole));
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter(u => u.roles.includes("admin")).length;
  const modCount = users.filter(u => u.roles.includes("moderator" as AppRole)).length;
  const userCount = users.length - adminCount - modCount;

  const getHighestRole = (roles: AppRole[]): AppRole => {
    if (roles.includes("admin")) return "admin";
    if (roles.includes("moderator" as AppRole)) return "moderator" as AppRole;
    return "user";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Пользователи</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Всего {users.length} · Админов {adminCount} · Модераторов {modCount} · Пользователей {userCount}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Всего", value: users.length, color: "text-foreground" },
          { label: "Админы", value: adminCount, color: "text-primary" },
          { label: "Модераторы", value: modCount, color: "text-blue-400" },
          { label: "Пользователи", value: userCount, color: "text-muted-foreground" },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border/30 rounded-xl p-4 text-center">
            <div className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени..." className="pl-10" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[
            { key: "all", label: "Все" },
            { key: "admin", label: "Админы" },
            { key: "moderator", label: "Модераторы" },
            { key: "user", label: "Пользователи" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterRole(f.key)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                filterRole === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users table-style */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 rounded-xl bg-card animate-pulse" />)}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-card border border-border/30 rounded-xl p-12 text-center">
          <UserX className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Пользователи не найдены</p>
        </div>
      ) : (
        <div className="bg-card border border-border/30 rounded-xl overflow-hidden divide-y divide-border/20">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_100px_100px_80px_80px_40px] gap-4 px-5 py-3 text-[11px] text-muted-foreground uppercase font-medium bg-secondary/30">
            <span>Пользователь</span>
            <span>Роль</span>
            <span>Баланс</span>
            <span>Заявки</span>
            <span>Чаты</span>
            <span></span>
          </div>

          {filteredUsers.map((u, i) => {
            const role = getHighestRole(u.roles);
            const roleCfg = ROLE_CONFIG[role] || ROLE_CONFIG.user;
            const RoleIcon = roleCfg.icon;

            return (
              <motion.div
                key={u.user_id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px_80px_80px_40px] gap-2 sm:gap-4 px-5 py-3 items-center hover:bg-secondary/20 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9 border border-border/30">
                    <AvatarImage src={u.avatar_url || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {(u.display_name || "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{u.display_name || "Аноним"}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                </div>

                <div>
                  <Badge className={`text-[10px] ${roleCfg.color} border-0`}>
                    <RoleIcon className="w-3 h-3 mr-1" />
                    {roleCfg.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 text-sm text-foreground">
                  <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
                  {u.balance.toLocaleString()} ₽
                </div>

                <div className="text-sm text-muted-foreground">{u.listingsCount}</div>
                <div className="text-sm text-muted-foreground">{u.messagesCount}</div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Shield className="w-4 h-4 mr-2" />Изменить роль
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {(["admin", "moderator", "user"] as AppRole[]).map(r => (
                          <DropdownMenuItem key={r} onClick={() => setRole(u.user_id, r)} disabled={role === r}>
                            {ROLE_CONFIG[r]?.label || r}
                            {role === r && " ✓"}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => deleteUser(u.user_id, u.display_name)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
