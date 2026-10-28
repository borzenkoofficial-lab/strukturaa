import { motion, useReducedMotion } from "framer-motion";

type ParticleShape = "dot" | "ring" | "square";

type FloatingParticle = {
  left: string;
  top: string;
  delay: number;
  duration: number;
  size: number;
  driftX: number;
  driftY: number;
  shape: ParticleShape;
  opacity: number;
};

const particles: FloatingParticle[] = [
  { left: "4%", top: "12%", delay: 0, duration: 21, size: 3, driftX: 30, driftY: 34, shape: "dot", opacity: .28 },
  { left: "9%", top: "35%", delay: 2.4, duration: 27, size: 2, driftX: -26, driftY: 45, shape: "ring", opacity: .3 },
  { left: "13%", top: "68%", delay: 4.2, duration: 23, size: 4, driftX: 32, driftY: 28, shape: "dot", opacity: .22 },
  { left: "18%", top: "18%", delay: 1.3, duration: 30, size: 2, driftX: 18, driftY: 58, shape: "square", opacity: .26 },
  { left: "22%", top: "48%", delay: 6.1, duration: 24, size: 3, driftX: -34, driftY: 32, shape: "dot", opacity: .25 },
  { left: "27%", top: "84%", delay: 3.1, duration: 29, size: 2, driftX: 25, driftY: 42, shape: "ring", opacity: .3 },
  { left: "31%", top: "27%", delay: 5.3, duration: 22, size: 4, driftX: -22, driftY: 36, shape: "dot", opacity: .18 },
  { left: "36%", top: "61%", delay: .7, duration: 31, size: 2, driftX: 38, driftY: 52, shape: "square", opacity: .27 },
  { left: "40%", top: "9%", delay: 7.1, duration: 25, size: 3, driftX: -28, driftY: 40, shape: "dot", opacity: .24 },
  { left: "45%", top: "41%", delay: 2.7, duration: 28, size: 2, driftX: 23, driftY: 46, shape: "ring", opacity: .28 },
  { left: "49%", top: "76%", delay: 5.9, duration: 22, size: 3, driftX: -32, driftY: 36, shape: "dot", opacity: .2 },
  { left: "54%", top: "20%", delay: 3.6, duration: 32, size: 2, driftX: 31, driftY: 48, shape: "square", opacity: .25 },
  { left: "58%", top: "54%", delay: 1.8, duration: 26, size: 4, driftX: -20, driftY: 32, shape: "dot", opacity: .22 },
  { left: "62%", top: "89%", delay: 8.3, duration: 30, size: 2, driftX: 36, driftY: 54, shape: "ring", opacity: .26 },
  { left: "67%", top: "32%", delay: .4, duration: 23, size: 3, driftX: -30, driftY: 40, shape: "dot", opacity: .28 },
  { left: "71%", top: "66%", delay: 4.9, duration: 27, size: 2, driftX: 22, driftY: 48, shape: "square", opacity: .24 },
  { left: "75%", top: "13%", delay: 6.8, duration: 24, size: 4, driftX: -35, driftY: 35, shape: "dot", opacity: .2 },
  { left: "80%", top: "46%", delay: 2.1, duration: 31, size: 2, driftX: 28, driftY: 52, shape: "ring", opacity: .29 },
  { left: "84%", top: "80%", delay: 7.6, duration: 25, size: 3, driftX: -24, driftY: 38, shape: "dot", opacity: .23 },
  { left: "89%", top: "25%", delay: 3.9, duration: 29, size: 2, driftX: 34, driftY: 47, shape: "square", opacity: .26 },
  { left: "94%", top: "59%", delay: 5.1, duration: 22, size: 3, driftX: -27, driftY: 32, shape: "dot", opacity: .2 },
  { left: "7%", top: "91%", delay: 9.1, duration: 32, size: 2, driftX: 18, driftY: 44, shape: "ring", opacity: .22 },
  { left: "33%", top: "4%", delay: 8.6, duration: 27, size: 3, driftX: -21, driftY: 39, shape: "dot", opacity: .2 },
  { left: "57%", top: "39%", delay: 10.2, duration: 25, size: 2, driftX: 30, driftY: 42, shape: "square", opacity: .25 },
  { left: "73%", top: "93%", delay: 6.5, duration: 28, size: 3, driftX: -19, driftY: 50, shape: "dot", opacity: .18 },
  { left: "97%", top: "8%", delay: 1.1, duration: 33, size: 2, driftX: -31, driftY: 45, shape: "ring", opacity: .25 },
];

const SakuraAtmosphere = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="skol-site-atmosphere pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground) / .035) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / .035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, black, transparent 94%)",
        }}
      />
      <div className="absolute -right-40 top-24 h-[26rem] w-[26rem] rounded-full border border-primary/[0.10] sm:h-[36rem] sm:w-[36rem]" />
      <div className="absolute -right-16 top-48 h-[18rem] w-[18rem] rounded-full border border-primary/[0.08] sm:h-[26rem] sm:w-[26rem]" />
      <div className="absolute left-[-13rem] top-[42%] h-[24rem] w-[24rem] rounded-full border border-foreground/[0.035]" />
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_78%_10%,hsl(var(--primary)/0.10),transparent_58%)]" />

      {particles.map((particle, index) => {
        const shapeClass =
          particle.shape === "ring"
            ? "border border-primary/45 bg-transparent"
            : particle.shape === "square"
              ? "rounded-[1px] bg-foreground/35"
              : "rounded-full bg-primary/45 shadow-[0_0_10px_1px_hsl(var(--primary)/0.13)]";

        return (
          <motion.span
            key={index}
            className={`skol-floating-particle absolute block ${shapeClass}`}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
            }}
            animate={
              reduceMotion
                ? { opacity: particle.opacity * 0.65 }
                : {
                    x: [0, particle.driftX, particle.driftX * -0.45, 0],
                    y: [0, -particle.driftY, particle.driftY * 0.35, 0],
                    rotate: particle.shape === "square" ? [0, 45, 110, 180] : [0, 60, 150, 240],
                    scale: [0.72, 1.12, 0.88, 0.72],
                    opacity: [particle.opacity * 0.25, particle.opacity, particle.opacity * 0.55, particle.opacity * 0.2],
                  }
            }
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

export default SakuraAtmosphere;
