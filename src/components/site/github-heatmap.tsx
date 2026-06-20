"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GitBranch, Star, GitFork, FolderGit2, Activity } from "lucide-react";

type Day = { count: number; level: 0 | 1 | 2 | 3 | 4; date: string };
type Week = { days: Day[] };
type Stats = {
  totalEvents: number;
  publicRepos: number;
  stars: number;
  forks: number;
  pushedAt: string | null;
};
type Payload = {
  weeks: Week[];
  stats: Stats;
  source: "live" | "cache" | "fallback";
  generatedAt: string;
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * GitHubHeatmap — a 53-week contribution grid + repo stats, fed by
 * /api/github. Falls back gracefully (the API itself returns deterministic
 * pseudo-data when GitHub is rate-limited). The grid renders in with a
 * staggered fade so it feels alive without being distracting.
 */
export function GitHubHeatmap() {
  const [data, setData] = React.useState<Payload | null>(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/github")
      .then((r) => r.json())
      .then((p: Payload) => {
        if (alive) setData(p);
      })
      .catch(() => {
        if (alive) setError(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (error) {
    return (
      <div className="gh-heatmap-card text-sm text-muted-foreground">
        Contribution graph unavailable right now.
      </div>
    );
  }

  if (!data) {
    return <HeatmapSkeleton />;
  }

  const monthLabels = buildMonthLabels(data.weeks);
  const isFallback = data.source === "fallback";
  const activeDays = data.weeks.reduce(
    (sum, w) => sum + w.days.filter((d) => d.level > 0).length,
    0,
  );

  return (
    <div className="gh-heatmap-card">
      <div className="gh-heatmap-head">
        <span className="gh-heatmap-title">
          <Activity className="h-3.5 w-3.5 text-[var(--copper)]" />
          <strong>GitHub activity</strong> · 12 months
        </span>
        <span className="gh-live-pill" title={data.source}>
          <span className="gh-live-dot" />
          {isFallback ? "sample" : data.source === "live" ? "live" : "cached"}
        </span>
      </div>

      <div className="gh-grid-wrap">
        <div className="gh-grid" role="img" aria-label="GitHub contribution graph for the last 53 weeks">
          {data.weeks.map((week, wi) =>
            week.days.map((day, di) => (
              <motion.div
                key={`${wi}-${di}`}
                className="gh-cell"
                data-level={day.level}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.18,
                  delay: Math.min(0.9, (wi * 7 + di) * 0.0015),
                  ease: "easeOut",
                }}
                title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
              />
            )),
          )}
        </div>
        <div className="gh-month-labels">
          {monthLabels.map((m, i) => (
            <span key={i} style={{ width: "auto" }}>
              {m ?? ""}
            </span>
          ))}
        </div>
      </div>

      <div className="gh-stats">
        <Stat icon={<FolderGit2 className="h-3.5 w-3.5" />} num={data.stats.publicRepos} label="public repos" />
        <Stat icon={<GitBranch className="h-3.5 w-3.5" />} num={data.stats.totalEvents} label="recent events" />
        <Stat icon={<Star className="h-3.5 w-3.5" />} num={data.stats.stars} label="stars" />
        <Stat icon={<GitFork className="h-3.5 w-3.5" />} num={data.stats.forks} label="forks" />
        <Stat icon={<Activity className="h-3.5 w-3.5" />} num={activeDays} label="active days" />
        <div className="gh-legend ml-auto">
          less
          <span className="gh-legend-cells">
            <span className="gh-cell" data-level="0" />
            <span className="gh-cell" data-level="1" />
            <span className="gh-cell" data-level="2" />
            <span className="gh-cell" data-level="3" />
            <span className="gh-cell" data-level="4" />
          </span>
          more
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  num,
  label,
}: {
  icon: React.ReactNode;
  num: number;
  label: string;
}) {
  return (
    <div className="gh-stat">
      <span className="flex items-center gap-1.5 text-[var(--copper)]">
        {icon}
        <span className="gh-stat-num">{num}</span>
      </span>
      <span className="gh-stat-label">{label}</span>
    </div>
  );
}

function HeatmapSkeleton() {
  return (
    <div className="gh-heatmap-card">
      <div className="gh-heatmap-head">
        <span className="gh-heatmap-title">
          <Activity className="h-3.5 w-3.5 text-[var(--copper)]" />
          <strong>Loading activity…</strong>
        </span>
      </div>
      <div className="gh-grid-wrap">
        <div className="gh-grid">
          {Array.from({ length: 53 * 7 }).map((_, i) => (
            <div
              key={i}
              className="gh-cell"
              style={{
                background:
                  i % 5 === 0
                    ? "color-mix(in oklch, var(--copper) 22%, transparent)"
                    : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Return an array (one per week) of month abbreviations, showing a label
 * only on the first week that contains the 1st of a month. */
function buildMonthLabels(weeks: Week[]): (string | null)[] {
  const labels: (string | null)[] = [];
  let lastMonth = -1;
  for (const week of weeks) {
    const firstDay = week.days[0];
    if (!firstDay) {
      labels.push(null);
      continue;
    }
    const m = new Date(firstDay.date + "T00:00:00Z").getUTCMonth();
    if (m !== lastMonth) {
      labels.push(MONTHS[m]);
      lastMonth = m;
    } else {
      labels.push(null);
    }
  }
  return labels;
}
