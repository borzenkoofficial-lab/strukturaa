import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Wrench } from "lucide-react";

const ShopIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"logo" | "tagline" | "reveal">("logo");
  const completedRef = useRef(false);

  const safeComplete = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 1000);
    const t2 = setTimeout(() => setPhase("reveal"), 2400);
    const t3 = setTimeout(safeComplete, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div
      key="shop-intro"
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={phase === "reveal" ? { opacity: 0, scale: 1.05 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (phase === "reveal") safeComplete();
      }}
    >
      {/* Glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-0 animate-[fadeIn_1.5s_ease-out_forwards]"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.12), transparent 70%)" }}
      />

      {/* Line */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-px bg-border/40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Logo */}
      <motion.div
        className="relative flex items-center gap-3"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center"
          initial={{ rotate: -90, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-display font-bold text-2xl text-primary-foreground">S</span>
        </motion.div>
        <motion.span
          className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        >
          STRUKTURA
        </motion.span>
      </motion.div>

      {/* Tagline */}
      <AnimatePresence>
        {(phase === "tagline" || phase === "reveal") && (
          <motion.div
            key="tagline"
            className="relative mt-6 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 text-primary">
              <Wrench className="w-5 h-5" />
              <span className="font-display font-semibold text-lg md:text-xl tracking-wide">
                Магазин инструментов
              </span>
            </div>
            <p className="text-muted-foreground text-sm md:text-base text-center max-w-xs">
              Покупайте и продавайте строительный инструмент
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <motion.div
        className="relative mt-8 w-40 h-0.5 bg-border/30 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ShopIntro;
