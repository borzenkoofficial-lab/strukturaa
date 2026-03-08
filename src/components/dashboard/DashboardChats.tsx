import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, ArrowLeft, User, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatPartner {
  user_id: string;
  display_name: string;
  last_message: string;
  last_time: string;
  unread: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

const DashboardChats = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadChats();

    const channel = supabase
      .channel("dashboard-msgs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id === user.id || msg.receiver_id === user.id) {
          if (activeChat && (msg.sender_id === activeChat || msg.receiver_id === activeChat)) {
            setMessages(prev => [...prev, msg]);
          }
          loadChats();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, activeChat]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChats = async () => {
    if (!user) return;
    setLoading(true);

    // Get all messages where user is sender or receiver
    const { data: allMessages } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!allMessages || allMessages.length === 0) {
      setChats([]);
      setLoading(false);
      return;
    }

    // Group by partner
    const partnerMap = new Map<string, { last_message: string; last_time: string; unread: number }>();
    for (const msg of allMessages) {
      const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!partnerMap.has(partnerId)) {
        partnerMap.set(partnerId, {
          last_message: msg.content,
          last_time: msg.created_at,
          unread: 0,
        });
      }
      if (msg.receiver_id === user.id && !msg.read) {
        const entry = partnerMap.get(partnerId)!;
        entry.unread++;
      }
    }

    // Load partner profiles
    const partnerIds = Array.from(partnerMap.keys());
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", partnerIds);

    const profileMap = new Map<string, string>();
    profiles?.forEach(p => profileMap.set(p.user_id, p.display_name || "Пользователь"));

    const chatList: ChatPartner[] = partnerIds.map(id => ({
      user_id: id,
      display_name: profileMap.get(id) || "Пользователь",
      ...partnerMap.get(id)!,
    }));

    chatList.sort((a, b) => new Date(b.last_time).getTime() - new Date(a.last_time).getTime());
    setChats(chatList);
    setLoading(false);
  };

  const openChat = async (partnerId: string, name: string) => {
    setActiveChat(partnerId);
    setPartnerName(name);

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user!.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user!.id})`)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) || []);

    // Mark as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("sender_id", partnerId)
      .eq("receiver_id", user!.id)
      .eq("read", false);

    loadChats();
  };

  const sendMessage = async () => {
    if (!user || !activeChat || !input.trim()) return;
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: activeChat,
      content: input.trim(),
    });
    setInput("");
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "сейчас";
    if (mins < 60) return `${mins}м`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}ч`;
    const days = Math.floor(hours / 24);
    return `${days}д`;
  };

  if (!user) return null;

  // Active conversation view
  if (activeChat) {
    return (
      <motion.div
        className="glass-card overflow-hidden flex flex-col"
        style={{ height: "500px" }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border/30">
          <button
            onClick={() => setActiveChat(null)}
            className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-display">
              {partnerName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">{partnerName}</p>
            <p className="text-[10px] text-muted-foreground">Диалог</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Начните переписку
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm break-words ${
                  msg.sender_id === user.id
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border/30 text-foreground rounded-bl-md"
                }`}>
                  {msg.content}
                  <div className={`text-[9px] mt-1 ${
                    msg.sender_id === user.id ? "text-primary-foreground/50" : "text-muted-foreground"
                  }`}>
                    {new Date(msg.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border/30 flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Написать сообщение..."
            className="rounded-xl text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  // Chat list view
  return (
    <div className="space-y-3">
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      ) : chats.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">У вас пока нет сообщений</p>
          <p className="text-xs text-muted-foreground mt-1">
            Напишите продавцу в маркетплейсе или на бирже
          </p>
        </div>
      ) : (
        <AnimatePresence>
          {chats.map((chat, i) => (
            <motion.div
              key={chat.user_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => openChat(chat.user_id, chat.display_name)}
              className="glass-card p-4 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors group"
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-display">
                    {chat.display_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {chat.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-semibold text-foreground truncate">{chat.display_name}</p>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0 ml-2">
                    <Clock className="w-3 h-3" />
                    {timeAgo(chat.last_time)}
                  </span>
                </div>
                <p className={`text-xs truncate ${chat.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {chat.last_message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default DashboardChats;
