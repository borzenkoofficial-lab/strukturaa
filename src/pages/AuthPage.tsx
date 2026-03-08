import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Building2, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Mode = "login" | "signup" | "reset";

const floatingCards = [
  { icon: Building2, label: "500+ объектов", x: "8%", y: "18%", delay: 0 },
  { icon: Shield, label: "Гарантия 3 года", x: "75%", y: "12%", delay: 0.3 },
  { icon: Zap, label: "30 мин отклик", x: "5%", y: "72%", delay: 0.6 },
];

const AuthPage = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/dashboard");
      } else if (mode === "signup") {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        toast({ title: "Аккаунт создан!", description: "Проверьте почту для подтверждения регистрации." });
        navigate("/dashboard");
      } else {
        const { error } = await resetPassword(email);
        if (error) throw error;
        toast({ title: "Письмо отправлено", description: "Проверьте почту для сброса пароля." });
        setMode("login");
      }
    } catch (err: any) {
      toast({ title: "Ошибка", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-dark" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[100px]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Left side - branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12">
        {/* Floating cards */}
        {floatingCards.map((card, i) => (
          <motion.div
            key={i}
            className="absolute glass-card px-4 py-3 flex items-center gap-3 pointer-events-none"
            style={{ left: card.x, top: card.y }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8 + card.delay, duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <card.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">{card.label}</span>
          </motion.div>
        ))}

        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Logo */}
          <motion.div
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
          >
            <span className="font-display font-bold text-4xl text-primary-foreground">S</span>
          </motion.div>
          
          <h2 className="font-display text-4xl font-bold text-foreground mb-3">STRUKTURA</h2>
          <p className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed">
            Профессиональный демонтаж, строительство и ремонт с гарантией качества
          </p>

          {/* Stats row */}
          <motion.div
            className="flex items-center justify-center gap-6 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {[
              { value: "500+", label: "Проектов" },
              { value: "50+", label: "Техники" },
              { value: "3", label: "Года гарантии" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            На главную
          </button>

          <div className="glass-card p-8 sm:p-10 border border-border/50 shadow-2xl shadow-background/50">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="font-display font-bold text-lg text-primary-foreground">S</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">STRUKTURA</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1.5">
                  {mode === "login" ? "С возвращением" : mode === "signup" ? "Создать аккаунт" : "Сброс пароля"}
                </h1>
                <p className="text-muted-foreground text-sm mb-8">
                  {mode === "login"
                    ? "Войдите, чтобы управлять заказами и избранным"
                    : mode === "signup"
                    ? "Зарегистрируйтесь для доступа ко всем функциям"
                    : "Введите email для получения ссылки сброса"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">Имя</Label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="name"
                          placeholder="Ваше имя"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-11 h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:bg-secondary/80 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">Электронная почта</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-11 h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:bg-secondary/80 transition-all"
                      />
                    </div>
                  </div>

                  {mode !== "reset" && (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground/80 text-xs font-semibold uppercase tracking-wider">Пароль</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Минимум 6 символов"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="pl-11 pr-11 h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary/50 focus:bg-secondary/80 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {mode === "login" && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setMode("reset")}
                        className="text-sm text-primary hover:underline hover:text-primary/80 transition-colors"
                      >
                        Забыли пароль?
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : mode === "login"
                    ? "Войти"
                    : mode === "signup"
                    ? "Зарегистрироваться"
                    : "Отправить ссылку"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-7">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/30" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-3 text-xs text-muted-foreground">или</span>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  {mode === "login" ? (
                    <>
                      Нет аккаунта?{" "}
                      <button onClick={() => setMode("signup")} className="text-primary hover:underline font-semibold">
                        Зарегистрироваться
                      </button>
                    </>
                  ) : (
                    <>
                      Уже есть аккаунт?{" "}
                      <button onClick={() => setMode("login")} className="text-primary hover:underline font-semibold">
                        Войти
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-center text-[10px] text-muted-foreground/50 mt-6">
            Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
