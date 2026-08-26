import { useEffect, useState } from "react";
import { writeThemeCookie } from "./theme-cookie";

export function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

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

  return { dark, toggle };
}
