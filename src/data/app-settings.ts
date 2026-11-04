/**
 * App-behaviour settings (distinct from the text-layer `DisplayToggles`).
 *
 * `keepScreenOn` prevents the device screen from sleeping while the app is in
 * the foreground — useful during a tahlil majelis so the reader isn't
 * interrupted by the screen locking mid-recitation. Implemented via the web
 * Screen Wake Lock API (`navigator.wakeLock`), the web-platform equivalent of
 * Android's `FLAG_KEEP_SCREEN_ON`.
 */
export const KEEP_SCREEN_ON_COOKIE = "tahlil-keep-screen-on-v1";

export const defaultKeepScreenOn = false;

/** Parse a stored cookie value ("1"/"0" or "true"/"false") into a boolean. */
export function parseKeepScreenOn(raw: string | null): boolean {
  if (!raw) return defaultKeepScreenOn;
  return raw === "1" || raw.toLowerCase() === "true";
}
