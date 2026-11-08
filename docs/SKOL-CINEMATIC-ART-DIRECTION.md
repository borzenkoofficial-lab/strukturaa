# SKOL — Cinematic Construction Ecosystem
## Art direction / Homepage only

**Status:** Approved direction, implementation branch: `feature/skol-cinematic-homepage`  
**Scope:** Homepage route only. Do not alter shared page architecture, non-home routes, authentication, dashboard, admin, service detail pages, or production branch.

## Creative premise
Present SKOL as a modern construction and engineering ecosystem. Borrow cinematic pacing, dramatic lighting, scale, and precision from premium automotive campaigns; combine them with architectural editorial design, industrial materiality, and restrained digital spatial graphics. Do not imitate McLaren's identity or use generic futuristic SaaS patterns.

## Visual language
- Graphite / near-black foundation, warm off-white typography, restrained signal-orange accent.
- Real construction / architecture photography with cinematic contrast and controlled desaturation.
- Technical grid, coordinates, linework, construction marks, precise numbering.
- Oversized editorial typography with condensed hierarchy and occasional outlined type.
- Sharp rectangular geometry; avoid excessive rounded cards, neon gradients, and decorative glassmorphism.

## Motion direction
1. Hero entrance: image settles from a subtle scale-in; headline and metadata reveal in staggered editorial timing.
2. Pointer response: low-amplitude image parallax, desktop only, spring-damped; never use large cursor-following effects.
3. Scroll reveals: sections enter with measured opacity / vertical offset; avoid animating every child independently.
4. Cards: restrained lift, border and image movement; no layout-shifting hover scale.
5. Respect `prefers-reduced-motion`; mobile receives simplified motion and no pointer parallax.

## Homepage sequence
01 — Cinematic hero: statement, service navigation, project CTA, technical metadata.
02 — Ecosystem / existing service and category navigation.
03 — Service catalogue and featured demolition / construction content.
04 —...[truncated]