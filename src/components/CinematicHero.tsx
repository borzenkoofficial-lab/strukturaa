import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Crosshair, MoveUpRight } from "lucide-react";
import { useCallback, useRef, type PointerEvent } from "react";
import heroImage from "@/assets/hero-demolition.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

const CinematicHero = () => {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 58, damping: 24, mass: 0.8 });
  const springY = useSpring(pointerY, { stiffness: 58, damping: 24, mass: 0.8 });
  const imageX = useTransform(springX, [-0.5, 0.5], [18, -18]);
  const imageY = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const cameraY = useTransform(scrollYProgress, [0, 1], [0, 115]);
  const cameraScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const cameraOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 0.72, 0.25]);
  const farPlaneY = useTransform(scrollYProgress, [0, 1], [0, -76]);
  const nearPlaneY = useTransform(scrollYProgress, [0, 1], [0, 64]);
  const farPlaneX = useTransform(springX, [-0.5, 0.5], [10, -10]);
  const nearPlaneX = useTransform(springX, [-0.5, 0.5], [-24, 24]);
  const transitionOpacity = useTransform(scrollYProgress, [0.55, 0.9, 1], [0, 0.9, 1]);
  const transitionScale = useTransform(scrollYProgress, [0.55, 1], [0.72, 1.15]);
  const imageScale = reduceMotion ? 1 : 1.075;

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
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
      ref={heroRef}
      className="skol-cinematic-hero"
      aria-labelledby="skol-home-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <motion.div className="skol-hero-camera" style={reduceMotion ? undefined : { y: cameraY, scale: cameraScale, opacity: cameraOpacity }}>
        <div className="skol-hero-media" aria-hidden="true">
          <motion.img
            src={heroImage}
            alt=""
            className="skol-hero-image"
            style={reduceMotion ? undefined : { x: imageX, y: imageY, scale: imageScale }}
            initial={reduceMotion ? false : { scale: 1.2, opacity: 0.25, filter: "blur(8px) saturate(.4)" }}
            animate={{ scale: imageScale, opacity: 1, filter: "blur(0px) saturate(.58)" }}
            transition={{ duration: 2.4, ease }}
            fetchPriority="high"
          />
          {!reduceMotion && <>
            <motion.img src={heroImage} alt="" aria-hidden="true" className="skol-hero-depth-layer skol-hero-depth-far" style={{ x: farPlaneX, y: farPlaneY, scale: 1.13 }} initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 0.3, filter: "blur(1.5px)" }} transition={{ duration: 2.8, delay: 0.7, ease }} />
            <motion.img src={heroImage} alt="" aria-hidden="true" className="skol-hero-depth-layer skol-hero-depth-near" style={{ x: nearPlaneX, y: nearPlaneY, scale: 1.18 }} initial={{ opacity: 0, filter: "blur(5px)" }} animate={{ opacity: 0.22, filter: "blur(0px)" }} transition={{ duration: 2.2, delay: 1, ease }} />
          </>}
          <div className="skol-hero-atmosphere" />
          <div className="skol-hero-image-shade" />
          <div className="skol-hero-grid" />
          <div className="skol-hero-orbit skol-hero-orbit-one" />
          <div className="skol-hero-orbit skol-hero-orbit-two" />
          <div className="skol-hero-light-sweep" />
          <div className="skol-hero-film-grain" />
          <div className="skol-hero-scanline" />
        </div>

        <div className="skol-hero-frame">
          <motion.div
            className="skol-hero-topline"
            initial={reduceMotion ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease }}
          >
            <span className="skol-hero-eyebrow"><i /> CONSTRUCTION / ENGINEERING / PROJECTS</span>
            <span className="skol-hero-coordinate">55°45' N&nbsp; 37°37' E</span>
          </motion.div>

          <div className="skol-hero-main">
            <motion.div
              className="skol-hero-copy"
              initial={reduceMotion ? false : { opacity: 0, y: 42, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.35, delay: 0.48, ease }}
            >
              <p className="skol-hero-kicker"><span>01</span> / СТРОИТЕЛЬНАЯ ЭКОСИСТЕМА</p>
              <h1 id="skol-home-title">
                <motion.span initial={reduceMotion ? false : { y: "115%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.58, ease }}>СОЗДАЁМ</motion.span>
                <motion.span className="skol-hero-title-line" initial={reduceMotion ? false : { y: "115%" }} animate={{ y: 0 }} transition={{ duration: 1.15, delay: 0.72, ease }}><em>ПРОСТРАНСТВО</em><b>ДЛЯ</b></motion.span>
                <motion.span className="skol-hero-title-accent" initial={reduceMotion ? false : { y: "115%" }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.86, ease }}>НОВОГО.</motion.span>
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
              initial={reduceMotion ? false : { opacity: 0, x: 34, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, delay: 1.05, ease }}
            >
              <div className="skol-hero-index-mark"><Crosshair size={17} strokeWidth={1.2} /><span>SKOL / 2026</span></div>
              <div className="skol-hero-index-rule" />
              <p>ОТ ПЕРВОГО<br />ЧЕРТЕЖА ДО<br /><strong>РЕЗУЛЬТАТА.</strong></p>
              <span className="skol-hero-index-caption">ОДНА СИСТЕМА. РАЗНЫЕ МАСШТАБЫ.</span>
            </motion.div>
          </div>

          <motion.div
            className="skol-hero-bottomline"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.35 }}
          >
            <span className="skol-hero-scroll"><ArrowDown size={14} /> SCROLL TO EXPLORE</span>
            <span className="skol-hero-bottom-center">ENGINEERED TO BUILD WHAT'S NEXT</span>
            <span className="skol-hero-bottom-right">01 — 06</span>
          </motion.div>
        </div>
        <div className="skol-hero-vertical-label" aria-hidden="true">SKOL / BUILT ENVIRONMENT</div>
      </motion.div>
      <motion.div className="skol-hero-transition" aria-hidden="true" style={reduceMotion ? undefined : { opacity: transitionOpacity, scale: transitionScale }}><i /><i /><i /><i /><i /><span /></motion.div>
      <div className="skol-hero-frame-corners" aria-hidden="true"><i /><i /><i /><i /></div>
    </section>
  );
};

export default CinematicHero;
