import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export const THEME_COOKIE = "paw-m-theme";

type Theme = "light" | "dark";

function parseTheme(value: string | undefined): Theme {
  return value === "dark" ? "dark" : "light";
}

function readClientCookie(): Theme {
  try {
    const match = document.cookie.split("; ").find((e) => e.startsWith(`${THEME_COOKIE}=`));
    return match ? parseTheme(decodeURIComponent(match.slice(THEME_COOKIE.length + 1))) : "light";
  } catch {
    return "light";
  }
}

export const readThemeCookie = createIsomorphicFn()
  .server(() => parseTheme(getCookie(THEME_COOKIE)))
  .client(readClientCookie);

export function writeThemeCookie(theme: Theme, days = 365) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${THEME_COOKIE}=${encodeURIComponent(theme)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
