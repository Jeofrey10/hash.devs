export interface ProcessStage {
  id: string;
  index: string;
  title: string;
  phaseCode: string;
  kicker: string;
  description: string;
  details: string[];
  deliverables: string[];
  focusPill: string;
  blueprintType: 'discover' | 'strategy' | 'engineer' | 'evolve';
}

export const PROCESS_STAGES: ProcessStage[] = [
  {
    id: 'discover',
    index: '01',
    title: 'DISCOVER & DEFINE',
    phaseCode: 'PHASE // 01.0',
    kicker: 'PROBLEM SPACE & TAXONOMY',
    description:
      'We begin by understanding the problem, the audience, and the opportunity. Every strong digital experience starts with clarity.',
    details: [
      'Discovery and research',
      'Problem definition',
      'Audience understanding',
      'Goals and requirements',
    ],
    deliverables: [
      'Problem Space Mapping',
      'Audience Behavioral Taxonomy',
      'Technical Constraints Matrix',
      'Clear Requirements Blueprint',
    ],
    focusPill: 'CLARITY FIRST // ROOT CAUSE',
    blueprintType: 'discover',
  },
  {
    id: 'strategy',
    index: '02',
    title: 'STRATEGY & DIRECTION',
    phaseCode: 'PHASE // 02.0',
    kicker: 'SYSTEM DESIGN & ARCHITECTURE',
    description:
      'We turn insights into a clear product direction, defining the architecture, experience, and creative language.',
    details: [
      'Product strategy',
      'Information architecture',
      'Creative direction',
      'Technical planning',
    ],
    deliverables: [
      'Modular System Architecture',
      'Creative Visual Language',
      'Component Token Hierarchy',
      'Engineering Execution Roadmap',
    ],
    focusPill: 'STRUCTURAL DISCIPLINE // DIRECTION',
    blueprintType: 'strategy',
  },
  {
    id: 'engineer',
    index: '03',
    title: 'DESIGN & ENGINEER',
    phaseCode: 'PHASE // 03.0',
    kicker: 'CREATIVE TECHNOLOGY & EXECUTION',
    description:
      'We bring ideas to life through thoughtful design, precise engineering, and carefully crafted interactions.',
    details: [
      'UI/UX design',
      'Frontend engineering',
      'Backend development',
      'Interactive experiences',
      'Quality assurance',
    ],
    deliverables: [
      'High-Fidelity Interface Systems',
      'Hardware-Accelerated Interaction',
      'Zero-Jank Motion Physics',
      'Strict Type & Bundle Verification',
    ],
    focusPill: 'PRECISION CRAFT // 60 FPS',
    blueprintType: 'engineer',
  },
  {
    id: 'evolve',
    index: '04',
    title: 'LAUNCH & EVOLVE',
    phaseCode: 'PHASE // 04.0',
    kicker: 'PRODUCTION & CONTINUOUS TUNING',
    description:
      'We deliver, measure, refine, and continuously improve the experience beyond its initial launch.',
    details: [
      'Production deployment',
      'Performance optimization',
      'Testing and validation',
      'Continuous improvement',
    ],
    deliverables: [
      'Global Edge CDN Orchestration',
      'Sub-Second FCP Telemetry',
      'Multi-Viewport Precision QA',
      'Iterative Post-Launch Optimization',
    ],
    focusPill: 'MEASURED IMPACT // ZERO DOWNTIME',
    blueprintType: 'evolve',
  },
];

export const PROCESS_SECTION_HEADER = {
  eyebrow: 'STUDIO PROCESS / CREATIVE ENGINEERING',
  index: '05',
  headline: {
    line1: 'FROM IDEA',
    line2: 'TO IMPACT.',
  },
  statement:
    'We bring strategy, design and engineering together to transform ambitious ideas into meaningful digital experiences.',
  closingStatement:
    'GREAT PRODUCTS ARE NOT ACCIDENTAL. THEY ARE THE RESULT OF RIGOROUS ARCHITECTURE, RESTRAINED AESTHETICS, AND UNCOMPROMISING ENGINEERING.',
};

