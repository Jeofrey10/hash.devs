import { useEffect } from 'react';
import {
  AboutHero,
  StudioPhilosophy,
  WhoWeAre,
  OurApproach,
  CreativeCapabilities,
  AboutCollaborationCTA,
} from '@/sections/about';
import { Footer } from '@/sections/home';

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'About // HASH.DEVS — Creative Technology Studio';
  }, []);

  return (
    <div className="relative w-full bg-brand-obsidian">
      {/* 01. Cinematic About Hero with 3D Kinetic Chrome Sculpture */}
      <AboutHero />

      {/* 02. Studio Philosophy Statement */}
      <StudioPhilosophy />

      {/* 03. Who We Are: Architecture & Topology */}
      <WhoWeAre />

      {/* 04. Our Approach: The Four Interconnected Pillars */}
      <OurApproach />

      {/* 05. Creative Capabilities: Visual Bridge to Services */}
      <CreativeCapabilities />

      {/* 06. Final Collaboration CTA */}
      <AboutCollaborationCTA />

      {/* 07. Official Three-Zone Editorial Footer */}
      <Footer />
    </div>
  );
}
