# HASH.DEVS — DESIGN SYSTEM SPECIFICATION

## 1. Visual Philosophy: High-End Creative Brutalism

The HASH.DEVS design system marries the structural discipline of software architecture with the kinetic energy of an elite digital creative studio. Inspired by benchmarks like [Trionn](https://trionn.com/), the aesthetic features:
- **Obsidian Dark Canvas:** Pure deep black (`#050505`) with sharp architectural Graphite surfaces (`#171A18`).
- **High-Impact Electric Neon:** Strict `#35E85B` reserved for focal highlights, active states, and cursor accents.
- **Editorial Brutalism:** Extreme typographic contrast between monumental display letterforms and microscopic monospace technical coordinates.
- **Physics-Calibrated Motion:** Spring-free, inertia-weighted magnetic attraction, fluid cursor expansion, and skew reveals.

---

## 2. Complete Color Token Architecture

### 2.1 Core Brand Tokens
```css
--color-obsidian: #050505; /* Primary Canvas & Background */
--color-neon:     #35E85B; /* Brand Accent, Active States, Focus Rings */
--color-white:    #FFFFFF; /* Primary Typography & Structural Rules */
--color-graphite: #171A18; /* Structural Grid Lines, Dividers, Card Backgrounds */
```

### 2.2 Surface & Border Hierarchy
```css
/* Surfaces */
--color-surface-base:     #050505;
--color-surface:          #0B0D0C; /* Standard Panel Surface */
--color-surface-elevated: #111412; /* Floating Panels & Modals */
--color-surface-card:     #131715; /* Interactive Cards */
--color-surface-hover:    #191E1B; /* Card Hover State */

/* Borders */
--color-border-subtle:    #141815; /* Low-contrast internal dividers */
--color-border:           #1E2420; /* Default structural component border */
--color-border-hover:     #2E3832; /* Hover outline */
--color-border-accent:    rgba(53, 232, 91, 0.3); /* Neon highlight border */
```

### 2.3 Semantic Status Colors (Tuned for Dark Canvas)
```css
--color-semantic-success: #35E85B; /* Live / Operational */
--color-semantic-warning: #E5A93C; /* Studio Capacity Warning */
--color-semantic-error:   #E5484D; /* Offline / Critical Alert */
--color-semantic-info:    #4895EF; /* Informational / Architectural Note */
```

---

## 3. Typography System

### 3.1 Font Family Pairing
- **Display Face:** `Syne` (Weights: 600, 700, 800)
  - Architectural wide stance, geometric curves, editorial authority.
- **Body Face:** `Manrope` (Weights: 300, 400, 500, 600, 700)
  - Geometric Grotesque design, exceptional readability on high-DPI screens.
- **Technical Face:** `Space Mono` (Weights: 400, 700)
  - Code notation, timestamps, coordinates, badges, and system readouts.

### 3.2 Fluid Typographic Scale

| Token | Clamp Definition | Line Height | Tracking | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `text-display-xl` | `clamp(3.5rem, 8vw + 1rem, 8.5rem)` | `0.92` | `-0.045em` | Monumental hero headlines |
| `text-display-lg` | `clamp(2.75rem, 5.5vw + 0.5rem, 5.5rem)` | `1.08` | `-0.045em` | Case study titles |
| `text-h1` | `clamp(2.25rem, 4vw + 0.5rem, 4rem)` | `1.08` | `-0.025em` | Section primary headers |
| `text-h2` | `clamp(1.85rem, 3vw + 0.25rem, 3rem)` | `1.08` | `-0.025em` | Section sub-headers |
| `text-h3` | `clamp(1.5rem, 2vw + 0.25rem, 2.25rem)` | `1.25` | `-0.025em` | Feature card titles |
| `text-h4` | `clamp(1.25rem, 1.4vw + 0.2rem, 1.75rem)` | `1.25` | `0em` | Service & capability headers |
| `text-h5` | `clamp(1.1rem, 1vw + 0.15rem, 1.35rem)` | `1.25` | `0em` | Minor group labels |
| `text-h6` | `1rem` | `1.55` | `0.06em` | Uppercase category headings |
| `text-body-lg` | `clamp(1.125rem, 0.5vw + 1rem, 1.25rem)` | `1.75` | `0em` | Lead-in paragraphs |
| `text-body-reg` | `1.0rem` | `1.55` | `0em` | Standard descriptions |
| `text-body-sm` | `0.875rem` | `1.55` | `0em` | Secondary metadata |
| `text-eyebrow` | `0.8125rem` | `1.0` | `0.18em` | Section index tags (`[01]`) |
| `text-meta` | `0.75rem` | `1.0` | `0.06em` | Technical timestamps & coordinates |

---

## 4. Global Navigation Design

### 4.1 Desktop Architecture
- **Left:** Official HASH.DEVS brand logo (`/images/hashdevs-logo.png`) + pulsating neon online dot.
- **Center:** Pill navigation with active route highlights and animated horizontal line reveals (`Home`, `About`, `Services`, `Work`).
- **Right:** Kinetic AudioController (circular 36×36 px icon button featuring 4 oscillating green equalizer bars without redundant text) + Magnetic `Let's Talk` CTA + Drawer menu toggle.
- **Scroll Behavior:** Transparent at hero pinnacle; transitions to frosted graphite border (`bg-brand-obsidian/85 backdrop-blur-md`) past 40px scroll. Auto-hides on fast downward scroll; glides in smoothly on upward scroll.

### 4.2 Mobile Navigation
- Full-screen architectural overlay with vertical curtain wipe (`clip-path: inset(0% 0% 0% 0%)`).
- Staggered line reveal for navigation destinations with bracket indexing (`[01]`, `[02]`, etc.).
- Complete body scroll lock via Lenis (`lenis.stop()`).
- Escape key and touch-safe targets (`min 48px`).

---

## 5. 3D Hero Art Direction

### 5.1 Automotive-Grade Sculptural Emblem (Phase 03.3 Final Look-Development)
A precision-machined, 8-segment architectural brand emblem modeled after high-end automotive badges and luxury industrial design objects:
- **Geometry & Tangent Continuity:**
  - 8 distinct aerodynamic segments (Piece 1 sweeping upper-right blade in signature green lacquer, 7 segments in mirror chrome).
  - Resampled with closed Catmull-Rom cubic splines (64 points per contour) ensuring $C^1$ tangent-continuous curvature and zero polygonal faceting.
  - Dual-tiered extrusion architecture:
    - Tier 1 (Outer Machined Sidewall Chassis): `depth: 0.10`, `bevelThickness: 0.028`, `bevelSize: 0.024`, `bevelSegments: 8`.
    - Tier 2 (Domed Cushion Face): `depth: 0.06`, `bevelThickness: 0.052`, `bevelSize: 0.036`, `bevelSegments: 16` offset at $z = +0.085$.
    - Forward projection of $+0.069$ creates a distinct stepped terrace, dark recessed channel, and crisp double-ridge specular highlights.
- **Physical Materials (PBR):**
  - **Mirror Chrome Face:** `MeshPhysicalMaterial` (`color: #f4f6f5`, `metalness: 1.0`, `roughness: 0.038`, `clearcoat: 1.0`, `clearcoatRoughness: 0.018`, `reflectivity: 1.0`, `envMapIntensity: 2.2`, `toneMapped: true`). Delivers liquid-silver specular highlights and deep black zebra reflection bands.
  - **Machined Chrome Sidewall:** Dark gunmetal alloy (`color: #28302c`, `metalness: 0.98`, `roughness: 0.13`, `clearcoat: 0.6`, `clearcoatRoughness: 0.04`, `envMapIntensity: 1.5`, `toneMapped: true`).
  - **Signature Green Lacquer Face:** Deep electric-green automotive lacquer (`color: #00F508`, `metalness: 0.05`, `roughness: 0.12`, `clearcoat: 1.0`, `clearcoatRoughness: 0.025`, `reflectivity: 1.0`, `envMapIntensity: 0.45`, `toneMapped: false`). Produces a rich, saturated exotic-car paint finish with a razor-sharp curved white specular highlight streak across the shoulder.
  - **Green Sidewall:** Deep emerald automotive composite (`color: #006818`, `metalness: 0.05`, `roughness: 0.22`, `toneMapped: false`).
- **Automotive Studio HDRI Environment (PMREM):**
  - 32-bit floating-point HDR equirectangular studio environment convolved via `THREE.PMREMGenerator` with GGX pre-filtering.
  - Overhead zenith bank ($Y = 60$, peak radiance $18.0$, 750px span), frontal key softboxes ($Y = 180, 310, 420$, radiance up to $22.0$), deep negative-fill horizon cut ($Y = 236\text{--}268$, factor $0.03$), dual razor horizon gleams ($Y = 250, 365$, radiance up to $26.0$), vertical strip softboxes ($X = 220, 820$, radiance $18.0$), lower floor bounce ($Y = 480$), and localized green accent reflection.
- **Seven-Point Automotive Studio Lighting Rig:**
  - Key Directional Softbox (`intensity: 1.8`, `position: (3.2, 4.2, 4.8)`).
  - Frontal Neutral Fill (`intensity: 0.9`, `position: (0.0, 0.2, 5.0)`).
  - Lower Front Key Fill (`intensity: 1.2`, `position: (2.0, -3.0, 4.5)`).
  - Left Edge Strip Light (`intensity: 1.1`, `position: (-4.5, 0.5, 3.5)`).
  - Green Accent Rim Light (`intensity: 0.6`, `position: (1.5, 1.2, 0.9)`).
  - Overhead Rim Top Light (`intensity: 0.7`, `position: (0, 5.5, 1.5)`).
  - Ambient Base Fill (`intensity: 0.35`, `color: #030403`).
- **Heavy-Metal Micro-Motion Choreography:**
  - Deliberate, high-mass micro-motion: `floatAmplitude: 0.025`, `floatSpeed: 0.35`, `rotationAmplitude: 0.008`.
- **Pointer Parallax:** Real-time damping interpolation (`lerp` factor `0.05`) following cursor coordinates.

---

## 6. Hero Animation & Scroll Choreography

### 6.1 Entrance Sequence (GSAP Timeline)
1. **0.00s:** Initial black stage.
2. **0.20s:** Navigation header descends vertically (`y: -20px -> 0px`).
3. **0.35s:** Eyebrow kicker fades in (`y: -20px -> 0px`).
4. **0.50s:** Monumental headline reveals line-by-line using individual `overflow-hidden` line masks (`yPercent: 120 -> 0`, `skewY: 3 -> 0`, stagger `0.12s`).
5. **0.85s:** Supporting text paragraph glides up (`y: 30px -> 0px`).
6. **1.05s:** CTA button group surfaces with subtle magnetic ready state.
7. **1.20s:** Small studio metadata line locks into position at bottom border.

### 6.2 Scroll-Linked Exit Transition (ScrollTrigger + Lenis)
As the visitor scrolls down from the hero:
- The 3D emblem rotates around Y/X axes (`scrollRotY`, `scrollRotX`), moves backward into depth (`z: 0 -> -3.5`), and glides upward (`y: 0 -> +2.2`).
- Headline typography undergoes subtle parallax translation (`y: progress * 160px`) while opacity gently eases out (`1 -> 0`).
- The transition delivers a seamless handoff to the incoming section boundary without abrupt layout snapping.

---

## 7. Brand Statement Editorial Direction (Phase 04)

### 7.1 Typographic Manifesto
- **Headline Architecture:**
  ```
  WE DON'T JUST
  BUILD WEBSITES.
  WE ENGINEER
  DIGITAL IMPACT.
  ```
  Rendered in oversized `Syne` font (`text-[1.35rem] xs:text-[1.5rem] sm:text-4xl tablet:text-5xl laptop:text-[3.75rem] desktop:text-[4.75rem] wide:text-[5.5rem]`), tight negative tracking, zero line wrapping (`whitespace-nowrap`), and line-masked staggered reveals.
- **Neon Green Accent Highlights:**
  `ENGINEER` and `DIGITAL IMPACT.` highlighted in Hash Neon Green (`#35E85B`) with luminous neon bloom (`drop-shadow(0 0 16px rgba(53,232,91,0.35))`) and two-way reversible ScrollTrigger playback.
- **Architectural Annotations:**
  - `[02] OUR PHILOSOPHY` kicker.
  - Studio metadata card providing real-time telemetry (Methodology, Discipline, Status beacon).

---

## 8. Studio Showcase & Capability Panels (Phase 04 & 04.1)

### 8.1 Slat Shutter Transition
- 4 substantial horizontal architectural graphite panels (`h-28 sm:h-36 laptop:h-48`) spanning the section entry with alternating horizontal wipes (`xPercent: [105, -105, 105, -105]`, `power3.inOut`, `toggleActions: 'play none none reverse'`), zero white flashes, and zero scroll hijacking.

### 8.2 The Four Creative Disciplines
1. **01 — DIGITAL EXPERIENCE (Interactive Architecture):**
   - Isometric wireframe mesh with crosshair cursor and coordinate HUD.
2. **02 — BRAND & IDENTITY (Systemic Design):**
   - Brutalist typographic scale matrix with dynamic kerning brackets and contrast ratios.
3. **03 — AI & INTELLIGENT SYSTEMS (Cognitive Engineering):**
   - Neural node telemetry stream with dynamic waveform and real-time inference metrics.
4. **04 — CREATIVE ENGINEERING (Hardware-Accelerated Web):**
   - 3D perspective wireframe prism with vertex nodes and 60 FPS GPU indicator.

### 8.3 Interaction Design
- **Custom Cursor:** Hovering over any capability panel triggers `setCursor('view', 'EXPLORE')`.
- **Card Perspective Tilt:** Direct GPU hardware-accelerated GSAP `quickTo` targeting `rotationX` and `rotationY` clamped to $\pm 4^\circ$, zero React component re-renders during mousemove. Disabled on touchscreens (`pointer: coarse`).
- **Illuminated Borders:** Soft glowing `#35E85B` border and corner brackets on hover.

---

## 9. Featured Works & Portfolio Architecture (Phase 05.0)

### 9.1 Section Opening & Editorial Hierarchy
- **Eyebrow:** `[04] SELECTED WORKS / STUDIO PORTFOLIO` with pulsating neon beacon.
- **Monumental Display Headline:**
  ```
  WE MAKE
  DIGITAL
  MATTER.
  ```
  Rendered in oversized `Syne` font with fluid responsive clamp, zero line wrapping (`whitespace-nowrap`), and line-masked staggered reveal.
- **Hash Neon Green Accent:** `DIGITAL` accented in signature `#35E85B`.
- **Supporting Description:** "We transform complex commercial ambitions and intelligent technologies into distinctive, high-performance digital experiences."
- **Studio Metadata:** `ARCHIVE // 2024 — 2026`, `[ 04 RELEASES ]`.

### 9.2 The Four Commissioned Works (Phase 05.1 Refined Art Direction)
1. **01 — PIXWALL (DIGITAL COMMERCE & EDITORIAL PRINT ATELIER):**
   - High-craft digital commerce storefront and limited-edition architectural artwork.
   - Dedicated visual: Museum-grade framed poster artwork with warm ivory mat board (passe-partout), realistic cotton rag paper texture, blind debossed studio seal (`HASH.DEVS // ATELIER EDITION`), limited run counter (`18/50`), and archival pigment curation tag. Truthful metrics: `310gsm Cotton`, `Anodized 18mm`, `12-Col Modular`.
2. **02 — VOX AI (INDUSTRIAL INTELLIGENCE HARDWARE):**
   - Precision-machined industrial voice intelligence device and operating interface.
   - Dedicated visual: Anodized 6061 graphite aluminum cylinder with diamond-cut chamfered bezel, micro-perforated acoustic grille, and restrained 1px Hash Neon Green LED ring indicating active 6-mic beamforming. Truthful metrics: `Anodized 6061`, `6-Ch MEMS Array`, `<5ms (Edge Test)`.
3. **03 — ILLORA AI (AUTONOMOUS ENTERPRISE INTELLIGENCE):**
   - Enterprise cognitive multi-agent orchestration console (`PIPELINE #8492`).
   - Dedicated visual: Structured directed graph topology connecting Supervisor Dispatcher with specialist worker agents (`POLICY EVAL`, `ZERO-TRUST PROOF`), animated SVG token data paths, and zero-trust proof indicators. Truthful metrics: `Directed Graph`, `Zero-Trust Node`, `Real-Time Sync`.
4. **04 — EXPERIMENTAL WORKS (CGI & CREATIVE ENGINEERING):**
   - Studio GPU fragment shader lab & real-time 3D liquid chrome sculpture.
   - Dedicated visual: Interactive Three.js WebGL canvas (`ExperimentalChromeScene.tsx`) rendering a liquid chrome Torus Knot manifold with procedural automotive studio reflections, smooth pointer parallax, and 60 FPS performance. Truthful metrics: `GLSL Raymarching`, `FP32 Precision`, `60 FPS Target`.

### 9.3 Interaction Choreography & Performance
- **Desktop Horizontal Scrubbing (>= 1024px):**
  - Smooth GSAP ScrollTrigger horizontal pinned track (`x` translated across track bounds).
  - Pinned control header with dynamic project counter (`01 / 04`) and hairline progress scrubber bar.
  - Natural entry and clean, unpinned release into subsequent page sections without aggressive scroll locking.
- **Mobile & Tablet Stack (< 1024px):**
  - Natural vertical card stack ensuring touch comfort and large imagery without forced horizontal scrolling.
  - Staggered scroll-triggered fade/rise entrances.
- **Perspective Depth & Cursor Integration:**
  - Hardware-accelerated pointer tilt via GSAP `quickTo` ($\pm 2.5^\circ$), strictly zero React re-renders. Disabled on touch interfaces.
  - Dynamic `VIEW PROJECT` cursor follower on card hover with smooth scale transition.

---

## 10. Immersive Project Case Study System (Phase 05.2)

### 10.1 Editorial Layout Architecture
- **Curtain Transition Overlay:** Full-viewport dark graphite curtain (`bg-[#0B0D0C]`) displaying project index (`COMMISSION [01]`) and title with GSAP `clipPath` reveal.
- **Case Study Hero:**
  - Eyebrow with return anchor: `← RETURN TO SELECTED WORKS` and index badge.
  - Monumental Syne display title with Hash Neon Green accent.
  - Curatorial metadata: Deliverable role, timeframe, status beacon, and tech stack tags.
  - Dominant 65–75vh visual frame showcasing the project's hero asset with precision graphite border rules and corner crosshairs.
- **Narrative Story (4-Part Chapter Reading):**
  - Asymmetric 12-column grid (`col-span-5` for titles, `col-span-7` for prose and takeaway card).
  - `01 // THE CHALLENGE`: Strategic domain friction and goals.
  - `02 // THE APPROACH`: Architectural philosophy and aesthetic direction.
  - `03 // THE ENGINEERING`: Concrete technical implementation details.
  - `04 // THE EXPERIENCE`: Sensory, tactile, and user-facing realization.
- **Technical Architecture & Telemetry Grid:**
  - Multi-tier system runtime inspection: Client layer, Core engine, Compute/Hardware layer, Protocol/Infrastructure layer.
  - 4-card telemetry dashboard with truthful metrics (e.g. `310gsm Cotton Rag`, `<5ms Edge Test`, `Zero-Trust Node`, `60 FPS Target`).
  - Monumental studio closing statement in bold Syne typography.
- **Circular Navigation Footer:**
  - Dual previous and next project cards with thumbnail teaser and direction chevron.
  - Circular looping enabling non-stop exploration of the 4 flagship commissions.
  - Center return button with magnetic hover interaction.

---

## 11. Production Quality Assurance & Micro-Refinements (Phase 05.3)

### 11.1 Flagship Visual Material Calibrations
- **Pixwall Luxury Art Atelier:** Museum-grade aluminum frame (`#1C1F1D` to `#0C0E0D`) with dual-bevel shadow (`0_25px_50px_-10px_rgba(0,0,0,0.95)`), 45° angled mat-cutter bevel showing warm museum ivory passe-partout (`#EAE7E1`), layered Bauhaus monolith art with hairline rules, and signature `#35E85B` foil accent stamp.
- **Vox AI Industrial Voice Device:** Anodized 6061-T6 aluminum cylinder chassis (`from-[#242E27] via-[#161E19] to-[#0E1410]`) with diamond-cut 45° chamfer specular gleam, top capacitive rotary dial with emerald indicator, and 3-tier precision CNC circular acoustic micro-perforations.
- **Illora AI Enterprise Console:** Multi-agent directed acyclic graph console (`PIPELINE #8492`) with 1,840 TPS cognitive supervisor dispatcher, curved SVG conduits with traveling token pulses, and active/proven specialist agent nodes.
- **Experimental Works Shader Lab:** Real-time liquid chrome Torus Knot with physical mirror reflections (`roughness: 0.03`, `envMapIntensity: 2.4`), high-density geometry (`160 × 36`), studio lighting rig, and zero-overhead RAF lifecycle.

### 11.2 Precision Accessibility Standards
- High-contrast `focus-visible:ring-2 focus-visible:ring-brand-neon` focus outlines across all interactive elements.
- Semantic `aria-label` annotations for screen readers on all case study and navigation anchors.
- Touch interaction safeguards suppressing mousemove listeners and 3D pointer tilt on `pointer: coarse` devices.

---

## 12. Studio Process & Creative Engineering System (Phase 06)

### 12.1 Section Architecture & Editorial Identity
- **Section Identifier:** `[05] STUDIO PROCESS / CREATIVE ENGINEERING` with pulsating Hash Neon Green beacon.
- **Monumental Headline:**
  ```
  FROM IDEA
  TO IMPACT.
  ```
  Rendered in oversized Syne font (`leading-[0.92]`) with `TO IMPACT.` accented in `#35E85B`.
- **Supporting Statement:** "We bring strategy, design and engineering together to transform ambitious ideas into meaningful digital experiences."
- **Desktop 12-Column Split Composition:**
  - Left 7 Columns: Vertical sequence of four structured process stages with interactive selection.
  - Right 5 Columns: Sticky dynamic architectural visual blueprint panel (`sticky top-28 self-start`) that smoothly updates as the user explores each stage.
- **Mobile Adaptive Layout (< 1024px):**
  - Organic vertical flow where each stage embeds its custom visual blueprint inline, eliminating forced sticky trapping or horizontal scrolling.

### 12.2 The Four Process Blueprints
1. **01 — DISCOVER & DEFINE (Triangulation Matrix):**
   - Analytical coordinate radar with triangulated vertices (`PROBLEM SPACE`, `AUDIENCE NEEDS`, `FEASIBILITY`).
   - Crosshair pings, validation badges, and coordinate markers communicating structured discovery.
2. **02 — STRATEGY & DIRECTION (System Blueprint):**
   - 12-column architectural hairline grid, information hierarchy stack, design token palette swatch, and tech architecture map.
3. **03 — DESIGN & ENGINEER (Engineering Crucible):**
   - Active compilation stream, component stack hierarchy, and real-time frame budget telemetry (`16.6ms`, `60 FPS`, `0.00 JANK`).
4. **04 — LAUNCH & EVOLVE (Edge Distribution Mesh):**
   - Global CDN mesh (`NYC`, `LON`, `FRA`, `TYO`), sub-25ms latency readouts, continuous deployment loop, and 100/100 Lighthouse benchmark.

### 12.3 Studio Position Manifesto
- Monumental closing typographic statement:
  `"GREAT PRODUCTS ARE NOT ACCIDENTAL. THEY ARE THE RESULT OF RIGOROUS ARCHITECTURE, RESTRAINED AESTHETICS, AND UNCOMPROMISING ENGINEERING."`

---

## 13. Contact & Project Initiation Experience (Phase 06.3)

### 13.1 Editorial Art Direction & Architectural Hierarchy
- **Identifier:** `07 // PROJECT INITIATION` with pulsating Hash Neon Green beacon.
- **Monumental Syne Display Headline:**
  ```
  LET'S BUILD
  SOMETHING EXCEPTIONAL.
  ```
  Rendered in oversized Syne display letterforms with `SOMETHING EXCEPTIONAL.` illuminated in signature Hash Neon Green (`#35E85B`).
- **Dark Editorial Surface Language:**
  - Canvas: Pure Obsidian Black (`#050505`).
  - Panels: Solid Obsidian Graphite (`#0E1210` with `#1E2420` borders), eliminating generic blurs and glassmorphism.
  - Accent: Hash Neon Green (`#35E85B`) for active states, brackets, and capacity indicators.
- **Asymmetric Split Layout (12 Columns):**
  - **Left Column (col-span-5): Direct Contact Sidebar:**
    - Live Studio Capacity HUD: `ACCEPTING COMMISSIONS // Q2 2026`.
    - Direct Email with one-click quick copy (`hello@hash.devs`).
    - Response SLA: `< 24 HOURS (MON–FRI)`.
    - Studio Hubs & Timezones: San Francisco (`PST / UTC-8`), London (`GMT / UTC+0`), Tokyo (`JST / UTC+9`).
    - Collaboration Modes & Verified Channels (GitHub, X, LinkedIn).
  - **Right Column (col-span-7): Project Inquiry Form:**
    - Form intake HUD with registration brackets (`⌜ ⌝ ⌞ ⌟`).
    - Required fields: Name, Work Email, Project Brief Description.
    - Discipline pill selector: Digital Product, Website & Experience, Branding & Identity, AI & Automation, Creative Technology, Other.
    - Budget range pills: `< $25K`, `$25K – $50K`, `$50K – $100K`, `$100K+`, `Flexible`.
    - Target timeline pills: Immediate, Within 1 month, Within 1–3 months, Flexible.
- **Studio Manifesto Anchor:**
  `"AMBITIOUS IDEAS DEMAND UNCOMPROMISING ENGINEERING."`
  `HASH.DEVS · INDEPENDENT CREATIVE TECHNOLOGY STUDIO · SAN FRANCISCO // LONDON // TOKYO`.

### 13.2 Form UX & Interaction Specifications
- **Real-Time Validation & Accessibility:** Instant client-side feedback on blur/submit, `aria-invalid`, `aria-describedby`, accessible error alerts, and live error clearing on input change.
- **Interaction Feedback:** Focus-visible neon borders (`focus-visible:border-brand-neon focus-visible:ring-brand-neon`), deliberate submit button response with stateful spinner, and duplicate submission prevention.
- **Submission Boundary (`inquiryService.ts`):** Documented clean boundary supporting `VITE_INQUIRY_API_ENDPOINT` with JSON payload; provides deterministic simulation returning unique reference codes (`INQ-HASH-XXXXXX`) in preview/dev environments.
- **Footer Connectivity:** Footer "Get in Touch" CTA seamlessly scrolls to `#contact` withLenis smooth scroll integration.

---

## 14. Cinematic Editorial Footer Design System (Phase 07.1)

### 14.1 Visual Hierarchy & Tri-Zone Architecture
The footer acts as the definitive architectural foundation and closing signature of the HASH.DEVS digital presence. It transitions from the dark graphite canvas of the homepage into a high-contrast editorial experience composed of three coordinated zones:

#### Zone A — Collaboration Banner
- **Background Surface:** Full-bleed `#35E85B` (Hash Neon Green).
- **Typography:** Syne display font in Obsidian Black `#050505`.
  - Lead Text: `"Let's work"` in ultra-lightweight font weight (`font-light`).
  - Accent Text: `"together."` in heavy, authoritative weight (`font-extrabold`).
  - Fluid sizing: `clamp(2.5rem, 6.2vw, 7.25rem)` with tight tracking (`tracking-tighter`) and line height (`leading-[0.92]`).
- **Understated Action Links:** Positioned alongside the headline:
  - `GET IN TOUCH`: Smooth-scrolls directly to the `#contact` project initiation form.
  - `CAREERS`: Direct mailto link for talent inquiries (`careers@hash.devs`).
  - Styled with monospaced uppercase typography, directional arrow indicators, and hover translation effects.

#### Zone B — Information Canvas
- **Background Surface:** `#F4F5F3` (Light Architectural Neutral) providing crisp editorial readability.
- **Typography:** Obsidian Black `#050505` with precise opacity tiering (`opacity-50` for meta labels, `opacity-75` for legal copy, full weight for active links).
- **Two-Sided Composition (12-Column Grid):**
  - **Left Column (6 cols):**
    - Network & Social Platforms (`GITHUB`, `TWITTER / X`, `LINKEDIN`) with directional hover indicators (`↗`) and underline animations.
    - Studio Standards & Legal (`PRIVACY POLICY`, `TERMS OF USE`).
    - Copyright stamp: `© 2026 HASH.DEVS. ALL RIGHTS RESERVED.`
  - **Right Column (6 cols):**
    - Direct Studio Inquiry Channel (`hello@hash.devs`).
    - Multi-Hub Presence: `SAN FRANCISCO`, `LONDON`, `TOKYO`.
    - Turnaround SLA: `RESPONSE TIME < 24 HOURS`.
    - Operating Availability Beacon: Pulsating green status indicator with `ACCEPTING COMMISSIONS // Q2 2026`.

#### Zone C — Monumental Oversized Logo Presentation
- **Official Brand Artwork:** Uses the official HASH.DEVS brand logo image (`/images/hashdevs-logo.png`), eliminating text approximations.
- **Surface Canvas:** Dark Obsidian Black `#050505` providing pure contrast for the white typography and vibrant `#35E85B` neon green accents.
- **Atmospheric Reflection:** Centered radial bloom with low-opacity neon green blur (`blur-3xl opacity-10`) creating subtle depth behind the emblem.
- **Proportional Integrity:** Strictly locked aspect ratio (1024:384 = 2.667) scaled responsively from `92vw` on mobile to `max-w-6xl` on desktop (1152×432 px at 1440px desktop) with zero horizontal overflow.

---

## 15. Official Brand Logo System & Asset Specifications

### 15.1 Brand Mark Anatomy & Color Calibration
The official HASH.DEVS brand mark unites two architectural elements:
1. **Geometric Emblem (`#`):** A dynamic slanted hashtag composed of three crisp white bars and a distinctive right vertical stroke rendered in signature **Hash Neon Green (`#35E85B` / `#3CE25A`)**.
2. **Custom Bold Wordmark (`HASH`):** Futuristic, rounded-corner uppercase typography with a diagonal neon green stroke accent slicing through the interior counter of the letter `A`.

### 15.2 Brand Asset Pipeline
- `public/images/hashdevs-logo.jpg`: Original master asset (1024×384 px, RGB mode, pure black `#000000` ground).
- `public/images/hashdevs-logo.png`: Lossless transparent PNG generated using straight-alpha unmultiplication, ensuring zero edge halos across dark brand canvases.
- `public/images/hashdevs-logo-tight.png`: Bounding-box cropped asset (830×221 px, 3.756 aspect ratio) for compact applications.
- `public/images/hashdevs-emblem.png`: Square 512×512 px isolated emblem with optical centering.
- `public/favicon.svg`: Vector SVG container with embedded base64 high-density emblem.
- `public/favicon.png` & `public/apple-touch-icon.png`: Multi-density raster favicons for broad browser compatibility.
- `public/images/hashdevs-og.jpg`: High-resolution 1200×630 px Open Graph social sharing banner.

### 15.3 Application Guidelines
- **Desktop Navigation:** Rendered at `h-7 sm:h-8 w-auto` (85×32 px), paired with a live status beacon.
- **Mobile Navigation Drawer:** Rendered at `h-6 w-auto` in drawer header.
- **Footer Information Area:** Embedded in an Obsidian `#050505` badge on the light neutral `#F4F5F3` canvas, ensuring contrast and brand consistency.
- **Monumental Footer Zone C:** Presented at full responsive width (up to 1152 px on desktop) against the Obsidian `#050505` foundation.

---

## 16. Immersive 3D Project Showcase System (Phase 05.4)

### 16.1 Curatorial Art Direction & Bespoke Subject Language
Each of the four featured projects in the studio portfolio features an independent, real-time 3D Three.js composition engineered with a distinct visual metaphor, material hierarchy, and kinetic behavior:

1. **PIXWALL — 3D Digital Art Atelier:**
   - **Metaphor:** Floating architectural gallery picture frame with layered monolith artwork.
   - **Material Language:** Anodized matte obsidian aluminum chassis (`#141716`, `metalness: 0.35`, `roughness: 0.38`), warm cotton-rag ivory mat board (`#EDE9E0`), tactile brushed titanium relief blade (`metalness: 0.95`, `roughness: 0.16`), and an anti-reflective protective museum glass plate (`transmission: 0.94`, `roughness: 0.06`).
   - **Kinetics:** Gentle floating levitation with interactive pointer-based parallax tilt.

2. **VOX AI — 3D Precision Industrial Hardware:**
   - **Metaphor:** High-end voice-native retail hardware product visualization.
   - **Material Language:** Anodized 6061-T6 graphite aluminum chassis (`#1D2621`, `metalness: 0.86`, `roughness: 0.26`), diamond-cut mirror chrome chamfer ring (`metalness: 1.0`, `roughness: 0.04`), and an active 360° beamforming neon-green LED ring (`#35E85B`, `emissiveIntensity: 3.6`).
   - **Kinetics:** Continuous turntable rotation, capacitive rotary dial indexing, and breathing soundwave orbital waveguides.

3. **ILLORA AI — 3D Autonomous Multi-Agent DAG Architecture:**
   - **Metaphor:** Coordinated spatial multi-agent intelligence constellation.
   - **Material Language:** Hexagonal faceted titanium enclosures (`#101724`, `metalness: 0.92`, `roughness: 0.22`), cyan and emerald autonomous processor cores (`#4DA6FF` and `#35E85B`), and translucent cybernetic conduits (`transmission: 0.75`).
   - **Kinetics:** Multi-tier physical spatial depth, decoupled harmonic node levitation, and discrete autonomous data token pulses traveling continuously across 3D spline conduits.

4. **EXPERIMENTAL WORKS — Liquid Chrome Laboratory:**
   - **Metaphor:** Sculptural computational fluid dynamics.
   - **Material Language:** Automotive-grade liquid chrome PBR material (`#F2F6FA`, `metalness: 1.0`, `roughness: 0.03`, `clearcoat: 1.0`).
   - **Kinetics:** Continuous organic fluid rotation with responsive pointer tracking.

### 16.2 Studio Lighting Philosophy
All four showcases utilize a unified lighting architecture:
- Procedural HDR PMREM environment reflection map generated on-the-fly (`zenithIntensity: 11-13`, `equatorIntensity: 15-17`).
- Dedicated key directional spotlight (`intensity: 2.4-2.6`).
- Studio rim accent light (`#35E85B` or cool cyan, `intensity: 2.0-2.2`).
- Ground bounce fill (`intensity: 1.0-1.2`) grounding the object in space.

### 16.3 3D Visual Refinement & Material Realism (Phase 05.4.1)
- **PIXWALL Physical Depth:**
  - True 4-piece mitered frame with beveled edges and rear backing board seal.
  - Passe-partout modeled via `THREE.ExtrudeGeometry` with a `THREE.Path` aperture revealing an authentic 45° beveled core edge.
  - Artwork plane physically recessed behind the mat board window at `z = -0.018`, completely eliminating z-fighting.
  - Archival paper fiber canvas stippling and museum matte finish (`roughness: 0.88`, zero plastic glare).
- **VOX AI Industrial Precision:**
  - Triple-tier acoustic perforation texture pipeline: Albedo map with radial specular chamfers, Bump map with deep occlusion gradients, and Roughness map (0.94 in bore cavity, 0.27 on aluminum face) eliminating flat dot artifacts.
  - Internal acoustic damper cloth layer inserted behind grille.
  - Anodized 6061-T6 graphite chassis with controlled metallic roughness (`0.28`).
  - Restrained Hash neon green `#35E85B` LED ring (`emissiveIntensity: 2.2`, `toneMapped: true`), avoiding excessive bloom.
- **ILLORA AI Spatial DAG Architecture:**
  - Rigorous 3D spatial hierarchy: Elevated supervisor node, midground synthesis & verification nodes, and deep background edge distribution node.
  - Grounded studio palette: Deep titanium (`#111622`), frosted polyhedral shells (`transmission: 0.65`), cobalt telemetry cores (`#3B82F6`), and Hash neon green `#35E85B` indicators. Eliminated garish purple/rainbow AI glow.
  - Mechanical anchor collars at node attachment points.
  - Zero heap allocation in animation loop via preallocated vector instances.
- **EXPERIMENTAL WORKS Reference Protection:**
  - Liquid-chrome torus knot geometry, PBR chrome material, and procedural reflections 100% preserved.
  - Added static beauty frame render on `prefersReducedMotion`.

---

## 17. About Page Immersive Studio Identity Experience (Phase 07)

### 17.1 Architectural Intent
The `/about` page represents the studio's philosophical and technical manifesto:
- **Cinematic About Hero (`AboutHero.tsx`, `AboutHero3DScene.tsx`):**
  - Full-screen `100svh` opening with monumental Syne headline (`WE ARE NOT HERE TO FOLLOW DIGITAL CONVENTIONS.`).
  - Interactive WebGL chrome kinetic sculpture featuring a high-density TorusKnot (`#e2e8f0`, roughness 0.08, metalness 0.95), an outer gyroscopic titanium ring (`#171A18`), and an inner neon wireframe core (`#35E85B`).
  - Studio HDR reflection environment map, pointer parallax with lerp damping, scroll rotation, and automatic render loop pausing when off-screen via `IntersectionObserver`.
  - Precision HUD technical coordinates (`COORDINATES // 37.7749° N, 122.4194° W`) and technical corner brackets (`⌜ ⌝ ⌞ ⌟`).
- **Studio Philosophy (`StudioPhilosophy.tsx`):**
  - Section 02 architectural statement: `"We build digital experiences where engineering precision meets creative ambition."`
  - High-contrast technical metadata cards: `PARADIGM // AOT_PBR`, `PRINCIPLE // BESPOKE_ONLY`, and `LATENCY SLA // <50MS`.
- **Who We Are & Architecture Topology (`WhoWeAre.tsx`):**
  - Studio positioning narrative emphasizing creative engineering without generic team card templates.
  - Interactive SVG architecture topology blueprint diagram showing node clustering between Creative Strategy, Experimental 3D, Production Engineering, and Intelligent Systems.
  - 4 studio performance metric cards: `100% Bespoke Codebase`, `< 50ms Interaction Latency`, `3 Hubs Global Reach`, `AOT / PBR CGI Pipeline`.
- **Our Approach & Operating Principles (`OurApproach.tsx`):**
  - 4 interconnected pillars: `01 — THINK DEEPLY`, `02 — DESIGN INTENTIONALLY`, `03 — ENGINEER PRECISELY`, `04 — EVOLVE CONTINUOUSLY`.
  - Interactive hover focus states, technical corner brackets, and discipline tags.
- **Creative Capabilities (`CreativeCapabilities.tsx`):**
  - 5-discipline capability matrix (`Digital Product Engineering`, `Web Experiences`, `Creative Technology`, `AI & Intelligent Systems`, `Brand Identity`).
  - Direct navigation bridge to `/services`.
- **Final Collaboration CTA & Footer (`AboutCollaborationCTA.tsx`, `About.tsx`):**
  - Section 06 closing statement (`HAVE SOMETHING WORTH BUILDING?`) and `LET'S TALK ↗` CTA.
  - Seamless continuation into the official 3-zone editorial `Footer` (Zone A Collaboration Banner, Zone B Info, Zone C Monumental Logo).

---

## 18. Services Page Cinematic Capability Experience (Phase 08)

### 18.1 Architectural Intent
The `/services` page represents the studio's technical offering, discipline integration, and engineering methodology:
- **Cinematic Services Hero (`ServicesHero.tsx`, `ServicesHero3DScene.tsx`):**
  - Full-screen `100svh` opening with monumental Syne headline (`WE ENGINEER DIGITAL EXPERIENCES.`), with selective neon-green `#35E85B` highlighting on `DIGITAL`.
  - Bespoke real-time Three.js mechanical kinetic sculpture: Machined mirror-finish chrome Icosahedron (`#f3f5f8`, metalness 0.98, roughness 0.06), counter-rotating dark titanium gimbal rings (`#171a18` and `#222824`), an inner glowing neon wireframe octahedron (`#35e85b`), and floating cardinal spatial sensor spheres.
  - Procedural HDR reflection map, pointer parallax with lerp damping, scroll tracking, ACESFilmic tone mapping, and automatic render loop pausing when off-screen via `IntersectionObserver`.
  - Precision HUD technical coordinates (`COORDINATES // 37.7749° N, 122.4194° W`) and technical corner brackets (`⌜ ⌝ ⌞ ⌟`).
- **Capabilities Introduction (`CapabilitiesIntro.tsx`):**
  - Section 02 architectural statement: `ONE STUDIO. MULTIPLE DISCIPLINES.`
  - High-contrast technical metadata cards: `ARCHITECTURE // 100% BESPOKE ENGINEERING`, `CULTURE // ZERO TEMPLATE DOGMA`, and `CAPACITY // LIMITED CONCURRENT COMMISSIONS`.
- **Services Discipline Matrix (`ServicesDisciplineMatrix.tsx`, `ServiceRow.tsx`):**
  - Section 03 core discipline matrix featuring 5 substantial expandable rows: `01 — DIGITAL PRODUCT ENGINEERING`, `02 — WEB EXPERIENCES`, `03 — CREATIVE TECHNOLOGY`, `04 — AI & INTELLIGENT SYSTEMS`, `05 — BRAND IDENTITY`.
  - Accessible accordion interaction supporting keyboard navigation (`Enter`, `Space`, `ArrowUp`, `ArrowDown`), `aria-expanded`, and `aria-controls`.
  - Rich expanded view detailing core capability pills, key deliverables checklists, performance SLAs (Latency, Lighthouse, Framerate), and direct `EXPLORE DISCIPLINE ↗` links.
- **Engineering Methodology (`EngineeringApproach.tsx`):**
  - Section 04 4-tier lifecycle: `01 — UNDERSTAND`, `02 — ARCHITECT`, `03 — BUILD`, `04 — EVOLVE`.
  - Custom minimal architectural SVG diagrams for each stage (radar discovery, DAG architecture, state pipeline, telemetry feedback loop) and key milestone checklists.
- **Technology & Craft Repertoire (`TechnologyCraft.tsx`):**
  - Section 05 engineering showcase grouped into 5 categories: `Frontend`, `Backend`, `Infrastructure`, `Creative Technology`, and `Intelligent Systems`.
  - Included 6th Studio Quality Guarantee card highlighting 100% bespoke codebases, `< 50ms` runtime latency, and zero layout thrashing.
- **Collaboration CTA & Official Footer Integration (`ServicesCollaborationCTA.tsx`, `Services.tsx`):**
  - Section 06 closing statement (`HAVE AN AMBITIOUS IDEA? LET'S ENGINEER IT.`) with dual CTAs: `START A PROJECT ↗` (links to `/contact`) and `EXPLORE OUR WORK ↗` (links to `/work`).
  - Seamless continuation into the official 3-zone editorial `Footer` (Zone A Collaboration Banner, Zone B Info, Zone C Monumental Logo).

---

---

## 20. Launch Optimization, Error Boundaries & Void Aesthetics (Phase 09)

### 20.1 Route Anomaly (404) Void Design Language
- **Identifier:** `ROUTE ANOMALY // 404` displayed in high-contrast Space Mono with pulsing neon status indicator.
- **Monumental Display:** Syne Extrabold `THE DIGITAL VOID.` in Pure White `#FFFFFF` with `PAGE NOT FOUND.` in Hash Neon Green `#35E85B`.
- **Architectural Framing:** Subtle grid matrix overlay (`opacity: 0.03`) with a bordered dossier panel informing the visitor that the requested coordinates do not resolve to an active archive node.
- **Tripartite Recovery Actions:**
  1. `← RETURN HOME`: Immediate navigation to `/`.
  2. `EXPLORE ARCHIVE ↗`: Secondary link to `/work`.
  3. `START A PROJECT ↗`: Direct high-conversion link to `/contact`.

### 20.2 Error Boundary & WebGL Degradation Strategy
- **React Error Boundary:** Catches runtime UI errors, logging telemetry to `console.error` and presenting an editorial recovery screen with reload triggers rather than white-screening.
- **WebGL Context Loss Fallback:** If the client GPU crashes or exhausts context limits (`webglcontextlost`), 3D canvases fail gracefully to static dark architectural backdrops without interrupting DOM interactions.
- **Occlusion-Based Render Pausing:** Canvases leverage `IntersectionObserver` and document `visibilitychange` listeners to drop requestAnimationFrame execution to 0 FPS when out of view, preserving user battery and preventing thermal throttling.

### 20.3 Accessible Design Hierarchy (WCAG 2.2 AA)
- **Skip Link:** Off-screen accessibility landmark (`<a href="#main-content">Skip to main content</a>`) that slides into view upon keyboard focus with high-contrast neon outline.
- **Contrast Compliance:** 
  - Primary text (`#FFFFFF`) on Obsidian Black (`#050505`) achieves an exceptional contrast ratio of **19.8:1** (exceeding WCAG AAA).
  - Accent text (`#35E85B`) on Obsidian Black achieves a contrast ratio of **12.4:1** (exceeding WCAG AAA).
  - Muted secondary copy (`#8E968F`) achieves a contrast ratio of **5.3:1** (exceeding WCAG AA).





