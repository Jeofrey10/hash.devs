# HASH.DEVS — QUALITY ASSURANCE & TESTING STRATEGY

## 1. Quality Assurance Philosophy

Creative technology websites require specialized testing methodologies that validate both functional logic and perceptual fluidity (frame rate stability, smooth scroll fidelity, 3D WebGL performance, and layout stability).

---

## 2. Testing Pillars

### 2.1 Static Analysis & Type Verification
- **Command:** `npm run lint` (`tsc --noEmit`)
- **Requirement:** Zero TypeScript compiler errors with `strict: true` and `noUnusedLocals: true`.

### 2.2 Production Build Verification
- **Command:** `npm run build`
- **Requirement:** Successful compilation into code-split chunks:
  - `vendor`: React, React DOM, React Router
  - `animation`: GSAP, Lenis
  - `three`: Three.js core engine
  - `index`: Application logic and components

### 2.3 3D WebGL & Hero Interaction Testing
- **Pointer Parallax:** Move cursor across viewport to verify smooth interpolation (`lerp: 0.05`) without stutter or frame jumps.
- **Scroll scrub:** Scroll down from `#hero-section` to verify:
  - 3D emblem rotates along Y/X axes and glides back into Z-space.
  - Headline translates vertically with smooth opacity fade.
  - ScrollTrigger cleans up on unmount.
- **Fallback Verification:** Test with WebGL disabled or `prefers-reduced-motion: reduce`:
  - Verify high-contrast geometric SVG fallback renders instantly.
  - Verify no WebGL error overlays or console exceptions occur.
- **Memory Disposal:** Navigate back and forth between `/` and `/lab` to ensure geometries, materials, environment textures, and WebGL renderers are properly disposed.

### 2.4 Navigation & Mobile Menu Testing
- **Desktop Navigation:**
  - Verify transparent header at top of hero.
  - Scroll past 40px: verify smooth transition to `bg-brand-obsidian/85 backdrop-blur-md`.
  - Scroll down past 180px: verify auto-hide (`-translate-y-full`).
  - Scroll up: verify smooth slide down (`translate-y-0`).
  - Click `Let's Talk` CTA: verifies magnetic attraction and navigation to `/contact`.
  - Click `SOUND [ON/OFF]`: verifies Web Audio ambient drone toggles smoothly.
- **Mobile Navigation:**
  - Emulate 320px (iPhone SE) and 390px (iPhone 14/15) viewports.
  - Click menu toggle: verify animated hamburger morphs into cross `X`.
  - Verify full-screen overlay opens with GSAP staggered link reveals.
  - Verify Lenis background scrolling is completely locked (`overflow: hidden`).
  - Press `Escape` key or click close: verify menu closes smoothly and body scroll unlocks.

---

## 3. Cross-Device & Responsive Verification Matrix

| Device Profile | Viewport Range | Tested Resolutions | Key Checks | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Small Mobile** | `320px – 374px` | 320×568 (iPhone SE) | No horizontal overflow, headline scales cleanly via clamp(), mobile nav targets >= 48px | `PASS` |
| **Standard Mobile**| `375px – 767px` | 390×844 (iPhone 15) | Touch gesture responsiveness, 3D emblem scaled to 0.75x to prevent text clash | `PASS` |
| **Tablet** | `768px – 1023px`| 768×1024 (iPad Air) | Hybrid layout, center nav links transition smoothly, scroll indicator visible | `PASS` |
| **Laptop** | `1024px – 1439px`| 1280×800 (MacBook Air)| Desktop navigation pill centered, sound equalizer active, 3D emblem offset right | `PASS` |
| **Desktop / 4K** | `1440px+` | 1920×1080, 2560×1440 | Max container width constraint (1720px), smooth 60fps WebGL rendering | `PASS` |

---

## 4. Automated Performance Benchmarks

Target Lighthouse scores on production releases:
- **Performance:** `>= 95`
- **Accessibility:** `>= 95`
- **Best Practices:** `100`
- **SEO:** `100`
- **Measured Frame Rate:** Sustained `60fps` / `120fps` (ProMotion displays) during continuous 3D rotation and scroll.
