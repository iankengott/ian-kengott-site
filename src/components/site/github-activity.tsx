"use client";

import * as React from "react";
import { Activity, AlertCircle, GitBranch, Github, GitPullRequest, Star } from "lucide-react";
import { PROFILE } from "@/lib/data";

type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string | null;
  archived: boolean;
  fork: boolean;
};

type Event = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
};

type GitHubState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; repos: Repo[]; events: Event[]; fetchedAt: string };

export function GitHubActivity() {
  const [state, setState] = React.useState<GitHubState>({ status: "loading" });

  React.useEffect(() => {
    let cancelled = false;
    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    async function load() {
      try {
        const [reposRes, eventsRes] = await Promise.all([
          fetch("https://api.github.com/users/iankengott/repos?per_page=100&sort=pushed", { headers }),
          fetch("https://api.github.com/users/iankengott/events/public?per_page=20", { headers }),
        ]);

        if (!reposRes.ok) {
          throw new Error(`GitHub repos API returned ${reposRes.status}`);
        }
        if (!eventsRes.ok) {
          throw new Error(`GitHub events API returned ${eventsRes.status}`);
        }

        const repos = (await reposRes.json()) as Repo[];
        const events = (await eventsRes.json()) as Event[];
        if (!cancelled) {
          setState({
            status: "ready",
            repos,
            events,
            fetchedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "GitHub API request failed",
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <section className="github-panel mt-8 rounded-2xl border border-border/70 bg-card/40 p-6">
        <p className="eyebrow mb-3 flex items-center gap-2">
          <Github className="h-3.5 w-3.5" />
          GitHub / Live Public API
        </p>
        <div className="grid gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted/50" />
          ))}
        </div>
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section className="github-panel mt-8 rounded-2xl border border-border/70 bg-card/40 p-6">
        <p className="eyebrow mb-3 flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5" />
          GitHub / Live Public API
        </p>
        <p className="text-sm text-muted-foreground">
          I could not load public GitHub metadata in this browser session:
          {" "}
          <span className="font-mono text-foreground/80">{state.message}</span>.
        </p>
        <a href={PROFILE.github} target="_blank" rel="noreferrer" className="link-copper mt-3 inline-flex text-sm">
          Open my GitHub profile
        </a>
      </section>
    );
  }

  const repos = state.repos.filter((repo) => !repo.archived);
  const ownRepos = repos.filter((repo) => !repo.fork);
  const recentRepos = repos
    .slice()
    .sort((a, b) => Date.parse(b.pushed_at ?? "0") - Date.parse(a.pushed_at ?? "0"))
    .slice(0, 4);
  const recentEvents = state.events.slice(0, 5);
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const lastPush = recentRepos[0]?.pushed_at ?? null;

  return (
    <section className="github-panel card-lift relative mt-8 overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-6">
      <div className="relative z-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2 flex items-center gap-2">
              <Github className="h-3.5 w-3.5" />
              GitHub / Live Public API
            </p>
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              Public code activity, pulled from GitHub.
            </h3>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            fetched {formatDateTime(state.fetchedAt)}
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <LiveStat icon={GitBranch} label="public repos" value={String(repos.length)} />
          <LiveStat icon={Activity} label="original repos" value={String(ownRepos.length)} />
          <LiveStat icon={Star} label="stars" value={String(totalStars)} />
          <LiveStat icon={GitPullRequest} label="forks" value={String(totalForks)} />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Recently pushed repositories
              </p>
              {lastPush && (
                <span className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  latest {formatDate(lastPush)}
                </span>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {recentRepos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-border/60 bg-background/35 p-4 transition-colors hover:border-[var(--copper)]/45"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-base font-semibold">{repo.name}</p>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {repo.language ?? "repo"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {repo.description ?? "No public description set."}
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    pushed {formatDate(repo.pushed_at)}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/35 p-4">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Recent public events
            </p>
            <ol className="space-y-3">
              {recentEvents.length === 0 ? (
                <li className="text-sm text-muted-foreground">No recent public events returned by GitHub.</li>
              ) : (
                recentEvents.map((event) => (
                  <li key={event.id} className="border-l border-[var(--copper)]/30 pl-3">
                    <p className="text-sm text-foreground/85">
                      {eventLabel(event.type)}{" "}
                      <span className="text-muted-foreground">in {event.repo.name}</span>
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {formatDate(event.created_at)}
                    </p>
                  </li>
                ))
              )}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/35 p-4">
      <Icon className="mb-3 h-4 w-4 text-[var(--copper)]" />
      <p className="font-display text-2xl font-semibold tabular-nums">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function eventLabel(type: string) {
  return type
    .replace(/Event$/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

function formatDate(value: string | null) {
  if (!value) return "unknown";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
