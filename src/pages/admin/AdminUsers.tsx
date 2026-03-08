import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Search, Trash2, Ban, ShieldCheck, MoreVertical, UserX, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url, bio, created_at")
      .order("created_at", { ascending: false });

    if (!profiles) { setLoading(false); return; }

    const { data: roles } = await supabase.from("user_roles").select("user_id, role");

    const usersWithRoles: UserProfile[] = profiles.map((p) => ({
      ...p,
      roles: (roles || []).filter((r) => r.user_id === p.user_id).map((r) => r.role),
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (userId: string, currentRoles: AppRole[]) => {
    const isAdmin = currentRoles.includes("admin");

    if (isAdmin) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    }

    toast({ title: isAdmin ? "Роль администратора снята" : "Роль администратора назначена" });
    fetchUsers();
  };

  const deleteUser = async (userId: string, displayName: string | null) => {
    if (!confirm(`Удалить пользователя "${displayName || "Аноним"}"? Это действие необратимо.`)) return;

    // Delete profile and roles (cascading from auth would handle the rest)
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("user_id", userId);

    toast({ title: "Пользователь удалён" });
    fetchUsers();
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = !search || 
      (u.display_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || 
      (filterRole === "admin" && u.roles.includes("admin")) ||
      (filterRole === "user" && !u.roles.includes("admin"));
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter(u => u.roles.includes("admin")).length;
  const userCount = users.filter(u => !u.roles.includes("admin")).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Пользователи</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Всего {users.length} · Админов {adminCount} · Пользователей {userCount}
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Всего", value: users.length, color: "text-foreground" },
          { label: "Админы", value: adminCount, color: "text-primary" },
          { label: "Пользователи", value: userCount, color: "text-muted-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <div className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: "all", label: "Все" },
            { key: "admin", label: "Админы" },
            { key: "user", label: "Пользователи" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterRole(f.key)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
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

      {/* Users grid as tiles */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-40 rounded-2xl bg-card animate-pulse" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <UserX className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">Пользователи не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((u, i) => (
            <motion.div
              key={u.user_id}
              className="glass-card p-5 relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12 border-2 border-border/30">
                  <AvatarImage src={u.avatar_url || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {(u.display_name || "U").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate">
                    {u.display_name || "Аноним"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(u.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  {u.bio && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{u.bio}</p>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toggleRole(u.user_id, u.roles)}>
                      {u.roles.includes("admin") ? (
                        <><ShieldCheck className="w-4 h-4 mr-2" />Снять админа</>
                      ) : (
                        <><Shield className="w-4 h-4 mr-2" />Сделать админом</>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => deleteUser(u.user_id, u.display_name)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить пользователя
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex gap-1.5 mt-3">
                {u.roles.map((r) => (
                  <Badge
                    key={r}
                    variant={r === "admin" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {r === "admin" ? (
                      <><Shield className="w-3 h-3 mr-1" />Админ</>
                    ) : (
                      <><User className="w-3 h-3 mr-1" />Пользователь</>
                    )}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
