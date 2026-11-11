import { useEffect } from 'react';
import {
  WorkHero,
  ArchiveIntro,
  ProjectArchive,
  ProjectDisciplines,
  ExperimentationStatement,
  WorkCollaborationCTA,
} from '@/sections/work';
import { Footer } from '@/sections/home';

export default function Work() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Work // HASH.DEVS — Creative Technology Studio';
  }, []);

  return (
    <div className="relative w-full bg-brand-obsidian">
      {/* 01. Cinematic Work Hero */}
      <WorkHero />

      {/* 02. Project Archive Introduction */}
      <ArchiveIntro />

      {/* 03. Immersive Project Archive: 4 Curated Projects with Real 3D Scenes */}
      <ProjectArchive />

      {/* 04. Project Disciplines: 5 Core Competencies */}
      <ProjectDisciplines />

      {/* 05. Experimentation Statement: Research Interlude */}
      <ExperimentationStatement />

      {/* 06. Collaboration CTA: Start Something */}
      <WorkCollaborationCTA />

      {/* 07. Official Three-Zone Editorial Footer */}
      <Footer />
    </div>
  );
}
