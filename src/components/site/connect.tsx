"use client";

import { ArrowUpRight, Clock, Github, Link as LinkIcon, Mail } from "lucide-react";
import { PROFILE, SOCIALS } from "@/lib/data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const ICONS: Record<string, typeof Github> = {
  GitHub: Github,
  "Research sessions": Clock,
  "USF lab page": LinkIcon,
};

export function Connect() {
  return (
    <section id="connect" className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow mb-2">Connect</p>
            <SectionHeading id="connect" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Working on something careful and technical?
            </SectionHeading>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              I am glad to talk research tooling, reproducible environments,
              spectromicroscopy workflows, or interesting infrastructure. This
              site is static, so I keep contact links explicit instead of
              pretending there is a server-side inbox.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1.5">
              <Mail className="h-3.5 w-3.5 text-[var(--copper)]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Best public route: GitHub
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="glass relative rounded-2xl border border-border/70 p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
                <span className="absolute left-3 top-3 h-3.5 w-3.5 rounded-tl border-l border-t border-[var(--copper)]/40" />
                <span className="absolute bottom-3 right-3 h-3.5 w-3.5 rounded-br border-b border-r border-[var(--copper)]/40" />
              </div>
              <div className="relative">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--copper)]">
                  Public links
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                  Start from the work.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  These routes keep the public page useful without exposing
                  private operational details.
                </p>

                <div className="mt-6 grid gap-3">
                  {SOCIALS.map((s) => {
                    const Icon = ICONS[s.label] ?? ArrowUpRight;
                    const prominent = s.href === PROFILE.sessions;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`group inline-flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                          prominent
                            ? "border-[var(--copper)]/45 bg-[var(--copper)]/10"
                            : "border-border/60 bg-card/40 hover:border-[var(--copper)]/50"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-[var(--copper)]" />
                          <span>
                            <span className="block text-sm font-medium">{s.label}</span>
                            {prominent && (
                              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                live research sessions
                              </span>
                            )}
                          </span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--copper)]" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
