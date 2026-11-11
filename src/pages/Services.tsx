import { useEffect } from 'react';
import {
  ServicesHero,
  CapabilitiesIntro,
  ServicesDisciplineMatrix,
  EngineeringApproach,
  TechnologyCraft,
  ServicesCollaborationCTA,
} from '@/sections/services';
import { Footer } from '@/sections/home';

export default function Services() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Services // HASH.DEVS — Creative Technology Studio';
  }, []);

  return (
    <div className="relative w-full bg-brand-obsidian">
      {/* 01. Cinematic Services Hero with 3D Kinetic Mechanical Sculpture */}
      <ServicesHero />

      {/* 02. Our Capabilities: Editorial Introduction */}
      <CapabilitiesIntro />

      {/* 03. Services Discipline Matrix: 5 Expandable Disciplines */}
      <ServicesDisciplineMatrix />

      {/* 04. Our Engineering Approach: 4-Stage Methodology */}
      <EngineeringApproach />

      {/* 05. Technology & Craft: Engineering Repertoire */}
      <TechnologyCraft />

      {/* 06. Collaboration CTA: Start a Project */}
      <ServicesCollaborationCTA />

      {/* 07. Official Three-Zone Editorial Footer */}
      <Footer />
    </div>
  );
}
