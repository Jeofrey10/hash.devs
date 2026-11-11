import { FEATURED_PROJECTS, ProjectItem } from '../home/FeaturedWorks/projects';

export interface WorkDiscipline {
  index: string;
  title: string;
  tagline: string;
  description: string;
  projectCount: string;
}

export const WORK_COPY = {
  hero: {
    index: '01',
    eyebrow: '[ 01 ] // SELECTED WORKS',
    headline: {
      line1: 'WE MAKE',
      line2: 'DIGITAL',
      line3: 'MATTER.',
    },
    supporting:
      'A selection of digital products, immersive experiences, intelligent systems, and experimental work engineered with intention.',
    metrics: [
      { label: 'SELECTED PROJECTS', value: '04' },
      { label: 'STUDIO ARCHIVE', value: '2024–2026' },
      { label: 'ENGINEERING PARADIGM', value: '100% BESPOKE' },
    ],
    status: 'SYSTEM ARCHIVE // ACTIVE',
    coordinates: 'COORDINATES // 37.7749° N, 122.4194° W',
  },
  archiveIntro: {
    index: '02',
    eyebrow: '[ 02 ] // THE ARCHIVE',
    headline: 'SELECTED WORK. ENGINEERED WITH INTENT.',
    supporting:
      'Every project begins with a problem worth solving and becomes an opportunity to explore the intersection of design, technology, and engineering.',
    metadata: [
      { key: 'PROJECTS', val: '04' },
      { key: 'DISCIPLINES', val: '04' },
      { key: 'ARCHIVE', val: '2026' },
    ],
  },
  projects: FEATURED_PROJECTS,
  disciplines: [
    {
      index: '01',
      title: 'DIGITAL PRODUCT ENGINEERING',
      tagline: 'SCALABLE SYSTEMS & APPLICATION ARCHITECTURE',
      description:
        'End-to-end full-stack software development, distributed architectures, microservices, and high-load web systems designed for rigorous uptime and minimal latency.',
      projectCount: '02 ARCHIVES',
    },
    {
      index: '02',
      title: 'CREATIVE TECHNOLOGY',
      tagline: 'SPATIAL 3D & SHADER RESEARCH',
      description:
        'Bespoke WebGL, Three.js shaders, interactive canvas environments, and computational visual experiences that push browser graphics past conventional limitations.',
      projectCount: '04 ARCHIVES',
    },
    {
      index: '03',
      title: 'AI & INTELLIGENT SYSTEMS',
      tagline: 'AUTONOMOUS WORKFLOWS & COGNITIVE INTERFACES',
      description:
        'Architecting production multi-agent DAGs, vector embedding telemetry, streaming token UX, and ambient intelligence hardware prototypes.',
      projectCount: '02 ARCHIVES',
    },
    {
      index: '04',
      title: 'WEB EXPERIENCES',
      tagline: 'KINETIC EDITORIAL INTERFACES',
      description:
        'High-polish editorial websites, bespoke e-commerce flagship storefronts, and expressive design systems built with physics-calibrated interactions.',
      projectCount: '03 ARCHIVES',
    },
    {
      index: '05',
      title: 'BRAND & VISUAL SYSTEMS',
      tagline: 'ARCHITECTURAL IDENTITY & DESIGN SYSTEMS',
      description:
        'Monumental display typography, coherent visual design tokens, interactive component kits, and digital art direction communicating brand authority.',
      projectCount: '04 ARCHIVES',
    },
  ] as WorkDiscipline[],
  experimentation: {
    index: '05',
    eyebrow: '[ 05 ] // RESEARCH & EXPERIMENTATION',
    headline: {
      line1: 'NOT EVERYTHING',
      line2: 'STARTS WITH',
      line3: 'A BRIEF.',
    },
    supporting:
      'Some of our strongest ideas emerge from experimentation. We explore materials, motion, interfaces, and emerging technologies to discover what digital experiences can become.',
    principles: [
      {
        tag: 'EXPLORATION',
        text: 'Unconstrained creative coding unlocks architectural patterns that commercial briefs rarely permit.',
      },
      {
        tag: 'MATERIALITY',
        text: 'Simulating physical optics, paper grain, and metallic refraction brings visceral weight to pixels.',
      },
      {
        tag: 'PERFORMANCE',
        text: 'Every experimental shader is benchmarked to sustain 60–120 FPS on consumer hardware.',
      },
    ],
  },
  cta: {
    index: '06',
    eyebrow: '[ 06 ] // START SOMETHING',
    headline: {
      line1: 'HAVE SOMETHING',
      line2: 'WORTH BUILDING?',
    },
    supporting:
      'Have an ambitious idea, a difficult problem, or a product waiting to exist? Let\'s build it together.',
    primaryBtn: 'START A PROJECT ↗',
    primaryLink: '/contact',
    secondaryBtn: 'EXPLORE OUR SERVICES ↗',
    secondaryLink: '/services',
  },
};
export type { ProjectItem };

