"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Moon, Sun, CornerDownLeft, ArrowUpRight, ArrowDown, ArrowUp, Compass, Clock } from "lucide-react";
import { PROFILE, SEARCH_ITEMS, type SearchItem } from "@/lib/data";
import { useTheme } from "./theme-provider";
import { useTour } from "./tour";
import { useRecentSections } from "./use-recent-sections";

interface CommandPaletteCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const Ctx = React.createContext<CommandPaletteCtx>({ open: false, setOpen: () => {} });

export function useCommandPalette() {
  return React.useContext(Ctx);
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Ctx.Provider value={{ open, setOpen }}>
      {children}
      <CommandPalette />
    </Ctx.Provider>
  );
}

/** Lightweight fuzzy match: returns score (>0 = match) or null. */
function fuzzy(query: string, text: string): number | null {
  if (!query) return 1;
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return 1;
  if (t.includes(q)) {
    // exact substring match scores by how early it appears
    return 100 - Math.min(60, t.indexOf(q));
  }
  // subsequence match
  let qi = 0;
  let score = 0;
  let lastIdx = -1;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += lastIdx === -1 ? 2 : ti - lastIdx <= 2 ? 5 : 1;
      lastIdx = ti;
      qi++;
    }
  }
  return qi === q.length ? score : null;
}

function scoreItem(query: string, item: SearchItem): number {
  const haystack = [item.label, item.hint, item.group, ...item.keywords].join(" ");
  const labelScore = fuzzy(query, item.label);
  const hayScore = fuzzy(query, haystack);
  const best = Math.max(labelScore ?? 0, hayScore ?? 0);
  // boost label matches
  return labelScore ? best + 30 : best;
}

/**
 * Highlight the matched query substring (case-insensitive) inside a label.
 * Falls back to the plain label when there is no query or no match.
 */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const ql = q.toLowerCase();
  const idx = lower.indexOf(ql);
  if (idx === -1) {
    // try subsequence highlight (first occurrence of each char)
    const parts: React.ReactNode[] = [];
    let qi = 0;
    for (let i = 0; i < text.length && qi < q.length; i++) {
      if (text[i].toLowerCase() === ql[qi]) {
        if (i > 0 && qi === 0) parts.push(text.slice(0, i));
        else if (qi > 0) {
          const prevEnd = (parts[parts.length - 1] as { end?: number }) ?? {};
          // simpler: rebuild as we go
        }
        qi++;
      }
    }
    // Fallback: render the label unhighlighted (subsequence highlight is messy)
    return <>{text}</>;
  }
  return (
    <>
      {idx > 0 && <span>{text.slice(0, idx)}</span>}
      <mark className="palette-mark">{text.slice(idx, idx + q.length)}</mark>
      {idx + q.length < text.length && <span>{text.slice(idx + q.length)}</span>}
    </>
  );
}

function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const { theme, toggle } = useTheme();
  const { start: startTour } = useTour();
  const [query, setQuery] = React.useState("");
  const recent = useRecentSections();

  // Reset query whenever palette opens
  React.useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const run = (fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 120);
  };

  const activate = (item: SearchItem) => {
    if (item.action === "external") {
      run(() => window.open(item.target, "_blank"));
    } else {
      run(() => {
        const el = document.querySelector(item.target);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const activateSection = (id: string) => {
    run(() => {
      const el = document.querySelector(`#${id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // Recent sections only show when there's no active query (otherwise the
  // fuzzy search results take over). Cap at 3 for the palette.
  const showRecent = !query.trim() && recent.length > 0;
  const recentTop = recent.slice(0, 3);

  // Compute filtered + grouped results
  const filtered = React.useMemo(() => {
    const scored = SEARCH_ITEMS.map((item) => ({
      item,
      score: scoreItem(query, item),
    })).filter((x) => x.score > 0);
    scored.sort((a, b) => b.score - a.score);
    const groups = new Map<string, SearchItem[]>();
    for (const { item } of scored) {
      if (!groups.has(item.group)) groups.set(item.group, []);
      groups.get(item.group)!.push(item);
    }
    return Array.from(groups.entries());
  }, [query]);

  const themeAction = {
    id: "act-theme",
    label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    hint: "Toggle appearance",
    group: "Actions",
    icon: theme === "dark" ? Sun : Moon,
    run: () => run(toggle),
  };

  const tourAction = {
    id: "act-tour",
    label: "Take a guided tour",
    hint: "Walk the 8 sections",
    group: "Actions",
    icon: Compass,
    run: () => run(startTour),
  };

  const showThemeAction = !query || fuzzy(query, "theme light dark toggle appearance");
  // For the tour action, match on any query word being a substring of the
  // keyword set — this is more forgiving than subsequence for multi-word queries.
  const tourKeywords = "tour guide walk explore intro take start";
  const showTourAction =
    !query ||
    fuzzy(query, tourKeywords) !== null ||
    query
      .toLowerCase()
      .split(/\s+/)
      .some((w) => w.length >= 3 && tourKeywords.includes(w));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden border-border bg-popover/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-[600px]">
        <CommandPrimitive className="flex flex-col" shouldFilter={false}>
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <CommandPrimitive.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search sections, projects, principles, notes…"
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
              esc
            </kbd>
          </div>
          <CommandPrimitive.List className="max-h-[380px] overflow-y-auto p-2">
            <CommandPrimitive.Empty className="py-10 text-center text-sm text-muted-foreground">
              No results for “{query}”.
            </CommandPrimitive.Empty>

            {showRecent && (
              <CommandPrimitive.Group
                heading="Recently viewed"
                className="palette-recent-group text-muted-foreground"
              >
                {recentTop.map((r) => (
                  <ResultRow
                    key={`recent-${r.id}`}
                    labelNode={
                      <span className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[var(--copper)]" />
                        {r.label}
                      </span>
                    }
                    hint="continue reading"
                    className="palette-recent-row"
                    onSelect={() => activateSection(r.id)}
                  />
                ))}
              </CommandPrimitive.Group>
            )}

            {filtered.map(([group, items]) => (
              <CommandPrimitive.Group
                key={group}
                heading={group}
                className="text-muted-foreground"
              >
                {items.map((item) => (
                  <ResultRow
                    key={item.id}
                    labelNode={<Highlight text={item.label} query={query} />}
                    hint={item.hint}
                    external={item.action === "external"}
                    onSelect={() => activate(item)}
                  />
                ))}
              </CommandPrimitive.Group>
            ))}

            {(showThemeAction || showTourAction) && (
              <CommandPrimitive.Group heading="Actions" className="text-muted-foreground">
                {showThemeAction && (
                  <ResultRow
                    labelNode={themeAction.label}
                    hint={themeAction.hint}
                    icon={<themeAction.icon className="h-4 w-4" />}
                    onSelect={themeAction.run}
                  />
                )}
                {showTourAction && (
                  <ResultRow
                    labelNode={tourAction.label}
                    hint={tourAction.hint}
                    icon={<tourAction.icon className="h-4 w-4" />}
                    onSelect={tourAction.run}
                  />
                )}
              </CommandPrimitive.Group>
            )}
          </CommandPrimitive.List>
          <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                <ArrowDown className="h-3 w-3" />
                navigate
              </span>
              <span className="flex items-center gap-1">
                <CornerDownLeft className="h-3 w-3" />
                select
              </span>
            </span>
            <span className="font-mono">
              {SEARCH_ITEMS.length + 2} indexed · ⌘K
            </span>
          </div>
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  );
}

function ResultRow({
  labelNode,
  label,
  hint,
  external,
  icon,
  className = "",
  onSelect,
}: {
  labelNode: React.ReactNode;
  label?: string;
  hint: string;
  external?: boolean;
  icon?: React.ReactNode;
  className?: string;
  onSelect: () => void;
}) {
  return (
    <CommandPrimitive.Item
      onSelect={onSelect}
      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/90 outline-none data-[selected=true]:bg-accent data-[selected=true]:text-[var(--copper)] ${className}`}
    >
      <span className="text-muted-foreground">
        {icon ?? (external ? <ArrowUpRight className="h-4 w-4" /> : <span className="font-mono text-[10px]">›</span>)}
      </span>
      <span className="flex-1 truncate">{labelNode ?? label}</span>
      <span className="truncate font-mono text-[10px] text-muted-foreground/80">
        {hint}
      </span>
    </CommandPrimitive.Item>
  );
}
