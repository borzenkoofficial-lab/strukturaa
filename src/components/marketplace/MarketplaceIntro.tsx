import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Briefcase } from "lucide-react";

const INTRO_KEY = "struktura-marketplace-intro";

const MarketplaceIntro = ({ onComplete }: { onComplete: () => void }) => {
  const completedRef = useRef(false);
  const [progress, setProgress] = useState(0);

  const safeComplete = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      sessionStorage.setItem(INTRO_KEY, "1");
      onComplete();
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_KEY)) { safeComplete(); return; }
    const start = performance.now();
    const duration = 1500;
    const tick = () => {
      const p = Math.min((performance.now() - start) / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(safeComplete, 200);
    };
    requestAnimationFrame(tick);
  }, []);

  if (sessionStorage.getItem(INTRO_KEY)) return null;

  return (
    <motion.div
      key="marketplace-intro"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "hsl(var(--background))", willChange: "opacity" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Hex grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: "30px 30px",
      }} />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.12), transparent 60%)" }}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: [0.3, 1.5], opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />

      <motion.div
        className="relative flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Briefcase className="w-7 h-7 text-primary-foreground" />
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground tracking-tight">
            Биржа заказов
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Подрядчики и заказы в один клик
          </p>
        </motion.div>
      </motion.div>

      {/* Progress */}
      <div className="relative mt-8 w-40 h-1 bg-border/20 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-none"
          style={{
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.5))",
            boxShadow: "0 0 10px hsl(var(--primary) / 0.4)",
          }}
        />
      </div>
    </motion.div>
  );
};

export default MarketplaceIntro;
