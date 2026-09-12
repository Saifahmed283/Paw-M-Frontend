export const SITE_URL = import.meta.env["VITE_SITE_URL"] || "https://pawmclinnic.com";

export function withSiteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path}`;
}

export function ogMeta(title: string, description: string, path: string) {
  const url = withSiteUrl(path);
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:image", content: `${SITE_URL}/og-image.png` },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
  ];
}
