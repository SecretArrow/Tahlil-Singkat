import { COOKIE_KEYS } from "./client";

/**
 * Server-side cookie readers used by `app/layout.tsx` to seed the
 * ArabicStyleProvider and DisplaySettingsProvider with the user's saved
 * preferences so the first SSR render matches the client (no flash).
 *
 * IMPORTANT — static export (`output: "export"` in next.config.js):
 * `next/headers` `cookies()` is a per-request dynamic API and throws when a
 * route is prerendered to static HTML. The Capacitor / APK build is a static
 * export, so these functions return `null` and the providers fall back to
 * `defaultArabicSettings` / `defaultDisplayToggles` for the initial render.
 * Persistence still works: the client providers read `document.cookie` at
 * hydration (see `*-provider.tsx`) and write it on every change, so a
 * returning user's preferences are applied immediately after mount.
 *
 * If the project is ever switched to a server runtime (`output: "standup"`
 * or `next start`), replace these bodies with:
 *   const store = await cookies();
 *   return store.get(COOKIE_KEYS.arabicStyle)?.value ?? null;
 */
export async function getArabicStyleCookie(): Promise<string | null> {
  return null;
}

export async function getDisplayTogglesCookie(): Promise<string | null> {
  return null;
}

export { COOKIE_KEYS };
