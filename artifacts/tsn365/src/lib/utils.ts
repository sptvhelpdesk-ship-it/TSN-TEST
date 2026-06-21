import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function safeParseDate(dateStr: string | undefined | null): Date {
  if (!dateStr) return new Date();
  let d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  const formatted = dateStr.replace(/\s+/g, "T");
  d = new Date(formatted);
  if (!isNaN(d.getTime())) return d;
  return new Date();
}

export function safeUrl(url: string | undefined | null): string {
  if (!url) return "";
  let secureUrl = url;
  if (secureUrl.startsWith("http://")) secureUrl = secureUrl.replace("http://", "https://");
  if (secureUrl.includes("api.sofascore.com")) secureUrl = secureUrl.replace("api.sofascore.com", "img.sofascore.com");
  return secureUrl;
}

export function getTeamName(team: unknown): string {
  if (!team) return "";
  if (typeof team === "object" && team !== null) {
    const t = team as Record<string, unknown>;
    return String(t.name || t.title || "");
  }
  return String(team);
}

export function getTeamFlag(flag: unknown): string {
  if (!flag) return "";
  if (typeof flag === "object" && flag !== null) {
    const f = flag as Record<string, unknown>;
    return String(f.logo || f.flag || f.url || "");
  }
  return String(flag);
}

export function encodeBase64Stream(rawString: string): string {
  try { return btoa(unescape(encodeURIComponent(rawString))); } catch { return rawString; }
}

export function decodeBase64Stream(base64String: string): string {
  try { return decodeURIComponent(escape(atob(base64String))); } catch { return base64String; }
}
