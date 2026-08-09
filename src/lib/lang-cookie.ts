import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import type { Lang } from "./i18n";

export const LANG_COOKIE = "pawcare_lang";

function parseLang(value: string | undefined): Lang {
  return value === "ar" ? "ar" : "en";
}

function readClientCookie(): Lang {
  try {
    const match = document.cookie.split("; ").find((entry) => entry.startsWith(`${LANG_COOKIE}=`));
    return match ? parseLang(decodeURIComponent(match.slice(LANG_COOKIE.length + 1))) : "en";
  } catch {
    return "en";
  }
}

export const readLangCookie = createIsomorphicFn()
  .server(() => parseLang(getCookie(LANG_COOKIE)))
  .client(readClientCookie);

export function writeLangCookie(lang: Lang, days = 365) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${LANG_COOKIE}=${encodeURIComponent(lang)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
