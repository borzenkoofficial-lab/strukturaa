import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Send, User, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

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

const MarketplaceChat = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadThreads();

    const channel = supabase
      .channel("user-messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id === user.id || msg.receiver_id === user.id) {
          if (selectedPartner && (msg.sender_id === selectedPartner || msg.receiver_id === selectedPartner)) {
            setMessages(prev => [...prev, msg]);
          }
          loadThreads();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, selectedPartner]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadThreads = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!data) return;

    const partnerMap = new Map<string, { messages: Message[] }>();
    for (const msg of data) {
      const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!partnerMap.has(partnerId)) partnerMap.set(partnerId, { messages: [] });
      partnerMap.get(partnerId)!.messages.push(msg);
    }

    const threadList: ChatThread[] = [];
    for (const [partnerId, { messages: msgs }] of partnerMap) {
      const { data: profile } = await supabase.from("profiles").select("display_name").eq("user_id", partnerId).maybeSingle();
      const last = msgs[0];
      const unread = msgs.filter(m => m.receiver_id === user.id && !m.read).length;
      threadList.push({
        partnerId,
        partnerName: profile?.display_name || "Пользователь",
        lastMessage: last.content,
        lastAt: last.created_at,
        unread,
      });
    }
    setThreads(threadList);
  };

  const loadMessages = async (partnerId: string) => {
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
  };

  const sendMessage = async () => {
    if (!user || !selectedPartner || !input.trim()) return;
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedPartner,
      content: input.trim(),
    });
    setInput("");
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
    <div className="flex flex-col md:flex-row gap-4 h-[70vh]">
      {/* Threads - full width on mobile, fixed on desktop */}
      <div className={`${selectedPartner ? "hidden md:flex" : "flex"} w-full md:w-80 md:shrink-0 bg-card rounded-2xl border border-border/50 overflow-hidden flex-col`}>
        <div className="p-4 border-b border-border/30">
          <h3 className="font-display font-semibold text-foreground">Диалоги</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">Нет сообщений</p>
          ) : (
            threads.map(t => (
              <button
                key={t.partnerId}
                onClick={() => loadMessages(t.partnerId)}
                className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors border-b border-border/10 ${
                  selectedPartner === t.partnerId ? "bg-secondary" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground truncate">{t.partnerName}</span>
                      {t.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold shrink-0">
                          {t.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{t.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat - full width on mobile, flex on desktop */}
      <div className={`${!selectedPartner ? "hidden md:flex" : "flex"} flex-1 bg-card rounded-2xl border border-border/50 overflow-hidden flex-col min-w-0`}>
        {!selectedPartner ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Выберите диалог
          </div>
        ) : (
          <>
            {/* Mobile back button */}
            <div className="flex items-center gap-3 p-3 border-b border-border/30 md:hidden">
              <button
                onClick={() => setSelectedPartner(null)}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0"
              >
                <MessageCircle className="w-4 h-4 text-secondary-foreground" />
              </button>
              <span className="text-sm font-medium text-foreground truncate">
                {threads.find(t => t.partnerId === selectedPartner)?.partnerName || "Диалог"}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm break-words ${
                    msg.sender_id === user.id
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  }`}>
                    {msg.content}
                    <div className={`text-[10px] mt-1 ${msg.sender_id === user.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {new Date(msg.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEnd} />
            </div>
            <div className="p-3 border-t border-border/30 flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Сообщение..."
                className="rounded-xl"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-50"
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
