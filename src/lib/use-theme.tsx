import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouteContext } from "@tanstack/react-router";
import { writeThemeCookie } from "./theme-cookie";

type ThemeContextValue = {
  dark: boolean;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { dark: initialDark } = useRouteContext();

  const [dark, setDark] = useState(initialDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      writeThemeCookie(next ? "dark" : "light");
      try {
        localStorage.setItem("paw-m:theme", next ? "dark" : "light");
      } catch { /* storage unavailable */ }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}