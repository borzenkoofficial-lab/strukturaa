import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Coordinates one-time section entrances on the construction homepage.
 * The observer only animates existing section wrappers; it never changes
 * their dimensions, so deferred content keeps its reserved layout space.
 */
const HomeMotionDirector = () => {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".skol-cinematic-home");
    if (!root || reduceMotion || !("IntersectionObserver" in window)) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-skol-reveal]"));
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.dataset.skolVisible = "true";
          observer.unobserve(target);
        });
      },
      { root: null, rootMargin: "0px 0px -9% 0px", threshold: 0.12 },
    );

    targets.forEach((target, index) => {
      target.style.setProperty("--skol-reveal-order", String(Math.min(index, 5)));
      observer.observe(target);
    });
    root.classList.add("skol-motion-ready");

    return () => {
      observer.disconnect();
      root.classList.remove("skol-motion-ready");
      targets.forEach((target) => {
        delete target.dataset.skolVisible;
        target.style.removeProperty("--skol-reveal-order");
      });
    };
  }, [reduceMotion]);

  return null;
};

export default HomeMotionDirector;
