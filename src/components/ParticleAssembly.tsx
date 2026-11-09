import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = {
  sx: number; sy: number; ex: number; ey: number;
  size: number; delay: number; drift: number; alpha: number;
};

const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

const ParticleAssembly = ({ children }: { children: ReactNode }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let frame = 0;
    let particles: Particle[] = [];
    let startedAt = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let hasStarted = false;

    const finish = () => {
      root.classList.add("is-assembled");
      const context = canvas.getContext("2d");
      if (context) context.clearRect(0, 0, canvas.width, canvas.height);
    };

    if (reduceMotion) {
      finish();
      return;
    }

    const buildParticles = () => {
      const bounds = root.getBoundingClientRect();
      width = root.clientWidth;
      height = root.scrollHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      const context = canvas.getContext("2d");
      if (!context) return;

      const cards = Array.from(root.querySelectorAll<HTMLElement>(".skol-bento-grid > *"));
      const next: Particle[] = [];
      let seed = 7919;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      cards.forEach((card, cardIndex) => {
        const rect = card.getBoundingClientRect();
        const left = rect.left - bounds.left + root.scrollLeft;
        const top = rect.top - bounds.top + root.scrollTop;
        const count = Math.max(22, Math.min(38, Math.round((rect.width * rect.height) / 10500)));
        for (let i = 0; i < count; i += 1) {
          const edge = i % 5;
          const t = random();
          let ex = left + t * rect.width;
          let ey = top + t * rect.height;
          if (edge === 0) ey = top;
          if (edge === 1) ex = left + rect.width;
          if (edge === 2) ey = top + rect.height;
          if (edge === 3) ex = left;
          if (edge === 4) {
            ex = left + rect.width * (0.08 + random() * 0.84);
            ey = top + rect.height * (0.08 + random() * 0.84);
          }
          const depth = random();
          const angle = random() * Math.PI * 2;
          const radius = Math.max(width, height) * (0.16 + depth * 0.42);
          const sx = Math.max(-12, Math.min(width + 12, ex + Math.cos(angle) * radius));
          const sy = Math.max(-12, Math.min(height + 12, ey + Math.sin(angle) * radius * 0.7));
          next.push({
            sx, sy, ex, ey,
            size: 0.55 + depth * 1.35,
            delay: random() * 0.3 + cardIndex * 0.022,
            drift: (random() - 0.5) * (18 + depth * 30),
            alpha: 0.18 + depth * 0.52,
          });
        }
      });
      particles = next;
    };

    const draw = (now: number) => {
      const context = canvas.getContext("2d");
      if (!context) return;
      const elapsed = (now - startedAt) / 2100;
      const progress = Math.min(elapsed, 1);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      particles.forEach((particle) => {
        const local = Math.max(0, Math.min(1, (progress - particle.delay) / (1 - particle.delay)));
        const eased = easeOut(local);
        const x = particle.sx + (particle.ex - particle.sx) * eased;
        const y = particle.sy + (particle.ey - particle.sy) * eased + Math.sin(local * Math.PI) * particle.drift;
        const fade = local < 0.08 ? local / 0.08 : local > 0.88 ? (1 - local) / 0.12 : 1;
        context.fillStyle = `rgba(226, 133, 83, ${particle.alpha * Math.max(0, fade)})`;
        context.fillRect(x, y, particle.size, particle.size);
        if (local > 0.12 && local < 0.96) {
          context.strokeStyle = `rgba(226, 133, 83, ${particle.alpha * 0.12})`;
          context.lineWidth = 0.55;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x - (particle.ex - particle.sx) * 0.035, y - (particle.ey - particle.sy) * 0.035);
          context.stroke();
        }
      });
      context.globalCompositeOperation = "source-over";

      if (progress < 1) frame = requestAnimationFrame(draw);
      else {
        finish();
        canvas.classList.add("is-faded");
      }
    };

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      buildParticles();
      startedAt = performance.now();
      hasStarted = true;
      frame = requestAnimationFrame(draw);
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    observer.observe(root);
    const resizeObserver = new ResizeObserver(() => {
      if (!root.classList.contains("is-assembled")) {
        buildParticles();
        if (hasStarted) {
          cancelAnimationFrame(frame);
          startedAt = performance.now();
          frame = requestAnimationFrame(draw);
        }
      }
    });
    resizeObserver.observe(root);

    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return (
    <div ref={rootRef} className="skol-particle-assembly">
      <canvas ref={canvasRef} className="skol-particle-canvas" aria-hidden="true" />
      {children}
    </div>
  );
};

export default ParticleAssembly;
