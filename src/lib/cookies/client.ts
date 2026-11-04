/**
 * Client-side cookie helpers.
 *
 * These read/write `document.cookie` directly — no server round-trip — so
 * the UI updates instantly when the user changes Arabic typography or display
 * toggles. A fire-and-forget POST to /api/settings is also sent (in the
 * providers) so the server-rendered HTML matches on the next load of the
 * hosted web app. In the static-export / Capacitor build the /api route is
 * not present and that POST silently no-ops via `.catch(() => {})`.
 */

export const COOKIE_KEYS = {
  arabicStyle: "tahlil-arabic-style-v1",
  displayToggles: "tahlil-display-toggles-v1",
} as const;

/** Escape regex meta-characters in a cookie name for safe matching. */
function escapeName(name: string): string {
  return name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&");
}

/** Read a cookie value by name. Returns null if missing or on the server. */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + escapeName(name) + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/** Write a cookie value with a 1-year max-age, sameSite=lax, path=/. */
export function setCookie(name: string, value: string, maxAgeDays = 365): void {
  if (typeof document === "undefined") return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie =
    `${name}=${encodeURIComponent(value)}` +
    `; path=/; max-age=${maxAge}; samesite=lax`;
}
