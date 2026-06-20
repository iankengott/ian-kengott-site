"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Menu, Github } from "lucide-react";
import { NAV_LINKS, PROFILE } from "@/lib/data";
import { ThemeToggle } from "./theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [hidden, setHidden] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>("");
  const [sectionProgress, setSectionProgress] = React.useState(0);

  // Smoothed reading-progress for the brand ring (0 → 1 over the whole page).
  const ringProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });
  const ringOffset = useTransform(
    ringProgress,
    (v) => 62.83 - 62.83 * v // 2πr with r = 10 → circumference ≈ 62.83
  );

  // Compute per-section reading progress (0 → 1 for the active section).
  const computeSectionProgress = React.useCallback(() => {
    if (!activeSection) { setSectionProgress(0); return; }
    const el = document.getElementById(activeSection.slice(1));
    if (!el) { setSectionProgress(0); return; }
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    // Progress = how much of the section has been scrolled past the viewport top.
    const total = rect.height;
    const scrolledPast = viewH - rect.top;
    const pct = Math.max(0, Math.min(1, scrolledPast / total));
    setSectionProgress(pct);
  }, [activeSection]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 12);
    if (latest > prev && latest > 240) setHidden(true);
    else setHidden(false);
    computeSectionProgress();
  });

  // Track which section is currently in view to highlight the active nav link.
  React.useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.slice(1))
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveSection(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-8 lg:px-12 ${
          scrolled
            ? "mt-2 rounded-full border border-border/70 bg-card/70 px-4 backdrop-blur-xl sm:px-4"
            : "border border-transparent"
        }`}
        style={{ width: scrolled ? "calc(100% - 1.5rem)" : "100%" }}
      >
        {/* Brand */}
        <Link
          href="#top"
          className="group inline-flex items-center gap-2.5"
          aria-label={`${PROFILE.name} home`}
        >
          <span className="relative inline-flex h-8 w-8 items-center justify-center">
            {/* reading-progress ring */}
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="var(--border)"
                strokeWidth="1.2"
                fill="none"
              />
              <motion.circle
                cx="12"
                cy="12"
                r="10"
                stroke="var(--copper)"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="62.83"
                style={{ strokeDashoffset: ringOffset }}
              />
            </svg>
            <span className="relative flex h-6 w-6 items-center justify-center rounded-md border border-border bg-card font-display text-[11px] font-semibold tracking-tight text-foreground transition-colors group-hover:border-[var(--copper)]/60">
              {PROFILE.initials}
            </span>
          </span>
          <span className="hidden font-display text-sm font-medium tracking-tight sm:inline">
            {PROFILE.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "text-[var(--copper)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-0.5 h-px bg-[var(--copper)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {isActive && (
                  <span
                    className="nav-section-bar"
                    style={{ width: `${Math.round(sectionProgress * 100)}%` }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 text-foreground transition-colors hover:border-[var(--copper)]/50 hover:text-[var(--copper)] sm:inline-flex"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-border bg-card/60 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
              <SheetHeader>
                <SheetTitle className="font-display text-lg">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
                {NAV_LINKS.map((link, i) => {
                  const isActive = activeSection === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-colors ${
                        isActive
                          ? "bg-accent text-[var(--copper)]"
                          : "text-foreground/80 hover:bg-accent hover:text-[var(--copper)]"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-muted-foreground/70 group-hover:text-[var(--copper)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{link.label}</span>
                      {isActive && (
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--copper)]" />
                      )}
                    </Link>
                  );
                })}
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-base text-foreground/80 transition-colors hover:bg-accent hover:text-[var(--copper)]"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
