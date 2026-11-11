# HASH.DEVS — SYSTEM ARCHITECTURE & ENGINEERING FOUNDATION

## 1. Architectural Philosophy

HASH.DEVS is engineered as an enterprise-grade creative front-end architecture. Unlike conventional web applications, a creative development studio requires a delicate balance between **heavy animation / WebGL execution** and **zero layout jank, immediate interactivity, and strict accessibility**.

### Guiding Principles:
1. **Decoupled 3D Canvas:** The Three.js canvas layer sits in an isolated rendering layer (`z-index: 1`), communicating via reactive props and refs, never forcing re-renders of the DOM tree.
2. **Synchronized Motion Engine:** Scrolling and animations are orchestrated by a single central ticker (`gsap.ticker`), avoiding uncoordinated `requestAnimationFrame` loops.
3. **Strict Memory & Context Cleanup:** All Three.js geometries, materials, textures, and GSAP ScrollTrigger instances are guaranteed complete teardown on component unmount and route changes.
4. **Performance Budgets:** JavaScript bundles are split into `vendor`, `animation`, `three`, and `app` chunks to keep First Contentful Paint under 1.2 seconds.

---

## 2. Directory Architecture & Boundary Rules

```
src/
├── assets/                  # Static media imported into code
├── components/
│   ├── animations/          # Pure animation helper components (HeroIntro)
│   ├── common/              # Atomic reusable UI
│   ├── layout/              # RootLayout, SmoothScrollProvider, MainContainer, etc.
│   ├── navigation/          # Navigation, DesktopNavigation, MobileNavigation, NavDrawer, AudioController
│   └── ui/                  # Buttons, Badges, CustomCursor, CursorContext, MagneticElement
├── sections/
│   └── home/
│       ├── BrandStatement/  # BrandStatement, BrandStatementAnimations
│       ├── StudioShowcase/  # StudioShowcase, CapabilityPanel, StudioShowcaseAnimations
│       └── HeroSection/     # HeroSection, HeroContent, HeroScene, HeroScrollTransition, emblemData
├── pages/                   # Route views (Home, About, Services, Work, Contact, DesignSystemLab)
├── hooks/                   # Custom reusable React hooks (useGsapContext, useMagnetic, etc.)
├── lib/
│   ├── animations/          # GSAP configuration, Lenis synchronization, reveal utilities
│   └── utils/               # Class merging (cn) and pure helper functions
├── styles/                  # Tailwind base & CSS variables
└── types/                   # TypeScript interfaces and domain schemas
```

---

## 3. Three.js 3D Emblem Architecture

### 3.1 Scene Composition & Physical Shading (Phase 03.3 Final Look-Dev)
The 3D Hero Emblem (`HeroScene.tsx`) is built with direct Three.js for optimal control, maximum execution speed, and zero overhead from wrapper abstraction libraries.
- **Renderer:** `THREE.WebGLRenderer` configured with `alpha: true`, `antialias: true`, `toneMapping: THREE.ACESFilmicToneMapping`, `toneMappingExposure: 1.05`, `outputColorSpace: THREE.SRGBColorSpace`, and capped pixel ratio `Math.min(window.devicePixelRatio, 2)`.
- **Floating-Point 1024×512 Studio HDRI PMREM:** 32-bit floating-point HDR environment map generated with analytical cosine falloffs, zenith overhead softbox ($Y = 60$, peak $18.0$), multi-tiered frontal softboxes ($Y = 180, 310, 420$, peak $22.0$), equator negative-fill flags ($Y = 236\text{--}268$, factor $0.03$), dual razor horizon gleams ($Y = 250, 365$, peak $26.0$), vertical strip softboxes ($X = 220, 820$), and floor bounce. Convolved via `THREE.PMREMGenerator.fromEquirectangular` with complete GPU pre-filtering.
- **Dual-Tiered Segment Extrusion:**
  - Segment data curated in `src/sections/home/emblemData.ts` with Catmull-Rom cubic spline resampling (64 points per contour) for $C^1$ tangent-continuous curvature.
  - Tier 1: Outer machined sidewall chassis (`depth: 0.10`, `bevelThickness: 0.028`, `bevelSize: 0.024`, `bevelSegments: 8`).
  - Tier 2: Domed cushion cap (`depth: 0.06`, `bevelThickness: 0.052`, `bevelSize: 0.036`, `bevelSegments: 16`, $Z = 0.085$).
  - $+0.069$ forward protrusion generates authentic automotive badge depth with dark recessed channels and double-ridge specular highlights.
- **Calibrated PBR Physical Materials:**
  - Mirror Chrome Face: `THREE.MeshPhysicalMaterial` (`metalness: 1.0`, `roughness: 0.038`, `clearcoat: 1.0`, `clearcoatRoughness: 0.018`, `envMapIntensity: 2.2`, `toneMapped: true`).
  - Dark Gunmetal Chrome Sidewalls: `metalness: 0.98`, `roughness: 0.13`, `clearcoat: 0.6`, `clearcoatRoughness: 0.04`, `envMapIntensity: 1.5`.
  - Signature Green Blade Face: Saturated electric lacquer (`#00F508`, `metalness: 0.05`, `roughness: 0.12`, `clearcoat: 1.0`, `clearcoatRoughness: 0.025`, `envMapIntensity: 0.45`, `toneMapped: false`).
  - Green Sidewalls: Deep emerald composite (`#006818`, `metalness: 0.05`, `roughness: 0.22`, `toneMapped: false`).
- **Memory Disposal Lifecycle:**
  ```ts
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach((mat) => mat.dispose());
      } else {
        obj.material.dispose();
      }
    }
  });
  pmremGenerator.dispose();
  envTexture.dispose();
  renderer.dispose();
  ```
- **Fallback Hierarchy:** If WebGL is unavailable or `prefers-reduced-motion` is active, the scene cleanly renders a high-contrast geometric SVG vector emblem with no runtime penalties.

---

## 4. Motion & Scroll Synchronization

### 4.1 The Lenis + GSAP ScrollTrigger Bridge
```
[Window Wheel / Touch Event]
           │
           ▼
     [Lenis Virtualizer]
           │
           ├─── (scroll event) ───► [ScrollTrigger.update()]
           │
[GSAP Ticker (RAF 60/120Hz)]
           │
           └───► lenis.raf(time * 1000)
```
- `gsap.ticker.lagSmoothing(0)` guarantees frame drops never cause rubber-banding or out-of-sync triggers.

### 4.2 Hero Scroll Exit Scrub
- Driven by `ScrollTrigger.create({ trigger: sectionRef, scrub: 0.8 })`.
- Interpolates the 3D emblem's rotation, Y translation, Z distance, and scale while simultaneously executing a smooth parallax fade on the hero headline typography.

---

## 5. Navigation State Architecture

- **`Navigation.tsx`:** Single top-level controller tracking window scroll offset and scroll direction.
- **Direction-Aware Visibility:** Tracks `currentScrollY` versus `lastScrollYRef.current`. Hides when scrolling down past 180px; restores smoothly when scrolling up.
- **Scroll Lock Protocol:** Full-screen mobile drawer (`NavDrawer.tsx` / `MobileNavigation.tsx`) invokes `lenis.stop()` and freezes `body.style.overflow` upon expansion, completely releasing both upon dismissal.

---

## 6. Brand Statement & Studio Showcase Architecture (Phase 04 & 04.1)

### 6.1 CapabilityPanel Zero-Rerender GPU Tilt
To maintain a strict 60/120 FPS performance budget, `CapabilityPanel.tsx` eliminates React component re-renders during mouse movement:
- **Prior Anti-Pattern:** Calling `useState` (`setTilt`) on per-frame `mousemove` triggered 60 component re-renders per second, reconciling complex SVG geometries and descendant trees.
- **Optimized Implementation:** Utilizes GSAP `quickTo` targeting `panelRef.current` directly (`rotationX` and `rotationY`), updating CSS transforms on the compositor thread without touching React virtual DOM.
- **Touch Safe:** Uses `window.matchMedia('(pointer: coarse)')` to bypass tilt mathematics on touch devices.

### 6.2 Architectural Mechanical Slat Shutter
- The transition between Brand Statement and Studio Showcase is bridged by a 4-tier horizontal shutter screen (`.shutter-slat`).
- Staggered horizontal wipes (`xPercent: [105, -105, 105, -105]`, `stagger: 0.09s`, `ease: 'power3.inOut'`) create a tactile mechanical aperture reveal.
- Both entrance and reverse scroll directions are fully synchronized via `toggleActions: 'play none none reverse'`.

---

## 7. Featured Works & Portfolio Architecture (Phase 05.0 & 05.1)

### 7.1 Module Architecture
```
src/sections/home/FeaturedWorks/
├── FeaturedWorks.tsx            # Root section controller & pinned desktop viewport orchestrator
├── FeaturedProject.tsx          # Project card container, GPU pointer tilt, & cursor triggers
├── ProjectVisual.tsx            # Bespoke visual compositions (Pixwall, Vox AI, Illora, Experimental)
├── ExperimentalChromeScene.tsx  # Interactive Three.js WebGL liquid chrome Torus Knot CGI
├── FeaturedWorksAnimations.ts   # ScrollTrigger horizontal pin timeline & responsive matchMedia
├── projects.ts                  # Structured project dataset, metrics, tags, and deliverable specs
└── index.ts                     # Public module barrel
```

### 7.2 Desktop Horizontal Pinned Scroll & Mobile Stack
- **Responsive matchMedia Choreography:**
  - `(min-width: 1024px)`: Activates GSAP ScrollTrigger pinning on `.laptop:h-screen` container. Translates `.galleryTrack` along the X-axis by `-(track.scrollWidth - window.innerWidth + 80)`.
  - Scrubber synchronization: Directly animates the top hairline progress bar (`scaleX`) and project index counter (`01 / 04` to `04 / 04`) inside the pinned viewport.
  - Natural unpinning: Clean exit without aggressive scroll trapping once the 4th project clears.
  - `(max-width: 1023px)`: Deactivates horizontal pinning, translating the track to `x: 0` and rendering project cards as an organic vertical stack with individual scroll entrances.

### 7.3 High-Performance Interaction & WebGL Lifecycle
- **60 FPS Hardware-Accelerated Tilt:** Uses GSAP `quickTo` on `rotationX` and `rotationY` clamped to $\pm 2.5^\circ$, completely bypassing React render cycles.
- **Isolated Three.js Canvas (`ExperimentalChromeScene.tsx`):**
  - Uses `IntersectionObserver` to pause requestAnimationFrame loops when the element is off-screen, conserving CPU/GPU cycles.
  - Complete memory teardown on unmount (`geometry.dispose()`, `material.dispose()`, `pmremGenerator.dispose()`, `renderer.dispose()`), eliminating WebGL memory leaks.
- **Custom Cursor Integration:** Invokes `setCursor('view', 'VIEW PROJECT')` on card hover, transforming the outer follower ring into an expanded neon interactive badge.
- **Strict Reduced Motion Conformance:** Respects `prefers-reduced-motion` across all entrances and disables horizontal pinning when active.

---

## 8. Case Study Subsystem Architecture (Phase 05.2)

### 8.1 Module Architecture
```
src/sections/home/CaseStudies/
├── caseStudies.ts             # Truthful project data models, narratives, specs, & metrics
├── CaseStudyPage.tsx          # Dynamic route controller (/work/:id), error recovery & scroll resets
├── CaseStudyTransition.tsx    # High-performance GSAP clip-path curtain overlay
├── CaseStudyHero.tsx          # Monumental typography, metadata, & dominant 70vh visual asset
├── CaseStudyStory.tsx         # Asymmetric 12-column 4-part editorial narrative
├── CaseStudyVisual.tsx        # Multi-tier runtime architecture, live telemetry & manifesto
├── CaseStudyNavigation.tsx    # Circular previous/next commission cards & return anchor
├── CaseStudyAnimations.ts     # Chapter scroll-trigger entrance coordinator
└── index.ts                   # Public module barrel exports
```

### 8.2 Routing & Lifecycle Management
- **Route Definition:** Bound in `src/App.tsx` via `<Route path="/work/:id" element={<CaseStudyPage />} />`.
- **Dynamic Parameter Resolution:** `CaseStudyPage` extracts `:id` through `useParams()`, validating against `CASE_STUDIES_DATA`. Invalid routes display an architectural fallback with a one-click return to `/`.
- **Scroll Position Reset:** An immediate `window.scrollTo(0, 0)` is invoked upon route mounting, guaranteeing fresh entry at the top of the case study.
- **GSAP Lifecycle & Teardown:**
  - Route curtain overlay coordinates with GSAP `gsap.timeline()` using `clipPath: polygon(0 0, 100% 0, 100% 0%, 0 0%)`.
  - Chapter scroll reveals are encapsulated in `gsap.context()` inside `CaseStudyAnimations.ts`, reverting all listeners and ScrollTrigger instances on unmount.
  - Three.js WebGL canvas on `/work/experimental` disposes of renderer, geometry, materials, and PMREM maps immediately upon route departure.

---

## 9. Performance & Production Quality Assurance (Phase 05.3)

### 9.1 Zero-Overhead WebGL Lifecycle
In `ExperimentalChromeScene.tsx`, the requestAnimationFrame loop is decoupled from continuous execution:
- An `IntersectionObserver` instance monitors viewport intersection.
- When the canvas exits the viewport, the active `requestAnimationFrame` handle is canceled, completely halting CPU/GPU rendering ticks.
- When the element re-enters the viewport, the render loop seamlessly resumes from the stored clock state.
- On unmount, all GPU buffers (`TorusKnotGeometry`, `MeshPhysicalMaterial`, PMREM render targets, HDR textures, and WebGL context) are systematically disposed.

### 9.2 Exact Horizontal Scrub Calculation
In `FeaturedWorksAnimations.ts`:
- Replaced approximate pixel offsets with mathematically exact scroll travel:
  $$\Delta x = \max(0, \text{track.scrollWidth} - \text{window.innerWidth})$$
- Ensures that the 4th project card comes to rest with right-padding that perfectly mirrors the left-padding of the 1st card.
- Synchronized progress scrubber and index counter (`01 / 04` to `04 / 04`) operate identically in forward and reverse scroll directions.

---

## 10. Studio Process Subsystem Architecture (Phase 06)

### 10.1 Module Architecture
```
src/sections/home/StudioProcess/
├── processData.ts              # Structured process stages, deliverables, & content schema
├── StudioProcess.tsx           # Split layout controller, section header, & manifesto
├── ProcessStageItem.tsx        # Individual stage card with registration brackets & mobile view
├── ProcessVisualBlueprint.tsx  # Dynamic architectural visual blueprint engine (4 modes)
├── StudioProcessAnimations.ts  # Bidirectional ScrollTrigger coordinator & line-mask reveals
└── index.ts                    # Public module barrel exports
```

### 10.2 Interaction & Motion Architecture
- **Bidirectional ScrollTrigger Integration:**
  - On desktop (`min-width: 1024px`), ScrollTrigger monitors each stage's position relative to the viewport center.
  - As the user scrolls downwards, `onEnter` activates the corresponding visual blueprint.
  - When the user scrolls in reverse, `onEnterBack` triggers stage reactivation in reverse order, ensuring seamless state synchronization without layout shifts.
- **Responsive Layout Strategy:**
  - Desktop: Uses CSS `sticky top-28 self-start` for the right 5-column visual blueprint, keeping visual context anchored alongside the stage descriptions.
  - Tablet & Mobile: Decouples sticky positioning to prevent scroll trapping, embedding the visual blueprint directly inside each stage card.
- **Teardown & Reduced Motion:**
  - All timelines and triggers are registered inside `gsap.context()`, guaranteeing complete revert on unmount.
  - When `prefers-reduced-motion` is active, animations are bypassed and elements are rendered with static layout geometry.

---

## 11. Contact & Inquiry Subsystem Architecture (Phase 07)

### 11.1 Module Architecture
```
src/sections/home/Contact/
├── contactConfig.ts         # Centralized form schema, validation rules, and contact metadata
├── inquiryService.ts        # Abstracted submission service with production webhook support
├── DirectContactInfo.tsx    # Studio direct contact sidebar, hub timezones, and network links
├── ProjectInquiryForm.tsx   # Accessible project inquiry form with validation lifecycle
├── ContactAnimations.ts     # GSAP ScrollTrigger entrance coordinator
├── ContactSection.tsx       # Root layout coordinator, section header, and manifesto
└── index.ts                 # Public module barrel exports
```

### 11.2 Backend Contract & Service Abstraction
- **Environment Contract:** The intake pipeline is configured via `VITE_INQUIRY_API_ENDPOINT` (documented in `.env.example`).
- **Data Payload Schema:**
  ```typescript
  {
    name: string;
    email: string;
    company?: string;
    projectType: string;
    description: string;
    budget: string;
    timeline: string;
    submittedAt: string;
    source: string;
  }
  ```
- **Fallback Simulation:** When no endpoint is configured in development or preview environments, `submitProjectInquiry()` simulates network transmission with a 600ms latency, returning a structured reference code without writing sensitive inquiry data to `localStorage`.
- **Security & Validation:** Client-side sanitization enforces strict RFC 5322 email patterns, prevents empty submissions, and guards against duplicate clicks by disabling action controls during the `submitting` state.

---

## 12. Editorial Footer Architecture (Phase 07.1)

### 12.1 Directory Structure & Component Boundaries
```
src/sections/home/Footer/
├── footerConfig.ts            # Centralized footer metadata, links, hubs, and legal configuration
├── CollaborationBanner.tsx    # Zone A: Hash Neon Green collaboration banner with action links
├── InformationFooter.tsx      # Zone B: Two-sided light neutral information and direct contact grid
├── OversizedWordmark.tsx      # Zone C: Monumental baseline-cropped HASH.DEVS typography
├── FooterAnimations.ts        # GSAP ScrollTrigger entrance effects and lifecycle cleanup
├── Footer.tsx                 # Semantic <footer> root container integrating all three zones
└── index.ts                   # Public barrel exports
```

### 12.2 Scroll & Navigation Integration
- **Internal Anchor Interoperability:** The `GET IN TOUCH` button within `CollaborationBanner` interacts directly with Lenis smooth-scroll. Clicking invokes `element.scrollIntoView({ behavior: 'smooth', block: 'start' })`, scrolling cleanly up to `#contact` with target top = -0.47px.
- **Monumental Logo Presentation Geometry:** Zone C replaces text approximations with the official logo image (`#footer-wordmark-image`) mounted against `bg-brand-obsidian` (`#050505`). The image scales with preserved aspect ratio (2.667) up to 1152×432 px on desktop while guaranteeing strict zero-overflow metrics (`maxScrollW <= windowInnerW`) across all mobile, tablet, and desktop viewports.
- **Lifecycle Cleanliness:** All ScrollTrigger animations created in `FooterAnimations.ts` are bound to a GSAP context scoped to `footerRef`, guaranteeing complete teardown upon route changes or unmounts.

---

## 13. Brand Asset Architecture & Pipeline

### 13.1 Centralized Asset Repository
All official brand assets reside within `public/`:
```
public/
├── favicon.svg                   # Vector SVG favicon with embedded high-DPI official emblem
├── favicon.png                   # 64×64 raster favicon
├── apple-touch-icon.png          # 192×192 Apple touch icon
└── images/
    ├── hashdevs-logo.jpg         # Master asset (1024×384 px, black background)
    ├── hashdevs-logo.png         # Unmultiplied transparent PNG (1024×384 px)
    ├── hashdevs-logo-tight.png   # Tight-cropped PNG (830×221 px)
    ├── hashdevs-emblem.png       # Isolated square 512×512 px emblem icon
    └── hashdevs-og.jpg           # 1200×630 px Open Graph social card
```

### 13.2 Delivery & Display Strategy
- **Retina Crispness:** The master 1024×384 asset is rendered at 85×32 px in desktop navigation, providing >12× pixel density for razor-sharp rendering on 2x/3x/4x mobile and Retina screens.
- **Zero Haloing:** Alpha extraction utilizes straight-alpha unmultiplication, ensuring pure anti-aliased edges without dark halos when layered over brand surfaces.
- **Centralized Reference:** All components import logo dimensions and URLs from `src/sections/home/Footer/footerConfig.ts` or reference `/images/hashdevs-logo.png`.

---

## 14. 3D Project Showcase Subsystem (Phase 05.4)

### 14.1 Directory Layout & Component Roles
```
src/sections/home/FeaturedWorks/
├── ProjectVisuals/
│   ├── sharedEnv.ts             # Procedural HDR equirectangular PMREM generator
│   ├── Pixwall3DScene.tsx       # PIXWALL: Floating framed art sculpture with glass reflections
│   ├── VoxAI3DScene.tsx         # VOX AI: Anodized aluminum retail device with CNC perforations
│   ├── IlloraAI3DScene.tsx      # ILLORA AI: Multi-agent DAG constellation with data pulse paths
│   └── index.ts                 # Barrel export for visual showcase scenes
├── ExperimentalChromeScene.tsx  # EXPERIMENTAL WORKS: Liquid chrome torus knot
├── ProjectVisual.tsx            # Visual container coordinating top HUD, 3D mount, and bottom telemetry
└── FeaturedProject.tsx          # Card container with GSAP 3D perspective mouse tilt
```

### 14.2 Rendering Lifecycle & Zero-Idle GPU Optimization
- **IntersectionObserver Gating:** Each 3D scene registers an `IntersectionObserver` instance on its mount container with threshold `0.05`. When a card scrolls outside the active viewport, `cancelAnimationFrame` immediately terminates the render loop, reducing idle GPU consumption to zero.
- **Strict WebGL Disposal:** Component unmounting executes exhaustive resource disposal:
  - Geometries: `.dispose()` called on all component meshes, rings, tubes, and hulls.
  - Materials: `.dispose()` called on standard, physical, and basic materials.
  - Textures: Procedural canvas textures and PMREM render targets systematically disposed.
  - DOM Teardown: Renderer DOM canvas element detached, event listeners deregistered, and observer disconnected.
- **Performance Caps:** Pixel ratio is bounded via `Math.min(window.devicePixelRatio, 1.5)` to protect mobile frame rates and prevent GPU thermal throttling.

### 14.3 Performance Engineering & Zero-Allocation Loops (Phase 05.4.1)
- **Zero Heap Allocations in Render Loops:**
  - Removed all `new THREE.Vector3()`, `new THREE.Matrix4()`, or object instantiations within `requestAnimationFrame` ticks.
  - Spline trajectory and data pulse coordinates are calculated using preallocated scratch vectors (`pt1`, `pt1b`, `pt2`, `pt2b`, `pt3`, `pt3b`), guaranteeing 0 bytes/frame Garbage Collection pressure.
- **Adaptive Responsive DPR Scaling:**
  - Mobile viewports (`< 768px`) cap `renderer.setPixelRatio` at `1.25`, preventing thermal throttling on compact OLED/Retina displays.
  - Desktop viewports cap `renderer.setPixelRatio` at `1.5` for crisp edge definition without redundant 3x/4x overdraw.
- **Accessibility & Reduced Motion:**
  - `prefers-reduced-motion` executes a single static beauty frame render (`renderStaticFrame()`) upon mounting and on resize, ensuring users with vestibular sensitivities experience the 3D art direction without continuous animation loops.

