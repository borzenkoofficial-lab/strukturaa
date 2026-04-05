import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const INTRO_SEEN_KEY = "struktura-intro-seen";

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

      {/* Logo block */}
      <motion.div
        className="relative flex items-center gap-3"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-display font-bold text-2xl sm:text-3xl text-primary-foreground">S</span>
        </motion.div>
        <motion.span
          className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tighter"
          initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          STRUKTURA
        </motion.span>
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
