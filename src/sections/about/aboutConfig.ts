export interface ApproachPrinciple {
  index: string;
  title: string;
  tagline: string;
  description: string;
  disciplines: string[];
}

export interface CreativeCapability {
  index: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

export interface StudioMetric {
  value: string;
  label: string;
  subtext: string;
}

export const ABOUT_COPY = {
  hero: {
    eyebrow: '01 // STUDIO IDENTITY & ETHOS',
    index: '01',
    headline: {
      line1: 'WE ARE',
      line2: 'NOT HERE',
      line3: 'TO FOLLOW',
      line4: 'DIGITAL',
      line5: 'CONVENTIONS.',
    },
    statement:
      'HASH.DEVS is an independent creative engineering atelier. We operate at the exact convergence of mathematical rigor, architectural software engineering, and uncompromising visual aesthetics.',
    coordinates: 'COORDINATES // 37.7749° N, 122.4194° W',
    status: 'SYSTEM INTEGRITY // OPTIMAL',
  },
  philosophy: {
    eyebrow: '02 // STUDIO PHILOSOPHY',
    index: '02',
    statement:
      'We build digital experiences where engineering precision meets creative ambition.',
    body:
      'Most software prioritizes utility while abandoning aesthetic restraint. Most design portfolios champion styling while neglecting architectural performance. We reject this dichotomy. In every system we architect, visual elegance and runtime speed are treated as unified disciplines.',
    meta: [
      { key: 'PARADIGM', val: 'ENGINEERING ATELIER' },
      { key: 'PRINCIPLE', val: 'ZERO TEMPLATE CULTURE' },
      { key: 'LATENCY SLA', val: '< 16.67MS (60-120 FPS)' },
    ],
  },
  whoWeAre: {
    eyebrow: '03 // WHO WE ARE',
    index: '03',
    heading: 'CREATIVE TECHNOLOGY // RIGOROUS ARCHITECTURE',
    body1:
      'HASH.DEVS was established to construct software that commands attention through quiet confidence and structural mastery. We collaborate with venture-backed innovators, progressive global brands, and enterprise engineering teams who understand that digital presence is the ultimate expression of craft.',
    body2:
      'Our team is a compact, multidisciplinary collective of systems architects, creative technologists, 3D artists, and interface designers. We deliberately maintain a low-volume, high-conviction client roster to ensure direct partner involvement on every commission.',
    metrics: [
      {
        value: '100%',
        label: 'BESPOKE CODEBASE',
        subtext: 'Zero boilerplate templates or off-the-shelf themes.',
      },
      {
        value: '< 50MS',
        label: 'INTERACTION LATENCY',
        subtext: 'GPU-accelerated rendering and optimized memory trees.',
      },
      {
        value: '3 HUBS',
        label: 'GLOBAL REACH',
        subtext: 'Operating from San Francisco, London, and Tokyo.',
      },
      {
        value: 'AOT / PBR',
        label: 'CGI PIPELINE',
        subtext: 'Real-time WebGL & Three.js shaders engineered in-house.',
      },
    ] as StudioMetric[],
  },
  approach: {
    eyebrow: '04 // OUR APPROACH',
    index: '04',
    title: 'THE FOUR ARCHITECTURAL PILLARS',
    principles: [
      {
        index: '01',
        title: 'THINK DEEPLY',
        tagline: 'Understand the problem before building the solution.',
        description:
          'We deconstruct complex business and technical challenges into foundational first principles. We do not jump into Figma or open a code editor until the strategic problem space, taxonomy, and system architecture are verified.',
        disciplines: ['Problem Space Mapping', 'System Taxonomy', 'Performance Budgeting', 'Technical Feasibility'],
      },
      {
        index: '02',
        title: 'DESIGN INTENTIONALLY',
        tagline: 'Every visual and interaction has a purpose.',
        description:
          'We treat aesthetics as an engineering constraint, not superficial decoration. Every typographic scale, graphite surface, and neon focal point is mathematically calibrated to guide cognition and communicate brand authority.',
        disciplines: ['Spatial Design Systems', 'Typographic Hierarchy', 'Kinetic Art Direction', 'High-Contrast Editorial UI'],
      },
      {
        index: '03',
        title: 'ENGINEER PRECISELY',
        tagline: 'Build reliable, scalable and performant systems.',
        description:
          'We architect resilient modern applications with uncompromising engineering standards. From thread-safe state management to custom WebGL shaders, our code is built to run flawlessly across every device and browser.',
        disciplines: ['Three.js & GLSL Shaders', 'Full-Stack TypeScript', 'Zero-Jank 120 FPS Motion', 'Automated Multi-Viewport CI'],
      },
      {
        index: '04',
        title: 'EVOLVE CONTINUOUSLY',
        tagline: 'Refine, improve and push beyond conventions.',
        description:
          'Great digital products are living, evolving entities. We instrument telemetry, optimize real-world performance budgets, and partner for the long term to compound value and maintain market differentiation.',
        disciplines: ['Runtime Performance Telemetry', 'Progressive Enhancement', 'Continuous Refinement', 'Architectural Scaling'],
      },
    ] as ApproachPrinciple[],
  },
  capabilities: {
    eyebrow: '05 // CREATIVE CAPABILITIES',
    index: '05',
    headline: 'DISCIPLINES IN PRACTICE',
    statement:
      'We combine software engineering and creative art direction across five specialized domains.',
    items: [
      {
        index: '01',
        title: 'Digital Product Engineering',
        description:
          'Architecting mission-critical SaaS platforms, custom enterprise interfaces, and high-performance frontend systems built for scale and sub-second reactivity.',
        tags: ['React 18 / Next.js', 'TypeScript', 'Scalable Architecture', 'State Engines'],
        link: '/services#product-engineering',
      },
      {
        index: '02',
        title: 'Web Experiences',
        description:
          'Designing and engineering award-caliber editorial platforms and studio websites that merge monumental typography with cinematic scroll-driven narratives.',
        tags: ['GSAP & ScrollTrigger', 'Smooth Inertia Scroll', 'Fluid Typography', 'Editorial Layouts'],
        link: '/services#web-experiences',
      },
      {
        index: '03',
        title: 'Creative Technology',
        description:
          'Pushing the boundary of the web browser with custom real-time 3D WebGL scenes, procedural shader mechanics, interactive particle fields, and spatial compute.',
        tags: ['Three.js & WebGL', 'GLSL Custom Shaders', 'Particle Systems', 'PBR Metal Workflows'],
        link: '/services#creative-technology',
      },
      {
        index: '04',
        title: 'AI & Intelligent Systems',
        description:
          'Engineering intelligent agentic interfaces, context-aware generative UI systems, and autonomous workflows that feel native, intuitive, and blisteringly fast.',
        tags: ['Generative UI', 'Agent Workflows', 'LLM Integration', 'Streaming Interfaces'],
        link: '/services#intelligent-systems',
      },
      {
        index: '05',
        title: 'Brand Identity',
        description:
          'Developing comprehensive digital-first brand design systems: bespoke typography pairings, motion identities, color palettes, and technical design tokens.',
        tags: ['Design Systems', 'Motion Principles', 'Typographic Systems', 'Brand Guidelines'],
        link: '/services#brand-identity',
      },
    ] as CreativeCapability[],
  },
  cta: {
    eyebrow: '06 // INITIATE COLLABORATION',
    index: '06',
    headline: {
      line1: 'HAVE SOMETHING',
      line2: 'WORTH BUILDING?',
    },
    statement:
      'We partner with ambitious founders, pioneering technology brands, and forward-thinking enterprises. Tell us what you are imagining.',
    buttonText: "LET'S TALK ↗",
    buttonLink: '/contact',
    secondaryText: 'EXPLORE OUR FEATURED WORKS ⟶',
    secondaryLink: '/#works',
  },
};

