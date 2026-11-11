import {
  HeroSection,
  BrandStatement,
  StudioShowcase,
  FeaturedWorks,
  StudioProcess,
  ContactSection,
  Footer,
} from '@/sections/home';

export default function Home() {
  return (
    <div className="relative w-full bg-brand-obsidian">
      {/* 1. Global Cinematic 3D Hero Section (Phase 03.3) */}
      <HeroSection />

      {/* 2. Brand Statement: Philosophy & Impact (Phase 04) */}
      <BrandStatement />

      {/* 3. Studio Showcase: Capabilities & Creative Disciplines (Phase 04) */}
      <StudioShowcase />

      {/* 4. Featured Works & Portfolio Architecture (Phase 05.0) */}
      <FeaturedWorks />

      {/* 5. Studio Process: Creative Engineering (Phase 06) */}
      <StudioProcess />

      {/* 6. Contact & Project Initiation Experience (Phase 07) */}
      <ContactSection />

      {/* 7. Cinematic Editorial Footer (Phase 07.1) */}
      <Footer />
    </div>
  );
}
