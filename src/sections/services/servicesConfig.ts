export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  category: string;
  description: string;
  capabilities: string[];
  metrics: { label: string; value: string }[];
  deliverables: string[];
}

export interface MethodologyStage {
  step: string;
  title: string;
  summary: string;
  focus: string;
  deliverables: string[];
}

export interface TechCategory {
  category: string;
  descriptor: string;
  technologies: string[];
}

export const SERVICES_COPY = {
  hero: {
    index: '01',
    eyebrow: '[ 01 ] // SERVICES',
    headline: {
      line1: 'WE ENGINEER',
      line2: 'DIGITAL',
      line3: 'EXPERIENCES.',
    },
    supporting:
      'We combine strategy, design, engineering, and emerging technology to create digital experiences built with purpose.',
    coordinates: 'COORDINATES // 37.7749° N, 122.4194° W',
    status: 'SYSTEM INTEGRITY // OPTIMAL',
  },
  capabilitiesIntro: {
    index: '02',
    eyebrow: '[ 02 ] // CAPABILITIES',
    headline: 'ONE STUDIO. MULTIPLE DISCIPLINES.',
    supporting:
      'From the first strategic question to the final engineered experience, our disciplines work together to turn ambitious ideas into functional digital products.',
    meta: [
      { key: 'ARCHITECTURE', val: '100% BESPOKE ENGINEERING' },
      { key: 'CULTURE', val: 'ZERO TEMPLATE DOGMA' },
      { key: 'CAPACITY', val: 'LIMITED CONCURRENT COMMISSIONS' },
    ],
  },
  servicesMatrix: [
    {
      id: 'digital-product-engineering',
      index: '01',
      title: 'DIGITAL PRODUCT ENGINEERING',
      category: '[ ARCHITECTURE & SYSTEMS ]',
      description:
        'Engineering scalable digital products with thoughtful architecture, reliable infrastructure, and exceptional usability.',
      capabilities: [
        'Product architecture',
        'Frontend and backend engineering',
        'API and database development',
        'SaaS platforms',
        'Performance optimization',
      ],
      metrics: [
        { label: 'RUNTIME LATENCY', value: '< 16MS' },
        { label: 'CODE COVERAGE', value: '> 95%' },
        { label: 'UPTIME SLA', value: '99.99%' },
      ],
      deliverables: [
        'System Topology & DB Schema',
        'Microservices & API Contracts',
        'Production Application Bundle',
        'Automated CI/CD Pipeline',
      ],
    },
    {
      id: 'web-experiences',
      index: '02',
      title: 'WEB EXPERIENCES',
      category: '[ DIGITAL EXPERIENCES ]',
      description:
        'Building distinctive digital experiences that combine expressive design, intelligent interactions, and engineering precision.',
      capabilities: [
        'Premium website development',
        'Interactive experiences',
        'E-commerce platforms',
        'Motion-driven interfaces',
        'Responsive development',
      ],
      metrics: [
        { label: 'FRAME RATE TARGET', value: '60–120 FPS' },
        { label: 'LIGHTHOUSE BENCHMARK', value: '98+' },
        { label: 'ACCESSIBILITY LEVEL', value: 'WCAG AA' },
      ],
      deliverables: [
        'Kinetic Interface Prototypes',
        'Responsive Web Application',
        'Motion & Transition Architecture',
        'Headless CMS Orchestration',
      ],
    },
    {
      id: 'creative-technology',
      index: '03',
      title: 'CREATIVE TECHNOLOGY',
      category: '[ SPATIAL & IMMERSIVE ]',
      description:
        'Exploring the intersection of design and technology through immersive visuals, interactive systems, and experimental interfaces.',
      capabilities: [
        'Three.js and WebGL',
        '3D web experiences',
        'Interactive installations',
        'Real-time visual systems',
        'Creative coding',
      ],
      metrics: [
        { label: 'SHADER PERFORMANCE', value: 'AOT / PBR' },
        { label: 'DRAW CALL CEILING', value: '< 40 CALLS' },
        { label: 'TEXTURE COMPRESSION', value: 'KTX2 / BASIS' },
      ],
      deliverables: [
        'Real-Time 3D WebGL Scenes',
        'Custom GLSL Fragment Shaders',
        'Interactive Audio-Visual Systems',
        'Spatial Hardware Controls',
      ],
    },
    {
      id: 'ai-intelligent-systems',
      index: '04',
      title: 'AI & INTELLIGENT SYSTEMS',
      category: '[ COMPUTATIONAL COGNITION ]',
      description:
        'Developing intelligent digital systems that connect AI capabilities with practical workflows and useful experiences.',
      capabilities: [
        'AI-powered applications',
        'Intelligent automation',
        'AI integrations',
        'Conversational interfaces',
        'Workflow systems',
      ],
      metrics: [
        { label: 'TOKEN STREAMING', value: 'ZERO-JANK TTFT' },
        { label: 'GUARDRAIL INTEGRITY', value: 'VERIFIED' },
        { label: 'ORCHESTRATION', value: 'AGENTIC DAG' },
      ],
      deliverables: [
        'Multi-Agent System Topologies',
        'Vector Embeddings Pipeline',
        'Streaming Conversational UX',
        'Automated Workflow Telemetry',
      ],
    },
    {
      id: 'brand-identity',
      index: '05',
      title: 'BRAND IDENTITY',
      category: '[ VISUAL SYSTEMS ]',
      description:
        'Creating distinctive brand systems that translate a company\'s vision into a coherent visual and digital identity.',
      capabilities: [
        'Brand strategy',
        'Visual identity systems',
        'Typography and art direction',
        'Digital brand applications',
        'Design systems',
      ],
      metrics: [
        { label: 'DESIGN SYSTEM SCALE', value: 'TOKENS & KITS' },
        { label: 'TYPOGRAPHIC COHERENCE', value: 'MONUMENTAL' },
        { label: 'SURFACE CONTRAST', value: '7:1 AAA' },
      ],
      deliverables: [
        'Complete Visual Design System',
        'Custom Typography Guidelines',
        'Interactive Figma Token Kit',
        'Digital Motion Manifesto',
      ],
    },
  ],
  methodology: {
    index: '04',
    eyebrow: '[ 04 ] // ENGINEERING METHODOLOGY',
    headline: 'THOUGHTFUL BY DESIGN. PRECISE BY ENGINEERING.',
    stages: [
      {
        step: '01',
        title: 'UNDERSTAND',
        summary: 'Research the problem, audience, objectives, and constraints.',
        focus: 'DISCOVERY // ROOT CAUSE ANALYSIS',
        deliverables: [
          'Stakeholder & Technical Inquiries',
          'Competitive Landscape Mapping',
          'Architecture Feasibility Assessment',
          'User Journey & KPI Definitions',
        ],
      },
      {
        step: '02',
        title: 'ARCHITECT',
        summary: 'Define the system structure, experience direction, and technical foundations.',
        focus: 'TOPOLOGY // CREATIVE WIREFRAMING',
        deliverables: [
          'System Blueprint & Data Flow Modeling',
          'Art Direction & Motion Studies',
          'Core Technology Stack Validation',
          'Prototype Proof-of-Concept',
        ],
      },
      {
        step: '03',
        title: 'BUILD',
        summary: 'Design, engineer, integrate, and refine the product.',
        focus: 'SYNTHESIS // RIGOROUS IMPLEMENTATION',
        deliverables: [
          'Component Architecture & State Engine',
          'PBR 3D Modeling & Shaders',
          'API Integration & Edge Functions',
          'Pixel-Level Editorial Craft',
        ],
      },
      {
        step: '04',
        title: 'EVOLVE',
        summary: 'Test, optimize, deploy, and continuously improve.',
        focus: 'VERIFICATION // CONTINUOUS OPTIMIZATION',
        deliverables: [
          'Multi-Device & Cross-Browser Audit',
          'Frame Rate & Runtime Latency Profiling',
          'Automated CI/CD Deployment',
          'Telemetry Monitoring & Iteration',
        ],
      },
    ],
  },
  technology: {
    index: '05',
    eyebrow: '[ 05 ] // STACK & CRAFT',
    headline: 'TECHNOLOGY & CRAFT',
    supporting:
      'We work with an uncompromising toolset curated for stability, performance, and boundary-pushing creative fidelity.',
    categories: [
      {
        category: 'FRONTEND',
        descriptor: 'MODERN CLIENT-SIDE RUNTIME',
        technologies: ['React 18', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite', 'HTML5 / Web APIs'],
      },
      {
        category: 'BACKEND',
        descriptor: 'SCALABLE DISTRIBUTED SERVICES',
        technologies: ['Node.js', 'Python', 'FastAPI', 'REST APIs', 'GraphQL', 'WebSockets'],
      },
      {
        category: 'INFRASTRUCTURE',
        descriptor: 'RESILIENT PERSISTENCE & CLOUD',
        technologies: ['PostgreSQL', 'Redis', 'Docker', 'Edge Compute', 'CI/CD Pipelines', 'Vercel / AWS'],
      },
      {
        category: 'CREATIVE TECHNOLOGY',
        descriptor: 'SPATIAL VISUAL COMPUTING',
        technologies: ['Three.js', 'WebGL 2.0', 'GLSL Shaders', 'GSAP', 'ScrollTrigger', 'Lenis Smooth Scroll'],
      },
      {
        category: 'INTELLIGENT SYSTEMS',
        descriptor: 'AGENTIC PIPELINES & MODELS',
        technologies: ['LLM Orchestration', 'Vector Embeddings', 'Intelligent Automation', 'Agent DAGs', 'Streaming UX'],
      },
    ],
  },
  cta: {
    index: '06',
    eyebrow: '[ 06 ] // START SOMETHING',
    headline: {
      line1: 'HAVE AN AMBITIOUS',
      line2: 'IDEA? LET\'S',
      line3: 'ENGINEER IT.',
    },
    supporting:
      'Tell us what you\'re imagining. Let\'s explore what we can build together.',
    primaryBtn: "START A PROJECT ↗",
    primaryLink: '/contact',
    secondaryBtn: 'EXPLORE OUR WORK ↗',
    secondaryLink: '/work',
  },
};

