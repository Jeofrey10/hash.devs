import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { WORK_COPY } from './workConfig';
import { ProjectArchiveCard } from './ProjectArchiveCard';

export function ProjectArchive() {
  const { projects } = WORK_COPY;

  return (
    <section
      id="project-archive"
      className="relative w-full bg-brand-obsidian py-20 sm:py-28 overflow-hidden"
      aria-label="Immersive Project Archive"
    >
      <MainContainer className="relative z-10 w-full">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-brand-border/60">
          <div>
            <div className="mb-4">
              <EyebrowLabel indicator index="03" className="text-brand-neon font-bold">
                [ 03 ] // PROJECT DOSSIERS
              </EyebrowLabel>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl laptop:text-5xl tracking-tight text-brand-white">
              CURATED COMMISSIONS // 2024–2026
            </h2>
          </div>

          <div className="font-mono text-xs text-brand-muted flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
            <span>INTERACTIVE ARCHIVE // SELECT CARD TO ENTER DOSSIER</span>
          </div>
        </div>

        {/* 4 Immersive Project Cards */}
        <div className="w-full">
          {projects.map((project, idx) => (
            <ProjectArchiveCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </MainContainer>
    </section>
  );
}

