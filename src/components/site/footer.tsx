"use client";

import Link from "next/link";
import { Github, ArrowUpRight, Linkedin, Mail } from "lucide-react";
import { PROFILE, SOCIALS } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-background/60">
      {/* Copper accent rule at the very top of the footer */}
      <div className="footer-rule" aria-hidden />

      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <div className="flex items-center gap-3">
          {/* Branding mark */}
          <span className="footer-brand" aria-hidden>
            IK
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="font-display text-sm font-medium tracking-tight">
              {PROFILE.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Made with care. Static where it counts, dynamic where it helps.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Social links as compact icon row */}
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:border-[var(--copper)]/50 hover:text-[var(--copper)]"
            >
              <Mail className="h-3.5 w-3.5" />
            </a>
          ))}
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:border-[var(--copper)]/50 hover:text-[var(--copper)]"
          >
            <Github className="h-3.5 w-3.5" />
          </a>
          <Link
            href="#top"
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-[var(--copper)]/50 hover:text-[var(--copper)]"
          >
            Back to top
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
