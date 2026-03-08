import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Send, Phone, MessageCircle, User, Wrench, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { ShopItem } from "@/pages/ShopPage";

const CONDITION_LABELS: Record<string, string> = {
  new: "Новый",
  like_new: "Как новый",
  used_good: "Б/У хорошее",
  used_fair: "Б/У среднее",
};

const CATEGORY_LABELS: Record<string, string> = {
  power_tools: "Электроинструмент",
  hand_tools: "Ручной инструмент",
  measurement: "Измерительные",
  safety: "Защита и СИЗ",
  consumables: "Расходники",
  other: "Другое",
};

const CONDITION_COLORS: Record<string, string> = {
  new: "bg-primary/15 text-primary",
  like_new: "bg-accent/15 text-accent",
  used_good: "bg-secondary text-secondary-foreground",
  used_fair: "bg-destructive/15 text-destructive",
};

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  listing_id: string | null;
}

interface Props {
  item: ShopItem;
  onClose: () => void;
}

const ShopItemDetail = ({ item, onClose }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sellerName, setSellerName] = useState("Продавец");
  const [sharePhone, setSharePhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const messagesEnd = useRef<HTMLDivElement>(null);

  const isOwner = user?.id === item.user_id;
  const hasPhotos = item.photos && item.photos.length > 0;

  useEffect(() => {
    // Load seller profile
    supabase.from("profiles").select("display_name").eq("user_id", item.user_id).maybeSingle()
      .then(({ data }) => {
        if (data?.display_name) setSellerName(data.display_name);
      });
  }, [item.user_id]);

  useEffect(() => {
    if (!showChat || !user) return;
    loadMessages();

    const channel = supabase
      .channel(`shop-chat-${item.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (
          (msg.sender_id === user.id && msg.receiver_id === item.user_id) ||
          (msg.sender_id === item.user_id && msg.receiver_id === user.id)
        ) {
          setMessages(prev => [...prev, msg]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [showChat, user]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${item.user_id}),and(sender_id.eq.${item.user_id},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) || []);

    // Mark as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("sender_id", item.user_id)
      .eq("receiver_id", user.id)
      .eq("read", false);
  };

  const sendMessage = async (content?: string) => {
    const text = content || input.trim();
    if (!user || !text) return;
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: item.user_id,
      content: text,
      listing_id: null,
    });
    setInput("");

    // Notify seller via Telegram
    try {
      const profileRes = await supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle();
      const senderName = profileRes.data?.display_name || user.email || "Покупатель";
      await supabase.functions.invoke("notify-shop-message", {
        body: {
          receiver_id: item.user_id,
          sender_name: senderName,
          content: text,
          item_title: item.title,
        },
      });
    } catch (e) {
      console.error("Notification error:", e);
    }
  };

  const handleSharePhone = () => {
    if (!phoneInput.trim()) return;
    sendMessage(`📞 Мой номер: ${phoneInput.trim()}`);
    setSharePhone(false);
    setPhoneInput("");
    toast({ title: "Номер отправлен продавцу" });
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "только что";
    if (hours < 24) return `${hours}ч назад`;
    const days = Math.floor(hours / 24);
    return `${days}д назад`;
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-3xl bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-background/70 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Two-column layout: photo left, info right */}
        <div className="flex flex-col sm:flex-row flex-1 min-h-0">
          {/* Left — Photos */}
          <div className="relative sm:w-[45%] shrink-0 bg-secondary/50 aspect-[4/3] sm:aspect-auto sm:min-h-[320px]">
            {hasPhotos ? (
              <>
                <img
                  src={item.photos[photoIndex]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setPhotoIndex(i => (i - 1 + item.photos.length) % item.photos.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/70 backdrop-blur flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPhotoIndex(i => (i + 1) % item.photos.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/70 backdrop-blur flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {item.photos.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === photoIndex ? "bg-primary scale-125" : "bg-background/60"}`} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center min-h-[200px]">
                <Wrench className="w-16 h-16 text-muted-foreground/20" />
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Price & title */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${CONDITION_COLORS[item.condition] || "bg-secondary text-secondary-foreground"}`}>
                    {CONDITION_LABELS[item.condition] || item.condition}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[item.category] || item.category}
                  </span>
                  <span className="text-xs text-muted-foreground">• {timeAgo(item.created_at)}</span>
                </div>
                <p className="text-2xl font-bold text-primary font-display">
                  {item.price.toLocaleString()} ₽
                </p>
                <h2 className="text-lg font-display font-semibold text-foreground mt-1 leading-snug break-words">
                  {item.title}
                </h2>
              </div>

              {/* Description */}
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                {item.description || "Описание не указано"}
              </div>

              {/* Seller */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{sellerName}</p>
                  <p className="text-xs text-muted-foreground">Продавец</p>
                </div>
              </div>

              {/* Chat section */}
              <AnimatePresence>
                {showChat && user && !isOwner && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-display font-semibold text-foreground">Чат с продавцом</h3>
                        <button
                          onClick={() => setSharePhone(true)}
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Отправить номер
                        </button>
                      </div>

                      {/* Phone share */}
                      <AnimatePresence>
                        {sharePhone && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex gap-2 overflow-hidden"
                          >
                            <Input
                              value={phoneInput}
                              onChange={e => setPhoneInput(e.target.value)}
                              placeholder="+7 (___) ___-__-__"
                              className="rounded-xl text-sm"
                              type="tel"
                            />
                            <Button onClick={handleSharePhone} size="sm" className="rounded-xl shrink-0">
                              Отправить
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Messages */}
                      <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl bg-secondary/30 p-3">
                        {messages.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-4">
                            Начните переписку с продавцом
                          </p>
                        ) : (
                          messages.map(msg => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
                            >
                              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs break-words ${
                                msg.sender_id === user.id
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-card text-foreground rounded-bl-md border border-border/30"
                              }`}>
                                {msg.content}
                                <div className={`text-[9px] mt-0.5 ${msg.sender_id === user.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                                  {new Date(msg.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={messagesEnd} />
                      </div>

                      {/* Input */}
                      <div className="flex gap-2">
                        <Input
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && sendMessage()}
                          placeholder="Написать продавцу..."
                          className="rounded-xl text-sm"
                        />
                        <button
                          onClick={() => sendMessage()}
                          disabled={!input.trim()}
                          className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom actions */}
            {!isOwner && (
              <div className="p-4 border-t border-border/30 flex gap-2 shrink-0">
                <Button
                  onClick={() => {
                    if (!user) {
                      toast({ title: "Войдите, чтобы написать продавцу", variant: "destructive" });
                      return;
                    }
                    setShowChat(prev => !prev);
                  }}
                  variant={showChat ? "secondary" : "default"}
                  className="flex-1 rounded-xl gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {showChat ? "Скрыть чат" : "Написать продавцу"}
                </Button>
                <Button
                  onClick={() => {
                    if (!user) {
                      toast({ title: "Войдите, чтобы поделиться номером", variant: "destructive" });
                      return;
                    }
                    setShowChat(true);
                    setTimeout(() => setSharePhone(true), 200);
                  }}
                  variant="outline"
                  className="rounded-xl gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Позвонить
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShopItemDetail;
