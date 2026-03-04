import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"logo" | "tagline" | "reveal">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 1200);
    const t2 = setTimeout(() => setPhase("reveal"), 2800);
    const t3 = setTimeout(() => onComplete(), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "reveal" ? null : (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}
      <motion.div
        className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={phase === "reveal" ? { opacity: 0, scale: 1.1 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => {
          if (phase === "reveal") onComplete();
        }}
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(35 80% 55% / 0.15), transparent 70%)" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Horizontal lines */}
        <motion.div
          className="absolute top-1/2 left-0 right-0 h-px bg-border/50"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        />

        {/* Logo */}
        <motion.div
          className="relative flex items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center"
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-display font-bold text-3xl text-primary-foreground">S</span>
          </motion.div>
          <motion.span
            className="font-display font-bold text-4xl md:text-5xl text-foreground tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            STRUKTURA
          </motion.span>
        </motion.div>

        {/* Tagline */}
        <AnimatePresence>
          {(phase === "tagline" || phase === "reveal") && (
            <motion.p
              className="relative mt-6 text-muted-foreground text-lg md:text-xl font-body tracking-wide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Строим будущее. Разбираем прошлое.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Loading bar */}
        <motion.div
          className="relative mt-10 w-48 h-0.5 bg-border/30 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>

        {/* Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 3) * 15}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -30, -60],
            }}
            transition={{
              duration: 2,
              delay: 0.8 + i * 0.2,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default CinematicIntro;
