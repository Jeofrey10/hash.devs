# HASH.DEVS

> **DIGITAL EXPERIENCES, ENGINEERED.**  
> A premier creative technology and digital engineering studio portfolio crafting cinematic, immersive, and technologically sophisticated web experiences.

---

## 1. Project Overview

HASH.DEVS is an award-winning creative engineering studio website built on modern web standards. Inspired by world-class creative studios like [Trionn](https://trionn.com/), the platform blends experimental aesthetics, editorial display typography, high-performance animation engineering, interactive Three.js 3D WebGL scenes, and architectural precision.

The codebase represents a fully optimized, production-ready release tested across desktop, laptop, tablet, and mobile devices with zero console errors, zero horizontal overflow, and accessible semantic architecture.

---

## 2. Brand Identity & Design Tokens

The visual language rejects generic corporate AI templates, gradient blobs, and cookie-cutter dashboards in favor of high-contrast, editorial brutalism and refined techno-minimalism.

| Token Name | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| **Obsidian Black** | `#050505` | Primary canvas & root background |
| **Hash Neon Green** | `#35E85B` | Accent highlights, focus states, interactive energy |
| **Pure White** | `#FFFFFF` | Primary headlines & high-contrast typography |
| **Graphite** | `#171A18` | Structural grid lines, borders, secondary surfaces |

### Typography Hierarchy
- **Display Headings:** Syne (`font-display`) — Monumental brutalist typography with fluid `clamp()` sizing.
- **Body Copy:** Manrope (`font-body`) — Clean, legible editorial reading experience.
- **Technical Coordinates & Meta:** Space Mono (`font-mono`) — Precision system indices, timestamps, and architectural labels.

---

## 3. Technology Stack

- **Core Framework:** React 18 (Strict Mode) with TypeScript
- **Bundler & Build Tool:** Vite 5 with code splitting and asset hashing
- **Styling Engine:** Tailwind CSS with custom CSS variables & dynamic clamp tokens
- **Routing:** React Router v6 with code-split lazy loading (`React.lazy` + `Suspense`)
- **3D Graphics Engine:** Three.js with custom procedural geometries, PBR materials, procedural HDRI PMREM environments, and tab/scroll rendering occlusion
- **Motion Engine:** GSAP 3 (GreenSock) + ScrollTrigger
- **Smooth Scroll:** Lenis smooth scrolling synchronized with the GSAP ticker
- **SEO & Social:** Schema.org JSON-LD, OpenGraph, Twitter Cards, XML Sitemap, and robots.txt

---

## 4. Route Map & Pages

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | **Home** | Interactive 3D emblem hero, studio showcase, featured works, capability overview, and contact section |
| `/about` | **About** | Studio narrative, interactive 3D sculpture, philosophy, leadership, and awards |
| `/services` | **Services** | Studio disciplines, interactive 3D sculpture, technical capabilities, process timeline, and client benefits |
| `/work` | **Work Archive** | Curated project archive, filterable disciplines, and project cards |
| `/work/:id` | **Case Study** | Deep-dive case studies with architectural metrics, challenges, and solutions (`pixwall`, `vox-ai`, `illora-ai`, `experimental`) |
| `/contact` | **Contact** | Direct studio communication via native `mailto:` brief compilation and direct phone link (zero backend) |
| `*` | **Route Anomaly (404)** | Architectural 404 void experience with recovery navigation |

---

## 5. Architectural Directory Layout

```
├── public/
│   ├── _redirects           # SPA redirect rules for Cloudflare/Netlify
│   ├── favicon.svg          # Custom brand monogram
│   ├── robots.txt           # Production search crawler rules
│   └── sitemap.xml          # XML sitemap for canonical indexing
├── src/
│   ├── assets/              # SVG vectors and raster media
│   ├── components/
│   │   ├── common/          # Shared atomic components & ErrorBoundary
│   │   ├── layout/          # RootLayout, MainContainer, SmoothScrollProvider
│   │   ├── navigation/      # Studio Header, MobileMenu, Footer
│   │   └── ui/              # Interactive buttons, badges, custom cursor
│   ├── hooks/               # Custom hooks (useSmoothScroll, useGsapContext, etc.)
│   ├── lib/
│   │   ├── animations/      # GSAP ticker synchronization & easings
│   │   └── utils/           # Utility functions (cn class combiner)
│   ├── pages/               # Route views (Home, About, Services, Work, Contact, NotFound)
│   ├── sections/            # Feature-specific page sections & 3D scenes
│   │   ├── about/           # AboutHero3DScene & about sections
│   │   ├── home/            # HeroScene, Showcase, FeaturedWorks, Contact
│   │   └── services/        # ServicesHero3DScene & capability sections
│   ├── styles/              # globals.css & variables.css design system
│   ├── types/               # Strict TypeScript definitions
│   ├── App.tsx              # Application route tree with lazy routes & ErrorBoundary
│   └── main.tsx             # Application entrypoint
├── index.html               # Semantic HTML, font preconnects, Schema.org JSON-LD
├── tailwind.config.js       # Design tokens & fluid typography scale
├── tsconfig.json            # Strict TypeScript configuration
├── vercel.json              # Vercel deployment rewrites & security headers
└── vite.config.ts           # Vite build pipeline & chunking strategy
```

---

## 6. Getting Started

### Prerequisites

- Node.js `>= 18.0.0` (Recommended: Node 20 or 22 LTS)
- npm `>= 9.0.0`

### Installation

```bash
# Clone or navigate to the workspace
cd hashdammi

# Install project dependencies
npm install
```

### Local Development

```bash
# Start local development server with Vite HMR
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Type Checking & Production Build

```bash
# Run strict TypeScript compilation check (0 errors required)
npx tsc --noEmit

# Compile production bundle with Vite
npm run build

# Preview production build locally
npm run preview -- --port 4250
```

---

## 7. Performance & Quality Benchmarks

- **Zero Horizontal Overflow:** Audited and verified `0px` horizontal overflow across 8 responsive viewports (1920×1080 down to 375×812).
- **Clean Browser Console:** 0 warnings, 0 errors. Deprecated `THREE.Clock` warnings completely eliminated.
- **Intelligent 3D Occlusion:** WebGL render loops pause when canvases scroll off-screen (`IntersectionObserver`) or when browser tabs are hidden (`visibilitychange`), preserving client GPU and battery.
- **Route Code Splitting:** Primary bundle entry reduced to ~410 kB via `React.lazy()` route splitting.
- **Accessibility:** WCAG 2.2 AA compliant contrast, accessible `#main-content` skip link, and semantic landmarks.

---

## 8. License & Ownership

Copyright © 2026 HASH.DEVS. All rights reserved. Built for production deployment.
