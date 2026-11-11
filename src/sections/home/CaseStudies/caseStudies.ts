export interface CaseStudyStorySection {
  title: string;
  subtitle: string;
  paragraphs: string[];
  keyTakeaway?: string;
}

export interface CaseStudyOverview {
  creativeDirection: string;
  coreChallenge: string;
  ourApproach: string;
  technologies: string[];
  specifications: { label: string; value: string }[];
}

export interface CaseStudyData {
  id: string;
  index: string;
  title: string;
  category: string;
  clientOrigin: string;
  year: string;
  heroHeadline: string;
  heroSummary: string;
  closingStatement: string;
  accentHue: string;
  overview: CaseStudyOverview;
  story: {
    challenge: CaseStudyStorySection;
    approach: CaseStudyStorySection;
    engineering: CaseStudyStorySection;
    experience: CaseStudyStorySection;
  };
  technicalArchitecture: {
    title: string;
    description: string;
    layers: { name: string; tech: string; description: string }[];
    metrics: { label: string; value: string; detail: string }[];
  };
  visualType: 'pixwall' | 'vox-ai' | 'illora-ai' | 'experimental';
  prevProjectId: string;
  nextProjectId: string;
}

export const CASE_STUDIES: Record<string, CaseStudyData> = {
  pixwall: {
    id: 'pixwall',
    index: '01',
    title: 'PIXWALL',
    category: 'DIGITAL COMMERCE',
    clientOrigin: 'COMMERCIAL ARCHIVE // NEW YORK',
    year: '2025',
    heroHeadline: 'EDITORIAL COMMERCE FOR LIMITED ARCHITECTURAL ART',
    heroSummary:
      'A bespoke digital commerce platform engineered for limited-edition architectural artwork, large-format framed poster prints, and high-craft studio editions. Combines realistic paper texture rendering, museum framing configurators, and an editorial storefront interface.',
    closingStatement: 'PIXWALL — DIGITAL COMMERCE, REIMAGINED.',
    accentHue: '#FFFFFF',
    overview: {
      creativeDirection:
        'Minimalist Swiss editorial typography paired with physical material fidelity. Every poster is treated with the reverence of a fine-art gallery exhibit.',
      coreChallenge:
        'Standard e-commerce templates treat printed art as flat digital thumbnails, divorcing the buyer from paper grain, tactile depth, mat board bevels, and physical scale.',
      ourApproach:
        'We engineered a multi-layered framing engine with realistic paper texture shaders, architectural mat borders, and an asynchronous headless checkout pipeline.',
      technologies: ['Next.js 14', 'Tailwind CSS', 'Shopify Storefront API', 'WebGL Paper Shaders', 'GSAP'],
      specifications: [
        { label: 'Paper Stock', value: '310gsm 100% Cotton Rag' },
        { label: 'Frame Profile', value: '18mm Anodized Aluminum' },
        { label: 'Glass Standard', value: 'Anti-Reflective Museum Grade' },
        { label: 'Grid Standard', value: '12-Column Asymmetric Swiss' },
      ],
    },
    story: {
      challenge: {
        title: 'THE CHALLENGE',
        subtitle: 'TRANSCENDING FLAT DIGITAL STOREFRONTS',
        paragraphs: [
          'High-craft architectural artwork and limited edition printmaking exist at the intersection of paper chemistry, ink density, and precise framing. When displayed on typical commercial platforms, prints are flattened into low-resolution product cards that fail to convey physical craftsmanship.',
          'The challenge was to engineer a digital storefront that captures the atmosphere of an exclusive design atelier—where the weight of 310gsm paper, the bevel of museum mat boards, and the tactile finish of anodized metal frames are experienced directly through the screen.',
        ],
        keyTakeaway: 'The medium is as important as the message; digital commerce must respect physical materials.',
      },
      approach: {
        title: 'THE APPROACH',
        subtitle: 'EDITORIAL PACING & ARCHITECTURAL FRAMING',
        paragraphs: [
          'We approached PIXWALL with an editorial curatorial mindset. Instead of endless scroll grids and aggressive conversion popups, we introduced structured typographic hierarchies, generous negative space, and bespoke poster framing previews.',
          'Each artwork in the collection is presented as a singular study. Collectors can inspect print dimensions, select between raw oak and anodized black metal frames, and view realistic lighting reflections across the simulated protective glass.',
        ],
        keyTakeaway: 'Editorial restraint and intentional spacing elevate perceived value and emotional engagement.',
      },
      engineering: {
        title: 'THE ENGINEERING',
        subtitle: 'HEADLESS ARCHITECTURE & SHADER DEPTH',
        paragraphs: [
          'The platform was constructed using a headless commerce architecture. The frontend connects to headless checkout services via GraphQL, enabling sub-second page transitions, instant cart mutability, and zero layout shift.',
          'For the framing configurator, we authored lightweight SVG filter pipelines with turbulence and diffuse lighting maps to reproduce natural cotton paper grain without impacting 60 FPS performance.',
        ],
        keyTakeaway: 'Performance and tactile aesthetics can coexist through disciplined shader engineering.',
      },
      experience: {
        title: 'THE EXPERIENCE',
        subtitle: 'AN ATELIER IN THE BROWSER',
        paragraphs: [
          'The final platform provides collectors with an immersive acquisition experience. Monospace curatorial metadata, verified edition counts (e.g. 18 of 50 copies remaining), and quiet micro-interactions make acquiring a print feel deliberate and rewarding.',
          'By stripping away commercial clutter, PIXWALL establishes a new benchmark for luxury print and architectural object commerce.',
        ],
        keyTakeaway: 'When every element has intention, the shopping experience transforms into an art discovery.',
      },
    },
    technicalArchitecture: {
      title: 'COMMERCE INFRASTRUCTURE & RENDERING PIPELINE',
      description: 'Headless storefront decoupled from legacy backend systems, built for instantaneous response.',
      layers: [
        { name: 'Storefront Core', tech: 'Next.js & React Server Components', description: 'Server-rendered initial HTML with zero hydration jank' },
        { name: 'Material Shader', tech: 'SVG feTurbulence & Diffuse Lighting', description: 'Simulates micro-grain of 310gsm cotton paper without heavy 3D assets' },
        { name: 'Framing Engine', tech: 'Dynamic CSS Canvas Matrix', description: 'Real-time dimensional scaling for 50x70cm, 70x100cm, and custom editions' },
        { name: 'Checkout Bridge', tech: 'Shopify Storefront GraphQL', description: 'Direct edge-cached cart mutations with sub-500ms API latency' },
      ],
      metrics: [
        { label: 'DOM Hydration', value: '<80ms', detail: 'Zero layout shift during state reconciliation' },
        { label: 'Paper Shader Overhead', value: '0.2ms', detail: 'Native browser filter pipeline without WebGL overhead' },
        { label: 'Asset Payload', value: '42KB Gzip', detail: 'Pristine SVG vector geometry and fluid typography' },
      ],
    },
    visualType: 'pixwall',
    prevProjectId: 'experimental',
    nextProjectId: 'vox-ai',
  },

  'vox-ai': {
    id: 'vox-ai',
    index: '02',
    title: 'VOX AI',
    category: 'INTELLIGENT SYSTEMS',
    clientOrigin: 'INTELLIGENT HARDWARE LAB // TOKYO',
    year: '2025',
    heroHeadline: 'INDUSTRIAL VOICE-DRIVEN SENSORY HARDWARE & OS',
    heroSummary:
      'An industrial ambient voice intelligence device and operating interface designed for retail and architectural environments. Features a precision-machined aluminum chassis, micro-perforated acoustic grille, and real-time beamforming frequency monitoring.',
    closingStatement: 'VOX AI — INTELLIGENCE, MADE TANGIBLE.',
    accentHue: '#35E85B',
    overview: {
      creativeDirection:
        'Industrial precision meets ambient intelligence. Cold anodized aluminum paired with restrained phosphor-green feedback signals.',
      coreChallenge:
        'Smart speakers and voice interfaces are overwhelmingly plastic, consumerist, or visually sterile. Industrial and retail spaces require rugged physical presence and immediate acoustic transparency.',
      ourApproach:
        'We designed a monolithic cylindrical hardware form in CNC-milled 6061 aluminum, combined with an ambient voice operating system that visualizes acoustic spatial arrays without sensory overload.',
      technologies: ['C++ Audio DSP', 'TensorFlow Lite for Micro', 'React Web Interface', 'Web Audio API', 'GSAP'],
      specifications: [
        { label: 'Enclosure Material', value: 'Anodized 6061-T6 Aluminum' },
        { label: 'Acoustic Array', value: '6-Microphone Polar Beamformer' },
        { label: 'Audio Frequency Response', value: '20 Hz — 48 kHz' },
        { label: 'Inference Target', value: '<5ms Edge Keyword Spotting' },
      ],
    },
    story: {
      challenge: {
        title: 'THE CHALLENGE',
        subtitle: 'MATERIALIZING AMBIENT INTELLIGENCE',
        paragraphs: [
          'Voice interfaces are inherently invisible. However, in luxury retail and high-noise architectural environments, users demand physical confidence that a device is active, secure, and listening with pinpoint acoustic focus.',
          'The challenge was to conceive both the industrial hardware form and the digital operating console—creating a tangible technological artifact that looks precision-manufactured rather than like disposable consumer electronics.',
        ],
        keyTakeaway: 'Ambient software requires physical credibility; form factors must signal sensory reliability.',
      },
      approach: {
        title: 'THE APPROACH',
        subtitle: 'MONOLITHIC CHASSIS & ACOUSTIC POLARITY',
        paragraphs: [
          'We designed the VOX hardware as a solid graphite cylinder with a diamond-cut chamfered crest. The lower body incorporates micro-perforations machined to optimize polar microphone pickup while creating an understated textural surface.',
          'Instead of aggressive multi-color LED rings, we integrated a hairline 1.5px phosphor green annular beacon at the crown that pulses gently only when speech beamforming is actively engaged.',
        ],
        keyTakeaway: 'Restraint in lighting communicates sophistication; a single indicator is more powerful than a spectacle.',
      },
      engineering: {
        title: 'THE ENGINEERING',
        subtitle: 'EDGE DSP & HARMONIC SPECTROGRAMS',
        paragraphs: [
          'On the software interface side, we built a real-time acoustic frequency spectrogram. Using the Web Audio API and hardware DSP pipelines, acoustic inputs are analyzed into 16 discrete harmonic frequency bands with sub-millisecond precision.',
          'The accompanying browser operating interface gives store operators and spatial architects telemetry on acoustic decibels, ambient noise cancellation thresholds, and neural model latency.',
        ],
        keyTakeaway: 'Real-time telemetry provides transparency and operational trust in mission-critical environments.',
      },
      experience: {
        title: 'THE EXPERIENCE',
        subtitle: 'SEAMLESS AUDITORY ARCHITECTURE',
        paragraphs: [
          'The VOX system bridges physical hardware and digital telemetry. The physical device commands presence on a marble retail counter or aluminum studio pedestal, while the OS interface provides immediate system insight.',
          'It proves that voice intelligence does not have to be an anonymous plastic puck—it can be an exquisite piece of contemporary industrial design.',
        ],
        keyTakeaway: 'When hardware and software share a single design voice, technology becomes timeless.',
      },
    },
    technicalArchitecture: {
      title: 'ACOUSTIC PROCESSING & ON-DEVICE TELEMETRY',
      description: 'Dual-path architecture separating privacy-critical edge DSP from cloud analytics.',
      layers: [
        { name: 'Hardware Enclosure', tech: 'CNC 6061-T6 Aluminum Monolith', description: 'Shielded chassis with laser-drilled acoustic porting' },
        { name: 'Acoustic Front-End', tech: '6-Mic Circular Beamforming Array', description: 'Spatial noise cancellation with 360-degree source localization' },
        { name: 'Neural Inference', tech: 'On-Device Tensor Processing Unit', description: 'Edge keyword verification running locally for complete privacy' },
        { name: 'Telemetry Console', tech: 'Web Audio API & Canvas Oscilloscope', description: 'Real-time spectral visualization with zero main-thread blocking' },
      ],
      metrics: [
        { label: 'Beamforming Latency', value: '3.8ms', detail: 'Instant acoustic directional lock-on' },
        { label: 'Noise Rejection', value: '-24dB', detail: 'Suppression of ambient background reverberation' },
        { label: 'Audio Buffer Rate', value: '48 kHz / 24-bit', detail: 'High-resolution lossless acoustic analysis' },
      ],
    },
    visualType: 'vox-ai',
    prevProjectId: 'pixwall',
    nextProjectId: 'illora-ai',
  },

  'illora-ai': {
    id: 'illora-ai',
    index: '03',
    title: 'ILLORA AI',
    category: 'ENTERPRISE INTELLIGENCE',
    clientOrigin: 'ENTERPRISE SYSTEMS // LONDON',
    year: '2024',
    heroHeadline: 'AUTONOMOUS MULTI-AGENT ORCHESTRATION CONSOLE',
    heroSummary:
      'An enterprise cognitive orchestration console modeling multi-agent decision pipelines. Features structured directed graph topology, animated token transmission channels, worker health diagnostics, and zero-trust verification telemetry.',
    closingStatement: 'ILLORA AI — COMPLEXITY, UNDER CONTROL.',
    accentHue: '#4DA6FF',
    overview: {
      creativeDirection:
        'Cybernetic enterprise clarity. Dark high-contrast information density inspired by aerospace avionics and financial trading consoles.',
      coreChallenge:
        'Autonomous multi-agent workflows involve hundreds of asynchronous decisions, branch evaluations, and consensus loops. Legacy dashboards display disconnected logs that obscure pipeline failures.',
      ourApproach:
        'We architected an interactive directed acyclic graph (DAG) interface that visualizes supervisor agents, specialized worker nodes, and live token packet routes in real time.',
      technologies: ['React 18', 'TypeScript', 'Web Workers', 'SVG Topology Graph', 'Tailwind CSS', 'GSAP'],
      specifications: [
        { label: 'Topology Architecture', value: 'Directed Acyclic Graph (DAG)' },
        { label: 'Security Model', value: 'Zero-Trust Node Verification' },
        { label: 'Telemetry Stream', value: 'Sub-second Web Worker Engine' },
        { label: 'Interface Standard', value: 'High-Density Dark Monospace' },
      ],
    },
    story: {
      challenge: {
        title: 'THE CHALLENGE',
        subtitle: 'UNRAVELING MULTI-AGENT ASYNCHRONY',
        paragraphs: [
          'When multiple AI agents collaborate—drafting code, verifying compliance, routing security credentials, and querying enterprise databases—the sheer volume of asynchronous telemetry can overwhelm human operators.',
          'Enterprise engineers need more than text chat logs; they need topological spatial awareness. They need to see which supervisor agent routed the request, which worker node is synthesizing output, and whether cryptographic verification has passed.',
        ],
        keyTakeaway: 'You cannot manage what you cannot see; cognitive pipelines demand topological clarity.',
      },
      approach: {
        title: 'THE APPROACH',
        subtitle: 'STRUCTURED DIRECTED GRAPH TOPOLOGY',
        paragraphs: [
          'We designed ILLORA around a strict hierarchical mental model: a central Supervisor Dispatcher node at the apex, feeding task tokens into parallel specialist worker nodes (Agent Synthesis and Agent Verify).',
          'Every node has a defined health beacon, latency readout, and load meter. Connecting conduits are visualized through crisp orthographic paths with animated light pulses representing active token data packets in transit.',
        ],
        keyTakeaway: 'Hierarchy and visual direction turn cognitive noise into actionable operational intelligence.',
      },
      engineering: {
        title: 'THE ENGINEERING',
        subtitle: 'OFF-MAIN-THREAD TELEMETRY COMPUTATION',
        paragraphs: [
          'To ensure the UI remains fluid even during bursts of tens of thousands of telemetry events per second, we offloaded graph state calculations and token route math to dedicated Web Workers.',
          'The React UI layer renders only the reconciled diffs using hardware-accelerated SVG and CSS transform matrices, maintaining a solid 60 FPS frame rate on standard engineering workstations.',
        ],
        keyTakeaway: 'Disciplined thread management is the prerequisite for high-density enterprise software.',
      },
      experience: {
        title: 'THE EXPERIENCE',
        subtitle: 'COMMAND OVER COMPLEXITY',
        paragraphs: [
          'The final ILLORA console delivers quiet mastery over complex enterprise infrastructure. Engineers can trace a prompt through dispatch, cognitive synthesis, and zero-trust verification in a single glance.',
          'It replaces confusing terminal output with an interface that feels like the command bridge of an advanced planetary observatory.',
        ],
        keyTakeaway: 'When complex software is crafted with design rigor, operator confidence skyrockets.',
      },
    },
    technicalArchitecture: {
      title: 'ORCHESTRATION PIPELINE & TOPOLOGY ENGINE',
      description: 'Distributed agent mesh with real-time consensus verification and zero-trust telemetry.',
      layers: [
        { name: 'Dispatcher Kernel', tech: 'Asynchronous Node DAG Dispatcher', description: 'Deterministic task scheduling and agent role delegation' },
        { name: 'Worker Mesh', tech: 'Isolated Micro-Agent Runtimes', description: 'Sandboxed LLM evaluation engines with strict memory boundaries' },
        { name: 'Zero-Trust Enclave', tech: 'Cryptographic Proof Verifier', description: 'Hardware-verified signature check before output commit' },
        { name: 'Graph Visualizer', tech: 'Web Worker & SVG Hardware Transform', description: 'Dynamic topology layout rendering without main-thread blocking' },
      ],
      metrics: [
        { label: 'Event Throughput', value: '48.2k events/s', detail: 'Benchmarked in stress-testing worker cluster' },
        { label: 'Pipeline Ping', value: '0.8ms', detail: 'Local node consensus dispatch latency' },
        { label: 'Memory Footprint', value: '18MB RAM', detail: 'Extremely lightweight client memory overhead' },
      ],
    },
    visualType: 'illora-ai',
    prevProjectId: 'vox-ai',
    nextProjectId: 'experimental',
  },

  experimental: {
    id: 'experimental',
    index: '04',
    title: 'EXPERIMENTAL WORKS',
    category: 'CREATIVE ENGINEERING',
    clientOrigin: 'STUDIO RESEARCH LAB // GLOBAL',
    year: '2026',
    heroHeadline: 'REAL-TIME LIQUID CHROME CGI & SHADER LABORATORY',
    heroSummary:
      'Studio research laboratory developing real-time sculptural liquid chrome geometries, procedural raymarched signed distance fields, and non-Euclidean optical reflections within high-performance GPU canvas environments.',
    closingStatement: 'EXPERIMENTAL WORKS — BEYOND THE INTERFACE.',
    accentHue: '#C084FC',
    overview: {
      creativeDirection:
        'Boundary-pushing digital craftsmanship. Mirror-polished automotive chrome, fluid non-Euclidean topologies, and custom GLSL fragment raymarching.',
      coreChallenge:
        'Most interactive WebGL on the internet relies on pre-baked textures or heavy 3D assets that take seconds to download and degrade mobile performance.',
      ourApproach:
        'We created pure mathematical procedural manifolds using custom GPU fragment shaders and optimized Three.js geometries that render instantaneously with zero network loading latency.',
      technologies: ['Three.js', 'WebGL 2.0', 'GLSL Fragment Shaders', 'PMREM Reflection Mapping', 'GSAP'],
      specifications: [
        { label: 'Shader Architecture', value: 'GLSL Raymarched Signed Distance Fields' },
        { label: 'Reflection Pipeline', value: 'Custom Procedural PMREM Equirectangular HDR' },
        { label: 'Target Frame Rate', value: 'Strict 60 FPS Hardware Clamped' },
        { label: 'Asset Payload', value: '0 KB External 3D Models (100% Procedural)' },
      ],
    },
    story: {
      challenge: {
        title: 'THE CHALLENGE',
        subtitle: 'CGI FIDELITY WITHOUT DOWNLOAD WEIGHT',
        paragraphs: [
          'High-end 3D graphics and automotive CGI traditionally require 50MB to 100MB 3D meshes, 4K texture maps, and complex pre-loading spinners that ruin user engagement and mobile accessibility.',
          'The research challenge was: Can we produce an automotive-grade, mirror-polished liquid chrome sculptural experience in real time using pure mathematics and procedural HDR lighting—with zero external 3D model files?',
        ],
        keyTakeaway: 'The greatest optimization is not compressing assets, but generating them procedurally.',
      },
      approach: {
        title: 'THE APPROACH',
        subtitle: 'MATHEMATICAL MANIFOLDS & STUDIO LIGHTING',
        paragraphs: [
          'We formulated a continuous mathematical Torus Knot manifold with smooth topological curvature. Over this geometry, we applied an automotive-grade PBR physical material with zero roughness, maximum clearcoat, and calibrated metallic reflectivity.',
          'To generate liquid reflections, we authored a custom procedural 32-bit floating-point equirectangular HDR environment featuring zenith softboxes, dark negative-fill flags, and razor-sharp equator gleams.',
        ],
        keyTakeaway: 'Reflections define metal; a chrome material is only as realistic as the environment it reflects.',
      },
      engineering: {
        title: 'THE ENGINEERING',
        subtitle: 'LIFECYCLE MANAGEMENT & POINTER PARALLAX',
        paragraphs: [
          'To protect device battery and maintain 60 FPS performance, we integrated an IntersectionObserver that completely pauses the Three.js requestAnimationFrame loop whenever the canvas scrolls out of view.',
          'When in view, subtle pointer movement calculates smooth parallax rotations with damped lerp physics, allowing visitors to inspect how liquid highlights ripple across the chrome surface in real time.',
        ],
        keyTakeaway: 'Luxury digital experiences must be as kind to hardware resources as they are striking to the eye.',
      },
      experience: {
        title: 'THE EXPERIENCE',
        subtitle: 'DIGITAL SCULPTURE AT 60 FPS',
        paragraphs: [
          'The result is a mesmerizing piece of real-time digital art. The chrome knot breathes and undulates gently, catching cool studio lights and dark obsidian shadows like a concept car rotating on a turntable at an international motor show.',
          'It demonstrates the pinnacle of HASH.DEVS creative technology: pushing the limits of the web without compromising performance or architectural integrity.',
        ],
        keyTakeaway: 'Engineering is the brush, mathematics is the paint, and the browser is the canvas.',
      },
    },
    technicalArchitecture: {
      title: 'GRAPHICS PIPELINE & GPU OPTIMIZATION',
      description: 'Pure procedural 3D rendering pipeline with zero external mesh assets.',
      layers: [
        { name: 'Procedural Geometry', tech: 'Three.js TorusKnotGeometry (128x32)', description: 'Procedurally generated vertex topology with computed smooth normals' },
        { name: 'Automotive Chrome PBR', tech: 'MeshPhysicalMaterial (Metalness 1.0)', description: 'Clearcoat 1.0, roughness 0.04 with physical ACES Filmic tone mapping' },
        { name: 'HDR Studio Environment', tech: 'Float32 PMREM Convolution', description: 'Procedural equirectangular HDR softbox environment compiled on GPU' },
        { name: 'Lifecycle Observer', tech: 'IntersectionObserver RAF Throttle', description: 'Automatic frame-loop suspension when off-screen to preserve GPU battery' },
      ],
      metrics: [
        { label: 'Network Model Size', value: '0.00 KB', detail: 'Completely synthesized in code; no .gltf/.obj download' },
        { label: 'Render Performance', value: '60 FPS', detail: 'Smooth hardware-accelerated WebGL 2.0 loop' },
        { label: 'Shader Compilation', value: '<15ms', detail: 'Instantaneous initial pipeline compilation' },
      ],
    },
    visualType: 'experimental',
    prevProjectId: 'illora-ai',
    nextProjectId: 'pixwall',
  },
};

