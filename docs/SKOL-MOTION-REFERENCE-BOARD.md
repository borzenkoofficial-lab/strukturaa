# SKOL — Motion & Interactive Reference Board

**Purpose:** A working art-direction reference for the SKOL homepage. References are studied for techniques and interaction logic; their visual identities are not to be copied.

## Reference studies

| Reference | What to study | What SKOL can adopt | What not to copy |
|---|---|---|---|
| [AMAXiMAL](https://amaximal.com/) | Computational architecture, parametric structure, spatial flythroughs | Treat the building as a designed system; use camera movement to reveal construction logic | Abstract geometry that has no relationship to SKOL's actual services |
| [Noomo — A Walk Through Phoenix](https://webgpu.com/showcase/noomo-3d-storytelling-threejs/) | Continuous 3D storytelling, scroll-controlled camera, transitions between spatial chapters | One continuous camera narrative rather than disconnected animated blocks | Long 3D passages that delay access to useful information |
| [SPATIUM](https://latynexdigital.com/case-studies/spatium/) | Persistent WebGL scene, assemble/explode/blueprint states, chapter-based storytelling | Reuse one construction object across assembled, exploded and technical states | A full-screen 3D scene on every device regardless of capability |
| [afterform](https://www.afterform.co.uk/) | Architectural CGI, cinematic material/light treatment, real-time visualisation | Concrete, steel and glass should react to light with believable material response | Overly glossy, synthetic architectural renders |
| [AVCO](https://www.avco.com/) | Creative technology, editorial structure, identity through restraint | Strong layout, clear hierarchy and purposeful interaction | Agency-style abstraction that obscures the contractor's offer |
| [Edgeloop](https://www.edgeloop.co.uk/) | Interactive particles, motion systems and spatial effects | Use particles as a transition or explanatory device with a clear destination | Permanent particle noise and expensive idle animation |

## SKOL interaction language

1. **Construction as narrative:** the same structural model moves through assembled, exploded and blueprint-like states.
2. **Camera has a reason:** camera movement reveals scale, depth or a relationship between structural elements; it is not a perpetual orbit.
3. **Materials carry hierarchy:** concrete is diffuse, steel catches narrow highlights, glass stays restrained, signal orange marks active structural information.
4. **Particles connect scenes:** particles may assemble a section or hand off between sections, but must resolve into useful content.
5. **Editorial UI remains dominant:** headings, navigation, service labels and project links stay readable and usable above the visual layer.

## Engineering and UX guardrails

- Keep WebGL lazy-loaded and desktop-gated; do not start it on narrow screens or when reduced motion is requested.
- Pause rendering when the scene is outside the viewport; cap device pixel ratio and frame rate.
- Keep semantic HTML as the source of all meaningful content and actions.
- Every motion state must have a static/reduced-motion equivalent.
- Avoid scroll hijacking, cursor-following UI, perpetual high-cost shader loops and layout-shifting hover effects.
- Validate 1440px desktop, 1280px boundary, 390px mobile, keyboard focus and `prefers-reduced-motion`.

## Current implementation checkpoint

- The hero contains a lazy-loaded Three.js construction scene.
- Initial assembly resolves the structure from offset positions into its composed state.
- The current iteration adds a scroll-driven exploded state: the same parts separate along their assembly vectors while edge lines brighten and shift toward a cool technical-blueprint tone.
- The 3D state follows the hero scroll position directly; native smooth scrolling supplies the interpolation without a second easing layer.

## Acceptance criteria for future motion work

- A first-time visitor understands the SKOL offer without waiting for an animation.
- Motion communicates a change of state, material, scale or section — not decoration alone.
- No text, CTA or navigation is obscured by the scene.
- No horizontal overflow, clipping, layout shift or inaccessible hover-only action.
- WebGL failures and reduced-motion settings leave a complete, usable page.
- Build, tests, TypeScript, changed-file lint and browser checks pass before a branch update is published.
