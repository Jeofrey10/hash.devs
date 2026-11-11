export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  category: string;
  headline: string;
  description: string;
  clientOrigin: string;
  year: string;
  deliverables: string[];
  tags: string[];
  accentHue: string;
  metrics: ProjectMetric[];
  visualType: 'pixwall' | 'vox-ai' | 'illora-ai' | 'experimental';
}

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: 'pixwall',
    index: '01',
    title: 'PIXWALL',
    category: 'DIGITAL COMMERCE',
    headline: 'EDITORIAL COMMERCE PLATFORM & BESPOKE PRINT GALLERY',
    description:
      'A digital commerce platform engineered for limited-edition architectural artwork, large-format framed poster prints, and high-craft studio editions. Combines realistic paper texture rendering, museum framing configurators, and an editorial storefront interface.',
    clientOrigin: 'COMMERCIAL ARCHIVE // NEW YORK',
    year: '2025',
    deliverables: ['E-Commerce Architecture', 'Bespoke Framing Tool', 'Editorial Design System', 'Headless Storefront'],
    tags: ['DIGITAL COMMERCE', 'EDITORIAL PRINT', 'NEXT.JS', 'TAILWIND'],
    accentHue: '#FFFFFF',
    metrics: [
      { label: 'Print Medium', value: '310gsm Cotton' },
      { label: 'Frame Standard', value: 'Anodized 18mm' },
      { label: 'Grid Architecture', value: '12-Col Modular' },
    ],
    visualType: 'pixwall',
  },
  {
    id: 'vox-ai',
    index: '02',
    title: 'VOX AI',
    category: 'INTELLIGENT SYSTEMS',
    headline: 'INDUSTRIAL VOICE-DRIVEN SENSORY HARDWARE & OS',
    description:
      'An industrial ambient voice intelligence device and operating interface designed for retail and architectural environments. Features a precision-machined aluminum chassis, micro-perforated acoustic grille, and real-time beamforming frequency monitoring.',
    clientOrigin: 'INTELLIGENT HARDWARE LAB // TOKYO',
    year: '2025',
    deliverables: ['Industrial Hardware UI', 'Acoustic Signal Monitor', 'On-Device OS Concept', 'Retail Prototype'],
    tags: ['INTELLIGENT SYSTEMS', 'HARDWARE DESIGN', 'ACOUSTIC UI', 'EDGE COMPUTE'],
    accentHue: '#35E85B',
    metrics: [
      { label: 'Chassis Material', value: 'Anodized 6061' },
      { label: 'Acoustic Array', value: '6-Ch MEMS Array' },
      { label: 'Prototype Latency', value: '<5ms (Edge Test)' },
    ],
    visualType: 'vox-ai',
  },
  {
    id: 'illora-ai',
    index: '03',
    title: 'ILLORA AI',
    category: 'ENTERPRISE INTELLIGENCE',
    headline: 'AUTONOMOUS MULTI-AGENT ORCHESTRATION CONSOLE',
    description:
      'An enterprise cognitive orchestration console modeling multi-agent decision pipelines. Features structured directed graph topology, animated token transmission channels, worker health diagnostics, and zero-trust verification telemetry.',
    clientOrigin: 'ENTERPRISE SYSTEMS // LONDON',
    year: '2024',
    deliverables: ['Agent Mesh Interface', 'Node Graph Visualizer', 'Diagnostic Telemetry', 'Enterprise Systems'],
    tags: ['AGENT ORCHESTRATION', 'DATA VISUALIZATION', 'CYBERNETIC UI', 'REACT'],
    accentHue: '#4DA6FF',
    metrics: [
      { label: 'Agent Topology', value: 'Directed Graph' },
      { label: 'Verification Model', value: 'Zero-Trust Node' },
      { label: 'Telemetry Benchmark', value: 'Real-Time Sync' },
    ],
    visualType: 'illora-ai',
  },
  {
    id: 'experimental',
    index: '04',
    title: 'EXPERIMENTAL WORKS',
    category: 'CREATIVE ENGINEERING',
    headline: 'REAL-TIME LIQUID CHROME CGI & SHADER LABORATORY',
    description:
      'Studio research laboratory developing real-time sculptural liquid chrome geometries, procedural raymarched signed distance fields, and non-Euclidean optical reflections within high-performance GPU canvas environments.',
    clientOrigin: 'STUDIO RESEARCH LAB // GLOBAL',
    year: '2026',
    deliverables: ['Shader Experiments', 'Liquid Chrome CGI', 'Mathematical Manifolds', 'Three.js / WebGL'],
    tags: ['CREATIVE ENGINEERING', 'GPU SHADERS', 'METALLIC CGI', 'CREATIVE CODE'],
    accentHue: '#C084FC',
    metrics: [
      { label: 'Shading Pipeline', value: 'GLSL Raymarching' },
      { label: 'Floating Buffer', value: 'FP32 Precision' },
      { label: 'Interactive Target', value: '60 FPS Target' },
    ],
    visualType: 'experimental',
  },
];
