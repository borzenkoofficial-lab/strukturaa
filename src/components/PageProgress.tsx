import { motion, useReducedMotion, useScroll } from "framer-motion";

/** A quiet editorial progress rail; it never participates in page layout. */
const PageProgress = () => {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (reduceMotion) return null;

  return (
    <motion.div
      className="skol-page-progress"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
};

export default PageProgress;
