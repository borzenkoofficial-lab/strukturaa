import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, User } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: AppRole[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const { toast } = useToast();

  const fetchUsers = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url, created_at")
      .order("created_at", { ascending: false });

    if (!profiles) return;

    const { data: roles } = await supabase.from("user_roles").select("user_id, role");

    const usersWithRoles: UserProfile[] = profiles.map((p) => ({
      ...p,
      roles: (roles || []).filter((r) => r.user_id === p.user_id).map((r) => r.role),
    }));

    setUsers(usersWithRoles);
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

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Управление пользователями</h1>

      <div className="glass-card overflow-hidden">
        {users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Пользователи не найдены</div>
        ) : (
          <div className="divide-y divide-border/20">
            {users.map((u) => (
              <div key={u.user_id} className="p-4 flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={u.avatar_url || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {(u.display_name || "U").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{u.display_name || "Аноним"}</div>
                  <div className="text-xs text-muted-foreground">
                    Регистрация: {new Date(u.created_at).toLocaleDateString("ru-RU")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {u.roles.map((r) => (
                    <span
                      key={r}
                      className={`text-xs px-2 py-1 rounded-full ${
                        r === "admin" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {r === "admin" ? <Shield className="w-3 h-3 inline mr-1" /> : <User className="w-3 h-3 inline mr-1" />}
                      {r === "admin" ? "Админ" : "Пользователь"}
                    </span>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRole(u.user_id, u.roles)}
                  >
                    {u.roles.includes("admin") ? "Снять админа" : "Сделать админом"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
