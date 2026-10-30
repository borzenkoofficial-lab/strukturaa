import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const INTRO_SEEN_KEY = "skol-intro-seen";

const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const { t } = useLanguage();
  const completedRef = useRef(false);
  const [progress, setProgress] = useState(0);

  const safeComplete = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      onComplete();
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_SEEN_KEY)) {
      safeComplete();
      return;
    }
    // Smooth progress
    const start = performance.now();
    const duration = 1800;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(safeComplete, 200);
    };
    requestAnimationFrame(tick);
  }, []);

  if (sessionStorage.getItem(INTRO_SEEN_KEY)) return null;

  return (
    <motion.div
      key="cinematic-intro"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "hsl(var(--background))", willChange: "opacity" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* Radial pulse */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)" }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.2], opacity: [0, 0.6, 0] }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* Official SKOL wordmark */}
      <motion.div
        className="relative flex w-full items-center justify-center px-8"
        initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src="/skol-logo.png" alt="СКОЛ" className="h-auto w-full max-w-[min(72vw,520px)] invert dark:invert-0" width="969" height="159" fetchPriority="high" />
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="relative mt-4 text-muted-foreground text-sm sm:text-base md:text-lg font-body tracking-wide text-center px-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {t("intro.tagline")}
      </motion.p>

      {/* Progress bar */}
      <div className="relative mt-8 w-48 h-1 bg-border/20 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))",
            boxShadow: "0 0 12px hsl(var(--primary) / 0.5)",
          }}
        />
      </div>

      {/* Corner accents */}
      <motion.div
        className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-primary/30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      <motion.div
        className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-primary/30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
    </motion.div>
  );
};

export default CinematicIntro;
