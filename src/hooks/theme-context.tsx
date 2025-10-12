import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("horizon-theme") as Theme | null;
    if (saved) return saved;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("horizon-theme", theme);

    const mm = window.matchMedia("(prefers-color-scheme: dark)");
    const onPrefChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("horizon-theme");
      if (!saved) setTheme(e.matches ? "dark" : "light");
    };
    mm.addEventListener?.("change", onPrefChange);
    return () => mm.removeEventListener?.("change", onPrefChange);
  }, [theme]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "horizon-theme" && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue as Theme);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = () => setTheme((p) => (p === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
