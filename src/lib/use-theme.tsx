import { useEffect, useState, type ReactNode } from "react";
import { writeThemeCookie } from "./theme-cookie";
import { ThemeContext } from "./use-theme-hook";

export function ThemeProvider({
  children,
  initialDark = false,
}: {
  children: ReactNode;
  initialDark?: boolean;
}) {
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
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  };

  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}
