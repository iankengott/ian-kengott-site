"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./theme-provider";

type Mode = "light" | "dark" | "system";

const MODE_META: Record<Mode, { icon: typeof Sun; label: string; hint: string }> = {
  light: { icon: Sun, label: "Light", hint: "Day mode" },
  dark: { icon: Moon, label: "Dark", hint: "Night mode" },
  system: { icon: Monitor, label: "System", hint: "Follow OS" },
};

/**
 * Theme toggle as a 3-state popover: Light / Dark / System.
 * The trigger button shows the current mode's icon.
 */
export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !popoverRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const CurrentIcon = MODE_META[mode].icon;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Theme settings"
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 text-foreground transition-colors hover:border-[var(--copper)]/50 hover:text-[var(--copper)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mode}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
          >
            <CurrentIcon className="h-4 w-4" />
          </motion.span>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popoverRef}
            role="menu"
            aria-label="Choose theme"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="theme-popover absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-border/70 bg-card/95 p-1 shadow-2xl backdrop-blur-xl"
          >
            {(Object.keys(MODE_META) as Mode[]).map((m) => {
              const meta = MODE_META[m];
              const Icon = meta.icon;
              const isActive = m === mode;
              return (
                <button
                  key={m}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => {
                    setMode(m);
                    setOpen(false);
                  }}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-[var(--copper)]/10 text-[var(--copper)]"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="flex-1 font-medium">{meta.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                    {meta.hint}
                  </span>
                  {isActive && <Check className="h-3 w-3 text-[var(--copper)]" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
