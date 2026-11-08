import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Crosshair, MoveUpRight } from "lucide-react";
import { lazy, Suspense, useCallback, useRef, type PointerEvent } from "react";
import heroImage from "@/assets/hero-demolition.jpg";
const ConstructionScene = lazy(() => import("@/components/ConstructionScene"));

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
  const focusPull = useTransform(scrollYProgress, [0, 0.38, 0.78, 1], ["blur(0px) saturate(.58) contrast(1.12) brightness(.72)", "blur(0px) saturate(.58) contrast(1.12) brightness(.72)", "blur(1px) saturate(.58) contrast(1.12) brightness(.72)", "blur(3px) saturate(.58) contrast(1.12) brightness(.72...[truncated]