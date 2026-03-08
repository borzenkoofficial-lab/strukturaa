import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, Briefcase, Trash2, Calendar, MapPin, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ContactRequest {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  service: string | null;
  calculated_price: number | null;
  source: string;
  created_at: string;
}

const AdminRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests((data as ContactRequest[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("contact_requests").delete().eq("id", id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Удалено" });
      fetchRequests();
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("ru-RU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const sourceLabel: Record<string, string> = {
    service_page: "Страница услуги",
    contacts_page: "Контакты",
    cta: "CTA",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Заявки с сайта</h1>
          <p className="text-sm text-muted-foreground">{requests.length} заявок</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Заявок пока нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {requests.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card rounded-xl border border-border/50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-semibold text-foreground">{req.name}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {sourceLabel[req.source] || req.source}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                      <a href={`tel:${req.phone}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                        {req.phone}
                      </a>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(req.created_at)}
                      </span>
                    </div>

                    {req.service && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {req.service}
                        {req.calculated_price && (
                          <span className="ml-2 text-primary font-medium">
                            {Number(req.calculated_price).toLocaleString("ru-RU")} ₽
                          </span>
                        )}
                      </div>
                    )}

                    {req.message && (
                      <p className="text-sm text-muted-foreground mt-2 bg-secondary/50 rounded-lg p-2">
                        {req.message}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(req.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
