import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const INTRO_SEEN_KEY = "struktura-intro-seen";

const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"logo" | "tagline" | "reveal">("logo");
  const { t } = useLanguage();
  const completedRef = useRef(false);

  const safeComplete = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      onComplete();
    }
  };

  useEffect(() => {
    // Skip intro if already seen in this session
    if (sessionStorage.getItem(INTRO_SEEN_KEY)) {
      safeComplete();
      return;
    }

    const t1 = setTimeout(() => setPhase("tagline"), 800);
    const t2 = setTimeout(() => setPhase("reveal"), 1800);
    const t3 = setTimeout(safeComplete, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // If already seen, render nothing
  if (sessionStorage.getItem(INTRO_SEEN_KEY)) return null;

  return (
    <motion.div
      key="cinematic-intro"
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={phase === "reveal" ? { opacity: 0, scale: 1.05 } : { opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (phase === "reveal") safeComplete();
      }}
    >
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-0 animate-[fadeIn_1.5s_ease-out_forwards]"
        style={{ background: "radial-gradient(circle, hsl(35 80% 55% / 0.15), transparent 70%)", transform: "scale(1.5)" }}
      />
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-px bg-border/50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="relative flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary flex items-center justify-center"
          initial={{ rotate: -90, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-display font-bold text-2xl sm:text-3xl text-primary-foreground">S</span>
        </motion.div>
        <motion.span
          className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
        >
          STRUKTURA
        </motion.span>
      </motion.div>
      <AnimatePresence>
        {(phase === "tagline" || phase === "reveal") && (
          <motion.p
            key="tagline"
            className="relative mt-5 text-muted-foreground text-base sm:text-lg md:text-xl font-body tracking-wide px-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {t("intro.tagline")}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.div
        className="relative mt-8 w-40 sm:w-48 h-0.5 bg-border/30 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </motion.div>
  );
};

export default CinematicIntro;
