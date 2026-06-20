import { Navbar } from "@/components/site/navbar";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { Hero } from "@/components/site/hero";
import { Stats } from "@/components/site/stats";
import { SessionStrip } from "@/components/site/session-strip";
import { Research } from "@/components/site/research";
import { Systems } from "@/components/site/systems";
import { Expertise } from "@/components/site/expertise";
import { Projects } from "@/components/site/projects";
import { Timeline } from "@/components/site/timeline";
import { FieldNotes } from "@/components/site/field-notes";
import { Principles } from "@/components/site/principles";
import { Connect } from "@/components/site/connect";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { AtelierDivider } from "@/components/site/atelier-divider";
import { ShortcutsOverlay } from "@/components/site/shortcuts-overlay";
import { CommandPaletteProvider } from "@/components/site/command-palette";
import { TourProvider } from "@/components/site/tour";
import { ResumeBanner } from "@/components/site/resume-banner";
import { ReadingProgress } from "@/components/site/reading-progress";
import { FocusMode } from "@/components/site/focus-mode";

export default function Home() {
  return (
    <TourProvider>
      <CommandPaletteProvider>
        <div className="relative flex min-h-screen flex-col">
          <ScrollProgress />
          <ReadingProgress />
          <Navbar />
          <main className="relative z-10 flex-1">
            <Hero />
            <Stats />
            <SessionStrip />
            <Research />
            <AtelierDivider />
            <Systems />
            <Expertise />
            <AtelierDivider />
            <Projects />
            <Timeline />
            <AtelierDivider />
            <FieldNotes />
            <Principles />
            <AtelierDivider />
            <Connect />
          </main>
          <Footer />
          <BackToTop />
          <ShortcutsOverlay />
          <ResumeBanner />
          <FocusMode />
        </div>
      </CommandPaletteProvider>
    </TourProvider>
  );
}
