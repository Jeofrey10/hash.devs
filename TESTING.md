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

### 3.1 8-Viewport Mobile & Desktop Verification Audit (Mobile Responsive Repair Pass)

| Device Profile | Dimensions | Target Category | Hero Section | 3D Emblem Canvas | Horiz. Overflow | H1 Clearance Below Header | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Compact mobile** | `320 × 568` | Small Phone | Visible (`h1=280×91`) | Rendered & framed | `0px` (`320px vs 320px`) | `top: 96px >= 80px` (OK) | `PASS` |
| **iPhone SE** | `375 × 812` | Standard Phone | Visible (`h1=335×91`) | Rendered & framed | `0px` (`375px vs 375px`) | `top: 112px >= 80px` (OK) | `PASS` |
| **iPhone 14/15** | `390 × 844` | Modern Standard | Visible (`h1=350×91`) | Rendered & framed | `0px` (`390px vs 390px`) | `top: 112px >= 80px` (OK) | `PASS` |
| **Large mobile** | `430 × 932` | Max/Plus Phone | Visible (`h1=390×91`) | Rendered & framed | `0px` (`430px vs 430px`) | `top: 112px >= 80px` (OK) | `PASS` |
| **Small tablet** | `768 × 1024` | Tablet Portrait | Visible (`h1=701×155`) | Rendered & framed | `0px` (`762px vs 762px`) | `top: 128px >= 80px` (OK) | `PASS` |
| **Laptop** | `1280 × 800` | Compact Laptop | Visible (`h1=656×182`) | Desktop Canvas (right) | `0px` (`1274px vs 1274px`) | `top: 112px >= 80px` (OK) | `PASS` |
| **Desktop** | `1440 × 900` | Standard Desktop | Visible (`h1=686×182`) | Desktop Canvas (right) | `0px` (`1434px vs 1434px`) | `top: 112px >= 80px` (OK) | `PASS` |
| **Ultrawide** | `1920 × 1080` | Pro Widescreen | Visible (`h1=796×182`) | Desktop Canvas (right) | `0px` (`1914px vs 1914px`) | `top: 112px >= 80px` (OK) | `PASS` |

### 3.2 Mobile Internal Studio Route Horizontal Overflow Audit (375 × 812)

| Route | Page Type | Client Width | Scroll Width | Page Horiz Overflow | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Homepage | `375px` | `375px` | `0px` | `PASS` |
| `/work/pixwall` | Case Study (Deepest nested) | `375px` | `375px` | `0px` (Fixed from 488px) | `PASS` |
| `/about` | Studio About Page | `375px` | `375px` | `0px` | `PASS` |
| `/services` | Capabilities Page | `375px` | `375px` | `0px` | `PASS` |
| `/work` | Project Archive | `375px` | `375px` | `0px` | `PASS` |
| `/contact` | Project Initiation | `375px` | `375px` | `0px` | `PASS` |

---

## 4. Automated Performance Benchmarks

Target Lighthouse scores on production releases:
- **Performance:** `>= 95`
- **Accessibility:** `>= 95`
- **Best Practices:** `100`
- **SEO:** `100`
- **Measured Frame Rate:** Sustained `60fps` / `120fps` (ProMotion displays) during continuous 3D rotation and scroll.
