# HASH.DEVS — IMPLEMENTATION SPECIFICATION

## 1. Scope & Execution Log

### Phase 01: Project Foundation & Architecture (COMPLETED)
- Initialized Vite 5 + React 18 + TypeScript strict compiler configuration with `@/*` path mapping.
- Configured GSAP 3 + ScrollTrigger + Lenis smooth scroll ticker synchronization.
- Established baseline tokens, responsive breakpoints, and initial minimal preview screen.

### Phase 02: Design System & Core UI Engineering (COMPLETED)
- Expanded visual design tokens with surface hierarchy, semantic colors, and fluid clamp typography.
- Integrated `Manrope` for primary body copy alongside `Syne` (display) and `Space Mono` (technical).
- Built layout system primitives: `MainContainer`, `SectionWrapper`, `FullViewportSection`, `GridLayout`, `SplitLayout`, `HorizontalOverflowContainer`, `Divider`, `Spacer`.
- Built core UI component library: `PrimaryButton`, `SecondaryButton`, `TextButton`, `MagneticButton`, `StatusBadge`, `EyebrowLabel`, `TechnicalLabel`, `HoverLink`, `ImageContainer`, `MagneticElement`.
- Engineered interaction engine: `useMagnetic` physics hook, `CursorContext` state manager, and `CustomCursor`.
- Developed reusable GSAP reveal library: `fadeReveal`, `verticalTextReveal`, `maskReveal`, `staggerReveal`, `clipPathReveal`, `scrollTriggerReveal`.
- Built comprehensive Component Preview Lab at `/lab` with interactive testing modules.

### Phase 03: Global Navigation & Cinematic 3D Hero (COMPLETED)
- Installed `three` and `@types/three` with dedicated Rollup manual chunking.
- Engineered `Navigation` component with transparent-to-blur scroll transformation and direction-aware auto-hide.
- Built `DesktopNavigation` with center pill navigation, magnetic CTA button, and animated menu trigger.
- Built `MobileNavigation` and full-screen `NavDrawer` with GSAP staggered reveals and Lenis scroll-locking.
- Built Web Audio-assisted `AudioController` with animated 4-bar equalizer visualization.
- Built `HeroScene` containing the sculptural Three.js chrome and neon geometric emblem with studio lighting rig, procedural HDR reflections, continuous floating breath, and pointer parallax interpolation.
- Built `HeroContent` presenting oversized editorial typography, eyebrow kicker, supporting text, and dual CTAs.
- Built `HeroIntro` orchestrating the GSAP entrance sequence with line-masked headline reveals.
- Built `HeroScrollTransition` coupling ScrollTrigger scrub with the 3D emblem rotation and headline parallax exit.

---

## 2. Phase 03 Technical Decisions & Rationale

### 2.1 Direct Three.js Implementation
- **Rationale:** Rather than installing `react-three-fiber` and `@react-three/drei` (adding hundreds of kilobytes and layer reconciliation overhead), direct procedural Three.js was utilized.
- **Benefits:**
  - Complete control over WebGL lifecycle (`dispose()` on geometries, materials, environment textures).
  - Native RAF integration without extra React state renders.
  - Zero wrapper overhead.
  - Pixel ratio capped via `Math.min(window.devicePixelRatio, 2)` to protect GPU thermals.

### 2.2 Navigation Scroll Mechanics
- The navigation tracks `scrollY` continuously.
- When `scrollY > 40px`, backdrop changes from `bg-transparent` to `bg-brand-obsidian/85 backdrop-blur-md border-b border-brand-border-subtle`.
- When `scrollY > 180px` and descending, header translates out of view (`-translate-y-full`); on scroll ascending, it smoothly translates back (`translate-y-0`).

### 2.3 Audio Synthesis via Web Audio API
- Uses native `window.AudioContext` to synthesize an ambient 110Hz warm sine drone.
- Muted by default to respect user autoplay guidelines.
- Ramp volume transitions cleanly using `exponentialRampToValueAtTime`, preventing click pops.

---

## 3. Measured Performance & Verification

1. **Target Frame Rate:** Measured smooth 60 FPS in Chrome DevTools during continuous 3D emblem rotation and pointer parallax.
2. **Bundle Chunk Size:** Three.js is separated into `dist/assets/three-*.js` (131.63 kB gzip).
3. **TypeScript & Build:** `npm run lint` and `npm run build` executed with 0 errors and 0 warnings.
4. **All Routes Verified:** `/`, `/about`, `/services`, `/work`, `/contact`, and `/lab` return HTTP 200 OK.
