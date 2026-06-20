"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { KEYBOARD_SHORTCUTS, VIM_GO } from "@/lib/data";
import { useTheme } from "./theme-provider";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/**
 * Centralized keyboard-shortcut layer.
 *
 * - `?` toggles this overlay
 * - `t` toggles the theme
 * - `b` smooth-scrolls back to the top
 * - `g` + key performs vim-style section jumps (r/s/e/p/j/n/c)
 * - `Esc` is handled by the Dialog itself
 *
 * Single-key shortcuts are ignored while typing in inputs, textareas,
 * contenteditable, or while any modifier (other than Shift) is held, so they
 * never collide with form entry.
 */
export function ShortcutsOverlay() {
  const [open, setOpen] = React.useState(false);
  const [goArmed, setGoArmed] = React.useState(false);
  const { toggle: toggleTheme } = useTheme();
  const goPending = React.useRef(false);
  const goTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const isTyping = () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    };

    const disarm = () => {
      goPending.current = false;
      setGoArmed(false);
      if (goTimer.current) {
        clearTimeout(goTimer.current);
        goTimer.current = null;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      // Never intercept combos with meta/ctrl/alt (⌘K etc. handled elsewhere).
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // Skip when typing in a form field.
      if (isTyping()) return;
      // Skip if a dialog is already open (e.g. command palette) — but allow
      // Escape through the browser default and `?` to be ignored there.
      const key = e.key;

      // Vim-style two-key navigation: `g` arms, next key navigates.
      if (goPending.current) {
        if (goTimer.current) clearTimeout(goTimer.current);
        goPending.current = false;
        setGoArmed(false);
        const target = VIM_GO[key.toLowerCase()];
        if (target) {
          e.preventDefault();
          const el = document.querySelector(target);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }

      if (key === "?") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (key === "Escape") {
        if (open) setOpen(false);
        disarm();
        return;
      }
      if (open) return; // other keys do nothing while overlay is open

      if (key === "t" || key === "T") {
        e.preventDefault();
        toggleTheme();
        return;
      }
      if (key === "b" || key === "B") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (key === "g" || key === "G") {
        e.preventDefault();
        goPending.current = true;
        setGoArmed(true);
        // Reset the pending state if no second key arrives in 900ms.
        goTimer.current = setTimeout(() => {
          goPending.current = false;
          setGoArmed(false);
        }, 900);
        return;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (goTimer.current) clearTimeout(goTimer.current);
    };
  }, [open, toggleTheme]);

  return (
    <>
      {/* Vim `g` arming hint — a transient chip that appears when `g` is
          pressed and disappears after 900ms or when the next key fires. */}
      <AnimatePresence>
        {goArmed && (
          <motion.div
            key="vim-hint"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="vim-hint"
            role="status"
            aria-live="polite"
          >
            <kbd className="kbd">g</kbd>
            <span>then</span>
            <span className="text-muted-foreground">r·s·e·p·j·n·c</span>
            <span className="vim-hint-bar" aria-hidden />
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md gap-0 border-border/80 bg-card/95 p-0 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="expertise-icon" aria-hidden>
              <Keyboard className="h-3.5 w-3.5" />
            </span>
            <DialogTitle className="font-display text-base font-semibold tracking-tight">
              Keyboard shortcuts
            </DialogTitle>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close shortcuts"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <DialogDescription className="sr-only">
          List of keyboard shortcuts available on this site.
        </DialogDescription>
        <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
          {KEYBOARD_SHORTCUTS.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/60"
            >
              <div className="min-w-0">
                <p className="font-display text-sm font-medium tracking-tight">
                  {s.label}
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {s.hint}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {s.combo.map((c, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <span className="text-[10px] text-muted-foreground/60">
                        then
                      </span>
                    )}
                    <kbd className="kbd">{c}</kbd>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border/60 px-5 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Shortcuts pause while typing in form fields
          </p>
        </div>
      </DialogContent>
      </Dialog>
    </>
  );
}
