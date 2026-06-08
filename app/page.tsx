import { AboutSection } from "@/components/sections/about-section";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { ContactSection } from "@/components/sections/contact-section";
import { EducationSection } from "@/components/sections/education-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { FloatingActionButton } from "@/components/system/floating-action-button";
import { MiniGamesButton } from "@/components/system/mini-games-button";
import { AmbientBackground } from "@/components/visual/ambient-background";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <AmbientBackground />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <CertificationsSection />
      <EducationSection />
      <ContactSection />
      <FloatingActionButton />
      <MiniGamesButton />
    </main>
  );
}
