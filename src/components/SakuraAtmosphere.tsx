import { motion, useReducedMotion } from "framer-motion";

const petals = [
  { left: "5%", top: "8%", delay: 0, duration: 18, size: 0.8 },
  { left: "16%", top: "24%", delay: 2.2, duration: 21, size: 1 },
  { left: "29%", top: "13%", delay: 4.1, duration: 19, size: 0.65 },
  { left: "41%", top: "37%", delay: 1.1, duration: 23, size: 0.85 },
  { left: "53%", top: "9%", delay: 3.5, duration: 20, size: 0.7 },
  { left: "64%", top: "28%", delay: 5.2, duration: 22, size: 0.9 },
  { left: "76%", top: "14%", delay: 0.8, duration: 19, size: 0.65 },
  { left: "88%", top: "35%", delay: 4.7, duration: 24, size: 1 },
  { left: "11%", top: "54%", delay: 3.3, duration: 22, size: 0.7 },
  { left: "24%", top: "72%", delay: 0.3, duration: 20, size: 0.9 },
  { left: "38%", top: "61%", delay: 5.1, duration: 25, size: 0.6 },
  { left: "51%", top: "83%", delay: 2.6, duration: 21, size: 0.8 },
  { left: "69%", top: "58%", delay: 1.8, duration: 23, size: 0.7 },
  { left: "82%", top: "77%", delay: 4.3, duration: 20, size: 0.9 },
  { left: "94%", top: "62%", delay: 2.1, duration: 24, size: 0.65 },
];

const SakuraAtmosphere = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
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
      {petals.map((petal, index) => (
        <motion.span
          key={index}
          className="absolute block rounded-[80%_0_80%_0] bg-primary/35 shadow-[0_0_12px_1px_hsl(var(--primary)/0.12)]"
          style={{
            left: petal.left,
            top: petal.top,
            width: `${petal.size * 7}px`,
            height: `${petal.size * 10}px`,
          }}
          animate={
            reduceMotion
              ? { opacity: 0.22 }
              : {
                  x: [0, 22, -14, 18, 0],
                  y: [0, 24, 56, 86, 114],
                  rotate: [-24, 35, 95, 160, 225],
                  opacity: [0.06, 0.38, 0.13, 0.32, 0.04],
                }
          }
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default SakuraAtmosphere;
