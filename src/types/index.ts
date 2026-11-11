import { ReactNode } from 'react';

/**
 * Brand Design Tokens Type Definitions
 */
export interface BrandTokens {
  colors: {
    obsidian: string;
    neon: string;
    white: string;
    graphite: string;
  };
  breakpoints: {
    mobile: number;
    tablet: number;
    laptop: number;
    desktop: number;
  };
}

/**
 * Base Component Props
 */
export interface BaseProps {
  className?: string;
  children?: ReactNode;
  id?: string;
}

/**
 * Animation Configuration Types
 */
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  reducedMotion?: boolean;
}

/**
 * Prepared Three.js / R3F Scene Architecture Types
 * (Ready for future Phase 3D integration without runtime overhead)
 */
export interface SceneConfig {
  antialias?: boolean;
  alpha?: boolean;
  dpr?: [number, number];
  camera?: {
    fov?: number;
    near?: number;
    far?: number;
    position?: [number, number, number];
  };
}

/**
 * Navigation Item Schema
 */
export interface NavItem {
  id: string;
  label: string;
  path: string;
  isExternal?: boolean;
}

