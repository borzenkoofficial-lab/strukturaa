import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Crosshair, MoveUpRight } from "lucide-react";
import { useCallback } from "react";
import heroImage from "@/assets/hero-demolition.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

const CinematicHero = () => {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 70, damping: 22, mass: 0.7 });
  const springY = useSpring(pointerY, { stiffness: 70, damping: 22, mass: 0.7 });
  const imageX = useTransform(springX, [-0.5, 0.5], [14, -14]);
  const imageY = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const imageScale = reduceMotion ? 1 : 1.045;

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }, [pointerX, pointerY, reduceMotion]);

  const resetPointer = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  return (
    <section
      className="skol-cinematic-hero"
      aria-labelledby="skol-home-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="skol-hero-media" aria-hidden="true">
        <motion.img
          src={heroImage}
          alt=""
          className="skol-hero-image"
          style={reduceMotion ? undefined : { x: imageX, y: imageY, scale: imageScale }}
          initial={reduceMotion ? false : { scale: 1.13, opacity: 0.5 }}
          animate={{ scale: imageScale, opacity: 1 }}
          transition={{ duration: 1.8, ease }}
          fetchPriority="high"
        />
        <div className="skol-hero-image-shade" />
        <div className="skol-hero-grid" />
        <div className="skol-hero-orbit skol-hero-orbit-one" />
        <div className="skol-hero-orbit skol-hero-orbit-two" />
      </div>

      <div className="skol-hero-frame">
        <div className="skol-hero-topline">
          <span className="skol-hero-eyebrow"><i /> CONSTRUCTION / ENGINEERING / PROJECTS</span>
          <span className="skol-hero-coordinate">55°45' N&nbsp; 37°37' E</span>
        </div>

        <div className="skol-hero-main">
          <motion.div
            className="skol-hero-copy"
            initial={reduceMotion ? false : { opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05, delay: 0.18, ease }}
          >
            <p className="skol-hero-kicker"><span>01</span> / СТРОИТЕЛЬНАЯ ЭКОСИСТЕМА</p>
            <h1 id="skol-home-title">
              <span>СОЗДАЁМ</span>
              <span className="skol-hero-title-line"><em>ПРОСТРАНСТВО</em><b>ДЛЯ</b></span>
              <span className="skol-hero-title-accent">НОВОГО.</span>
            </h1>
            <p className="skol-hero-description">
              Демонтаж, строительство, ремонт и инженерные решения —
              собранные в единую систему работы с объектом.
            </p>
            <div className="skol-hero-actions">
              <a className="skol-hero-primary" href="/services">
                НАПРАВЛЕНИЯ РАБОТ <MoveUpRight size={17} strokeWidth={1.7} />
              </a>
              <a className="skol-hero-secondary" href="/contacts">
                ОБСУДИТЬ ПРОЕКТ <ArrowUpRight size={16} />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="skol-hero-index"
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.55, ease }}
          >
            <div className="skol-hero-index-mark"><Crosshair size={17} strokeWidth={1.2} /><span>SKOL / 2026</span></div>
            <div className="skol-hero-index-rule" />
            <p>ОТ ПЕРВОГО<br />ЧЕРТЕЖА ДО<br /><strong>РЕЗУЛЬТАТА.</strong></p>
            <span className="skol-hero-index-caption">ОДНА СИСТЕМА. РАЗНЫЕ МАСШТАБЫ.</span>
          </motion.div>
        </div>

        <div className="skol-hero-bottomline">
          <span className="skol-hero-scroll"><ArrowDown size={14} /> SCROLL TO EXPLORE</span>
          <span className="skol-hero-bottom-center">ENGINEERED TO BUILD WHAT'S NEXT</span>
          <span className="skol-hero-bottom-right">01 — 06</span>
        </div>
      </div>
      <div className="skol-hero-vertical-label" aria-hidden="true">SKOL / BUILT ENVIRONMENT</div>
    </section>
  );
};

export default CinematicHero;
