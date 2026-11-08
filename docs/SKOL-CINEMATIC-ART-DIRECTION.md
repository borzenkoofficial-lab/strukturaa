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
04 — Project storytelling.
05 — Working principles and process.
06 — Contact conversion and footer.

## Content principles
- No invented project metrics, certifications, client logos, or claims.
- Keep existing route destinations and working content.
- Preserve current Stories, service catalogue, project content, SEO, language, theme, and contact paths.
- Hero copy is positioning language, not a factual performance claim.

## Engineering constraints
- Keep all new CSS under `.skol-cinematic-home` or unique `.skol-hero-*` selectors.
- Scope header overrides through the homepage wrapper because Header is shared across routes.
- Avoid new runtime dependencies.
- Keep hero image local and reuse existing repository asset.
- Test production build, lint, and tests; review desktop/mobile and reduced-motion behavior before merging.

## New motion treatment — particle assembly / cinematic camera
- The hero now behaves like a restrained film opening: a longer lens-like image settle, staggered masked headline reveals, pointer parallax, scroll-driven camera drift, a slow light pass, fine grain, and a subtle scanline. No autoplay video or external media dependency.
- The ecosystem cards are revealed through a one-shot particle assembly on scroll. A lightweight canvas samples the outer geometry of the main bento cards; particles converge from a deep spatial field, then the real DOM cards materialize in place and remain fully interactive.
- Particle work is bounded to the homepage section, capped device-pixel ratio, canceled on unmount, and bypassed for reduced-motion preferences. The card content remains semantic HTML; canvas is decorative only.
- Keep the effect once per page visit, not on every scroll reversal. Do not use a permanent particle simulation or continuous GPU-heavy shader.

## Iteration 02 — scene continuity and card-plane assembly
- Added a restrained scene bridge between the opening hero and the ecosystem grid: numbered system marker, editorial statement, supporting copy and a moving signal line. It gives the particle reveal a clear narrative destination.
- Particle targets now populate both card edges and a sparse interior plane. Start points are distributed through the visible dark field and use particle scale/opacity to imply depth; they no longer rely primarily on off-canvas sources.
- Reduced canvas backing resolution to a 1.25 DPR cap to lower fill cost while retaining crisp particles.
- Corrected hero stacking context explicitly so the image, lighting, grid, film texture, overlays and typography render in a predictable compositing order.
- Tightened mobile headline sizing and added visible keyboard focus for the hero actions.

## Iteration 03 — multi-plane camera and transition seam
- Introduced two restrained image planes, each with independent scroll and pointer response, to create a foreground/midground/far-field camera read without adding external image assets or changing the hero's composition.
- Added a low-intensity atmospheric light volume to separate the image planes and preserve legibility.
- Added a vertical signal seam with five moving particles at the lower edge of the hero. Its opacity and scale respond to hero scroll progress, visually handing off from the camera scene into the particle assembly below.
- Depth planes are disabled on narrow screens and under reduced-motion preferences; the base hero image and content remain intact.
