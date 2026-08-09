/** Strip anything that is not a valid dialable phone character. */
export function sanitizePhone(raw: string): string {
  return raw.replace(/[^\d+()\-\s]/g, "").trim();
}

/** Strip everything except digits (used for wa.me links). */
export function sanitizeWhatsapp(raw: string): string {
  return raw.replace(/\D/g, "");
}

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

/** Normalize + validate an email address; returns `null` when invalid. */
export function sanitizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  return EMAIL_RE.test(email) ? email : null;
}

/**
 * Build a safe `tel:` href. Returns null when the input contains no dialable
 * characters, guarding against `javascript:` or control-char injection.
 */
export function telHref(phone: string): string | null {
  const digits = sanitizePhone(phone);
  if (!digits) return null;
  return `tel:${digits}`;
}

/** Build a safe `mailto:` href, or null when the email is invalid. */
export function mailtoHref(email: string): string | null {
  const clean = sanitizeEmail(email);
  return clean ? `mailto:${clean}` : null;
}

/** Build a safe `https://wa.me/` href, or null when no digits exist. */
export function waMeHref(whatsapp: string): string | null {
  const digits = sanitizeWhatsapp(whatsapp);
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}
