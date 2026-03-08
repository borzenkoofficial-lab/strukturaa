import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Download, Share, MoreVertical, Plus, ArrowLeft, Smartphone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPage = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <>
      <SEOHead title="Установить приложение — STRUKTURA" description="Установите STRUKTURA на домашний экран для быстрого доступа." canonical="/install" />
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/30">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <motion.button
              onClick={() => navigate("/")}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 text-secondary-foreground" />
            </motion.button>
            <h1 className="font-display font-bold text-lg text-foreground">Установить</h1>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm w-full text-center space-y-8"
          >
            <div className="mx-auto w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
              {isInstalled ? (
                <Check className="w-12 h-12 text-primary" />
              ) : (
                <Smartphone className="w-12 h-12 text-primary" />
              )}
            </div>

            {isInstalled ? (
              <div className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-foreground">Приложение установлено!</h2>
                <p className="text-muted-foreground text-sm">STRUKTURA уже на вашем домашнем экране.</p>
                <Button onClick={() => navigate("/")} className="rounded-xl mt-4">На главную</Button>
              </div>
            ) : deferredPrompt ? (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">Установить STRUKTURA</h2>
                <p className="text-muted-foreground text-sm">Быстрый доступ с домашнего экрана, работа без интернета и мгновенная загрузка.</p>
                <Button onClick={handleInstall} size="lg" className="rounded-xl gap-2 w-full">
                  <Download className="w-5 h-5" />
                  Установить приложение
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-foreground">Установить STRUKTURA</h2>
                <p className="text-muted-foreground text-sm">Добавьте приложение на домашний экран для быстрого доступа.</p>

                {isIOS ? (
                  <div className="bg-card rounded-2xl p-5 text-left space-y-4 border border-border/50">
                    <p className="font-semibold text-sm text-foreground">Для iPhone / iPad:</p>
                    <div className="space-y-3">
                      {[
                        { icon: Share, text: 'Нажмите кнопку «Поделиться»' },
                        { icon: Plus, text: 'Выберите «На экран Домой»' },
                        { icon: Check, text: 'Нажмите «Добавить»' },
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <step.icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm text-foreground">{step.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl p-5 text-left space-y-4 border border-border/50">
                    <p className="font-semibold text-sm text-foreground">Для Android:</p>
                    <div className="space-y-3">
                      {[
                        { icon: MoreVertical, text: 'Откройте меню браузера (⋮)' },
                        { icon: Download, text: '«Установить приложение» или «Добавить на главный экран»' },
                        { icon: Check, text: 'Подтвердите установку' },
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <step.icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm text-foreground">{step.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default InstallPage;
