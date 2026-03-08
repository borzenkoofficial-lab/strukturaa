import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, MapPin, Calendar, RussianRuble, Send, MessageCircle, User, Pencil, Trash2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Listing } from "@/pages/MarketplacePage";

interface Response {
  id: string;
  user_id: string;
  price: number;
  message: string | null;
  created_at: string;
  profile?: { display_name: string | null };
}

interface Props {
  listing: Listing;
  onClose: () => void;
  onChat: (receiverId: string) => void;
  onRefresh: () => void;
}

const ListingDetail = ({ listing, onClose, onChat, onRefresh }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState<Response[]>([]);
  const [showRespond, setShowRespond] = useState(false);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ownerName, setOwnerName] = useState<string>("Заказчик");
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(listing.title);
  const [editDescription, setEditDescription] = useState(listing.description);
  const [editBudgetMin, setEditBudgetMin] = useState(listing.budget_min?.toString() || "");
  const [editBudgetMax, setEditBudgetMax] = useState(listing.budget_max?.toString() || "");
  const [editAddress, setEditAddress] = useState(listing.address || "");
  const [editDeadline, setEditDeadline] = useState(listing.deadline || "");

  useEffect(() => {
    loadResponses();
    loadOwner();
    trackView();
  }, [listing.id]);

  const trackView = async () => {
    await supabase.from("listing_views").insert({
      listing_id: listing.id,
      viewer_id: user?.id || null,
    });
  };

  const loadOwner = async () => {
    const { data } = await supabase.from("profiles").select("display_name").eq("user_id", listing.user_id).maybeSingle();
    if (data?.display_name) setOwnerName(data.display_name);
  };

  const loadResponses = async () => {
    const { data } = await supabase
      .from("listing_responses")
      .select("*")
      .eq("listing_id", listing.id)
      .order("created_at", { ascending: true });
    
    if (data) {
      const withProfiles = await Promise.all(
        data.map(async (r) => {
          const { data: profile } = await supabase.from("profiles").select("display_name").eq("user_id", r.user_id).maybeSingle();
          return { ...r, profile: profile || undefined };
        })
      );
      setResponses(withProfiles);
    }
  };

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !price) return;
    setSubmitting(true);
    const { error } = await supabase.from("listing_responses").insert({
      listing_id: listing.id,
      user_id: user.id,
      price: Number(price),
      message: message.trim() || null,
    });
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Отклик отправлен!" });
      setShowRespond(false);
      setPrice("");
      setMessage("");
      loadResponses();
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm("Удалить эту заявку? Это действие нельзя отменить.")) return;
    const { error } = await supabase.from("listings").delete().eq("id", listing.id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Заявка удалена" });
      onClose();
      onRefresh();
    }
  };

  const handleDeactivate = async () => {
    const newStatus = listing.status === "active" ? "closed" : "active";
    const { error } = await supabase.from("listings").update({ status: newStatus }).eq("id", listing.id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: newStatus === "closed" ? "Заявка снята" : "Заявка активирована" });
      onClose();
      onRefresh();
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      toast({ title: "Заполните название и описание", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("listings").update({
      title: editTitle.trim(),
      description: editDescription.trim(),
      budget_min: editBudgetMin ? Number(editBudgetMin) : null,
      budget_max: editBudgetMax ? Number(editBudgetMax) : null,
      address: editAddress.trim() || null,
      deadline: editDeadline || null,
    }).eq("id", listing.id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Заявка обновлена" });
      setEditing(false);
      onClose();
      onRefresh();
    }
    setSubmitting(false);
  };

  const isOwner = user?.id === listing.user_id;
  const budget = listing.budget_min || listing.budget_max
    ? `${listing.budget_min ? listing.budget_min.toLocaleString() : "?"} – ${listing.budget_max ? listing.budget_max.toLocaleString() : "?"} ₽`
    : null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-2xl bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border/30">
          <div className="flex-1 pr-4 min-w-0">
            {editing ? (
              <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="rounded-xl font-semibold" placeholder="Название" />
            ) : (
              <>
                <h2 className="font-display font-bold text-lg text-foreground break-words">{listing.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">от {ownerName}</p>
              </>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary transition-colors shrink-0">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Описание *</label>
                <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className="rounded-xl" rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Бюджет от, ₽</label>
                  <Input type="number" value={editBudgetMin} onChange={e => setEditBudgetMin(e.target.value)} className="rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Бюджет до, ₽</label>
                  <Input type="number" value={editBudgetMax} onChange={e => setEditBudgetMax(e.target.value)} className="rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Адрес</label>
                <Input value={editAddress} onChange={e => setEditAddress(e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Срок до</label>
                <Input type="date" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} className="rounded-xl" />
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-foreground whitespace-pre-wrap break-words">{listing.description}</p>

              <div className="flex flex-wrap gap-3">
                {budget && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-sm">
                    <RussianRuble className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">{budget}</span>
                  </div>
                )}
                {listing.address && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {listing.address}
                  </div>
                )}
                {listing.deadline && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    до {new Date(listing.deadline).toLocaleDateString("ru-RU")}
                  </div>
                )}
              </div>

              {/* Responses */}
              {(isOwner || responses.length > 0) && (
                <div className="mt-6">
                  <h3 className="font-display font-semibold text-foreground mb-3">
                    Отклики ({responses.length})
                  </h3>
                  <div className="space-y-3">
                    {responses.map(r => (
                      <div key={r.id} className="p-4 rounded-xl bg-secondary/50 border border-border/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{r.profile?.display_name || "Пользователь"}</span>
                          </div>
                          <span className="text-sm font-bold text-primary">{r.price.toLocaleString()} ₽</span>
                        </div>
                        {r.message && <p className="text-xs text-muted-foreground">{r.message}</p>}
                        {isOwner && user && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 rounded-xl text-xs gap-1"
                            onClick={() => onChat(r.user_id)}
                          >
                            <MessageCircle className="w-3 h-3" />
                            Написать
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Respond form */}
              {showRespond && !isOwner && user && (
                <form onSubmit={handleRespond} className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border/30">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Ваша цена, ₽ *</label>
                    <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="150 000" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Комментарий</label>
                    <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Расскажите о вашем опыте..." className="rounded-xl" rows={3} maxLength={1000} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="rounded-xl" disabled={submitting}>
                      <Send className="w-4 h-4 mr-1" />
                      {submitting ? "..." : "Отправить"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setShowRespond(false)} className="rounded-xl">
                      Отмена
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/30 flex flex-wrap gap-2">
          {isOwner && editing && (
            <>
              <Button onClick={handleSaveEdit} className="flex-1 rounded-xl gap-2" disabled={submitting}>
                {submitting ? "Сохранение..." : "Сохранить"}
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)} className="rounded-xl">
                Отмена
              </Button>
            </>
          )}
          {isOwner && !editing && (
            <>
              <Button onClick={() => setEditing(true)} variant="outline" className="rounded-xl gap-2">
                <Pencil className="w-4 h-4" />
                Редактировать
              </Button>
              <Button onClick={handleDeactivate} variant="outline" className="rounded-xl gap-2">
                <XCircle className="w-4 h-4" />
                {listing.status === "active" ? "Снять" : "Активировать"}
              </Button>
              <Button onClick={handleDelete} variant="destructive" className="rounded-xl gap-2">
                <Trash2 className="w-4 h-4" />
                Удалить
              </Button>
            </>
          )}
          {!isOwner && user && !showRespond && !editing && (
            <>
              <Button onClick={() => setShowRespond(true)} className="flex-1 rounded-xl gap-2">
                <Send className="w-4 h-4" />
                Откликнуться
              </Button>
              <Button variant="outline" onClick={() => onChat(listing.user_id)} className="rounded-xl gap-2">
                <MessageCircle className="w-4 h-4" />
                Чат
              </Button>
            </>
          )}
          {!user && (
            <p className="text-sm text-muted-foreground text-center w-full">
              <a href="/auth" className="text-primary hover:underline">Войдите</a>, чтобы откликнуться
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ListingDetail;
