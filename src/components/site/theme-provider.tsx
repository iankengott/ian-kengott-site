"use client";

import * as React from "react";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  /** The user's chosen mode (may be "system"). */
  mode: ThemeMode;
  /** The actually-applied theme after resolving system preference. */
  theme: ResolvedTheme;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
  setTheme: (t: ResolvedTheme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  mode: "system",
  theme: "dark",
  toggle: () => {},
  setMode: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return React.useContext(ThemeContext);
}

function resolveSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<ThemeMode>("system");
  const [theme, setThemeState] = React.useState<ResolvedTheme>("dark");

  // Initial sync: read the mode from localStorage, fall back to system.
  React.useEffect(() => {
    let initialMode: ThemeMode = "system";
    try {
      const stored = localStorage.getItem("theme-mode") as ThemeMode | null;
      if (stored === "light" || stored === "dark" || stored === "system") {
        initialMode = stored;
      }
    } catch {}
    setModeState(initialMode);

    // Resolve the actual theme to apply.
    // The no-flash inline script in <head> already applied `dark` class
    // if needed; reconcile it with the chosen mode.
    const isDark = document.documentElement.classList.contains("dark");
    if (initialMode === "system") {
      const resolved = resolveSystemTheme();
      setThemeState(resolved);
      if (resolved === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } else {
      setThemeState(isDark ? "dark" : "light");
    }
  }, []);

  // Listen for system theme changes when in "system" mode.
  React.useEffect(() => {
    if (mode !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const resolved: ResolvedTheme = e.matches ? "dark" : "light";
      setThemeState(resolved);
      if (resolved === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [mode]);

  const apply = React.useCallback((m: ThemeMode) => {
    const root = document.documentElement;
    let resolved: ResolvedTheme;
    if (m === "system") {
      resolved = resolveSystemTheme();
    } else {
      resolved = m;
    }
    if (resolved === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("theme-mode", m);
      // Clear legacy key so we don't have stale state
      localStorage.removeItem("theme");
    } catch {}
    setModeState(m);
    setThemeState(resolved);
  }, []);

  const setMode = React.useCallback((m: ThemeMode) => apply(m), [apply]);
  const setTheme = React.useCallback((t: ResolvedTheme) => apply(t), [apply]);
  const toggle = React.useCallback(() => {
    // Cycle: dark → light → system → dark
    apply(mode === "dark" ? "light" : mode === "light" ? "system" : "dark");
  }, [mode, apply]);

  return (
    <ThemeContext.Provider value={{ mode, theme, toggle, setMode, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
