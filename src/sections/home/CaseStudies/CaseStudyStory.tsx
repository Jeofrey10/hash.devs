import { MainContainer } from '@/components/layout';
import { CaseStudyData } from './caseStudies';

interface CaseStudyStoryProps {
  caseStudy: CaseStudyData;
}

export function CaseStudyStory({ caseStudy }: CaseStudyStoryProps) {
  const { overview, story } = caseStudy;

  return (
    <div className="relative w-full bg-brand-obsidian py-20 laptop:py-32">
      {/* 1. Project Overview & Asymmetric Metadata Matrix */}
      <MainContainer>
        <div className="mb-24 laptop:mb-36 border-b border-brand-border/60 pb-16 laptop:pb-24">
          <div className="grid grid-cols-1 laptop:grid-cols-12 gap-12 laptop:gap-16 items-start">
            {/* Left 5 Columns: Creative Direction & Challenge Summary */}
            <div className="laptop:col-span-5 flex flex-col gap-8">
              <div className="font-mono text-xs font-bold tracking-widest text-brand-neon uppercase">
                [01] PROJECT FOUNDATION & DIRECTION
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-brand-muted mb-2">
                  CREATIVE DIRECTION
                </h3>
                <p className="font-body text-base sm:text-lg text-brand-white/90 leading-relaxed font-light">
                  {overview.creativeDirection}
                </p>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-brand-muted mb-2">
                  CORE CHALLENGE
                </h3>
                <p className="font-body text-base sm:text-lg text-brand-white/90 leading-relaxed font-light">
                  {overview.coreChallenge}
                </p>
              </div>
            </div>

            {/* Right 7 Columns: Specifications & Technical Stack */}
            <div className="laptop:col-span-7 flex flex-col gap-10 bg-brand-surface/40 border border-brand-border/80 rounded-2xl p-6 sm:p-8 laptop:p-10">
              <div className="font-mono text-xs font-bold tracking-widest text-brand-neon uppercase border-b border-brand-border/60 pb-4">
                SYSTEM SPECIFICATIONS & STACK
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {overview.specifications.map((spec, idx) => (
                  <div key={idx} className="border-l-2 border-brand-neon/60 pl-3">
                    <span className="block font-mono text-[10px] text-brand-muted uppercase tracking-wider">
                      {spec.label}
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-brand-white mt-1 block">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Technologies Pills */}
              <div className="border-t border-brand-border/60 pt-6">
                <span className="block font-mono text-[10px] text-brand-muted uppercase tracking-wider mb-3">
                  PRIMARY TECHNOLOGIES & RUNTIMES
                </span>
                <div className="flex flex-wrap gap-2">
                  {overview.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="rounded border border-brand-border bg-brand-surface px-3 py-1 font-mono text-[10px] font-semibold text-brand-white tracking-wider uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Editorial 4-Part Narrative Storytelling */}
        <div className="flex flex-col gap-24 laptop:gap-36">
          {/* Section 01: The Challenge */}
          <StoryChapter
            index="01"
            title={story.challenge.title}
            subtitle={story.challenge.subtitle}
            paragraphs={story.challenge.paragraphs}
            keyTakeaway={story.challenge.keyTakeaway}
          />

          {/* Section 02: The Approach */}
          <StoryChapter
            index="02"
            title={story.approach.title}
            subtitle={story.approach.subtitle}
            paragraphs={story.approach.paragraphs}
            keyTakeaway={story.approach.keyTakeaway}
          />

          {/* Section 03: The Engineering */}
          <StoryChapter
            index="03"
            title={story.engineering.title}
            subtitle={story.engineering.subtitle}
            paragraphs={story.engineering.paragraphs}
            keyTakeaway={story.engineering.keyTakeaway}
          />

          {/* Section 04: The Experience */}
          <StoryChapter
            index="04"
            title={story.experience.title}
            subtitle={story.experience.subtitle}
            paragraphs={story.experience.paragraphs}
            keyTakeaway={story.experience.keyTakeaway}
          />
        </div>
      </MainContainer>
    </div>
  );
}

interface StoryChapterProps {
  index: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  keyTakeaway?: string;
}

function StoryChapter({ index, title, subtitle, paragraphs, keyTakeaway }: StoryChapterProps) {
  return (
    <article className="border-t border-brand-border/60 pt-10 sm:pt-14 grid grid-cols-1 laptop:grid-cols-12 gap-8 laptop:gap-14 items-start">
      {/* Chapter Index & Monumental Title */}
      <div className="laptop:col-span-5">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-brand-neon uppercase tracking-widest mb-3">
          <span>[{index}]</span>
          <span>// CHAPTER</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl laptop:text-4xl desktop:text-[2.75rem] font-extrabold text-brand-white tracking-tight uppercase leading-[1.02]">
          {title}
        </h2>
        <p className="mt-2.5 font-mono text-xs text-brand-muted tracking-wider uppercase font-semibold">
          {subtitle}
        </p>
      </div>

      {/* Narrative Prose & Editorial Takeaway */}
      <div className="laptop:col-span-7 flex flex-col gap-6">
        {paragraphs.map((p, idx) => (
          <p
            key={idx}
            className="font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed"
          >
            {p}
          </p>
        ))}

        {keyTakeaway && (
          <div className="mt-4 p-5 sm:p-6 rounded-xl border border-brand-neon/30 bg-brand-neon/[0.04] backdrop-blur-sm">
            <span className="block font-mono text-[10px] text-brand-neon font-bold uppercase tracking-widest mb-1.5">
              ATELIER INSIGHT // KEY TAKEAWAY
            </span>
            <p className="font-body text-sm sm:text-base text-brand-white font-medium italic leading-relaxed">
              "{keyTakeaway}"
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
