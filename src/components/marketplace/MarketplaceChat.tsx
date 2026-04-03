import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Send, User, MessageCircle, ArrowLeft, Check, CheckCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface ChatThread {
  partnerId: string;
  partnerName: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  listing_id: string | null;
}

interface Props {
  initialPartnerId?: string | null;
}

const MarketplaceChat = ({ initialPartnerId }: Props) => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEnd = useRef<HTMLDivElement>(null);
  const selectedPartnerRef = useRef<string | null>(null);

  // Keep ref in sync
  useEffect(() => { selectedPartnerRef.current = selectedPartner; }, [selectedPartner]);

  const loadThreads = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!data) return;

    const partnerMap = new Map<string, { lastMsg: Message; unread: number }>();
    for (const msg of data) {
      const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!partnerMap.has(partnerId)) {
        partnerMap.set(partnerId, { lastMsg: msg as Message, unread: 0 });
      }
      if (msg.receiver_id === user.id && !msg.read) {
        partnerMap.get(partnerId)!.unread++;
      }
    }

    const partnerIds = Array.from(partnerMap.keys());
    if (partnerIds.length === 0) { setThreads([]); return; }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", partnerIds);

    const profileMap = new Map<string, string>();
    profiles?.forEach(p => profileMap.set(p.user_id, p.display_name || "Пользователь"));

    const threadList: ChatThread[] = partnerIds.map(id => {
      const entry = partnerMap.get(id)!;
      return {
        partnerId: id,
        partnerName: profileMap.get(id) || "Пользователь",
        lastMessage: entry.lastMsg.content,
        lastAt: entry.lastMsg.created_at,
        unread: entry.unread,
      };
    });
    setThreads(threadList);
  }, [user]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!user) return;
    loadThreads();

    const channel = supabase
      .channel("marketplace-chat-" + user.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id !== user.id && msg.receiver_id !== user.id) return;

        const currentPartner = selectedPartnerRef.current;
        if (currentPartner && (msg.sender_id === currentPartner || msg.receiver_id === currentPartner)) {
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          // Auto mark as read
          if (msg.sender_id === currentPartner && msg.receiver_id === user.id) {
            supabase.from("messages").update({ read: true }).eq("id", msg.id).then();
          }
        }
        loadThreads();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, loadThreads]);

  // Auto-open initial partner
  useEffect(() => {
    if (initialPartnerId && user) {
      openChat(initialPartnerId);
    }
  }, [initialPartnerId, user]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = async (partnerId: string) => {
    if (!user) return;
    setSelectedPartner(partnerId);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) || []);

    // Mark as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("sender_id", partnerId)
      .eq("receiver_id", user.id)
      .eq("read", false);

    loadThreads();
  };

  const sendMessage = async () => {
    if (!user || !selectedPartner || !input.trim()) return;
    const content = input.trim();
    setInput("");

    // Optimistic add
    const optimisticMsg: Message = {
      id: "temp-" + Date.now(),
      sender_id: user.id,
      receiver_id: selectedPartner,
      content,
      read: false,
      created_at: new Date().toISOString(),
      listing_id: null,
    };
    setMessages(prev => [...prev, optimisticMsg]);

    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedPartner,
      content,
    });
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "сейчас";
    if (mins < 60) return `${mins}м`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}ч`;
    return `${Math.floor(hours / 24)}д`;
  };

  if (!user) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Войдите, чтобы просматривать сообщения</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[75vh]">
      {/* Threads */}
      <div className={`${selectedPartner ? "hidden md:flex" : "flex"} w-full md:w-80 md:shrink-0 bg-card rounded-2xl border border-border/50 overflow-hidden flex-col`}>
        <div className="p-4 border-b border-border/30">
          <h3 className="font-display font-semibold text-foreground">Диалоги</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">{threads.length} {threads.length === 1 ? "чат" : "чатов"}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Нет сообщений</p>
              <p className="text-xs text-muted-foreground mt-1">Откликнитесь на заявку, чтобы начать чат</p>
            </div>
          ) : (
            <AnimatePresence>
              {threads.map((t, i) => (
                <motion.button
                  key={t.partnerId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => openChat(t.partnerId)}
                  className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors border-b border-border/10 ${
                    selectedPartner === t.partnerId ? "bg-secondary" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      {t.unread > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                          {t.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground truncate">{t.partnerName}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{timeAgo(t.lastAt)}</span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${t.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {t.lastMessage}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Chat */}
      <div className={`${!selectedPartner ? "hidden md:flex" : "flex"} flex-1 bg-card rounded-2xl border border-border/50 overflow-hidden flex-col min-w-0`}>
        {!selectedPartner ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <MessageCircle className="w-16 h-16 opacity-10" />
            <p className="text-sm">Выберите диалог</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 p-3 border-b border-border/30 bg-card/80 backdrop-blur-sm">
              <button
                onClick={() => setSelectedPartner(null)}
                className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center shrink-0 md:hidden hover:bg-secondary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
              </button>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {threads.find(t => t.partnerId === selectedPartner)?.partnerName || "Диалог"}
                </p>
                <p className="text-[10px] text-muted-foreground">в сети</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Начните переписку — напишите первое сообщение
                </div>
              )}
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm break-words ${
                    msg.sender_id === user.id
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  }`}>
                    {msg.content}
                    <div className={`flex items-center gap-1 justify-end mt-1 ${msg.sender_id === user.id ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                      <span className="text-[10px]">
                        {new Date(msg.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {msg.sender_id === user.id && (
                        msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEnd} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/30 flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Сообщение..."
                className="rounded-xl"
                autoFocus
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketplaceChat;
