import { useEffect } from "react";

const CursorGlow = () => {
  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const glow = document.createElement("div");
    glow.className = "cursor-follow-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
    let active = false;
    const targets = "button, a, [role=button], .glass-card, .glass-card-hover, .skol-service-card, .skol-project-card, .skol-category-card, .skol-feature-card, .skol-principle-card, .skol-content-panel, .skol-hero-stage, .skol-format-panel, .skol-cta-panel";
    const move = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest(targets) : null;
      if (target) {
        glow.style.left = event.clientX + "px";
        glow.style.top = event.clientY + "px";
        glow.classList.add("is-visible");
        active = true;
      } else if (active) {
        glow.classList.remove("is-visible");
        active = false;
      }
    };
    const leave = () => { glow.classList.remove("is-visible"); active = false; };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      glow.remove();
    };
  }, []);
  return null;
};

export default CursorGlow;
