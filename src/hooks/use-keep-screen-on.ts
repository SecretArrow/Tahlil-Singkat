"use client";

import * as React from "react";
import { getCookie, setCookie } from "@/lib/cookies/client";
import {
  KEEP_SCREEN_ON_COOKIE,
  defaultKeepScreenOn,
  parseKeepScreenOn,
} from "@/data/app-settings";

/**
 * useKeepScreenOn — keeps the device screen awake while the app is in the
 * foreground, using the web Screen Wake Lock API (`navigator.wakeLock`).
 *
 * The Screen Wake Lock API is the web-platform equivalent of Android's
 * `FLAG_KEEP_SCREEN_ON`: while a `"screen"` wake lock is held, the OS will
 * not turn the screen off due to inactivity. The browser/WebView
 * automatically releases the lock when the page becomes hidden (app
 * backgrounded) — so we listen for `visibilitychange` and re-acquire when the
 * page is visible again and the user's preference is on. This matches the
 * Android wakelock best practice of releasing when not needed (to avoid
 * battery drain) and re-acquiring on return to foreground.
 *
 * Supported in Capacitor's Android System WebView (Chromium ≥84) which serves
 * the app over the secure context `https://localhost`. If the API is absent
 * (very old WebView), `isSupported` is false and the hook is a graceful
 * no-op that still persists the user's preference.
 */

// Minimal structural types so we don't depend on a specific TS DOM lib version.
type WakeLockSentinelLike = {
  release: () => Promise<void>;
  released?: boolean;
  addEventListener?: (type: "release", cb: () => void) => void;
};
type WakeLockLike = {
  request: (type: "screen") => Promise<WakeLockSentinelLike>;
};

function getWakeLock(): WakeLockLike | null {
  if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
    return (navigator as unknown as { wakeLock: WakeLockLike }).wakeLock;
  }
  return null;
}

export function useKeepScreenOn() {
  const [enabled, setEnabledState] = React.useState<boolean>(defaultKeepScreenOn);
  const sentinelRef = React.useRef<WakeLockSentinelLike | null>(null);
  // Mirror of `enabled` for use inside the visibility listener without
  // re-subscribing the listener on every toggle.
  const enabledRef = React.useRef(enabled);
  enabledRef.current = enabled;

  const isSupported =
    typeof navigator !== "undefined" && "wakeLock" in navigator;

  // Release any held sentinel, then request a fresh screen wake lock.
  // Acquisition rejects if the page is not visible — we swallow that and let
  // the visibility listener retry.
  const acquire = React.useCallback(async () => {
    const wl = getWakeLock();
    if (!wl) return;
    if (sentinelRef.current) {
      try {
        await sentinelRef.current.release();
      } catch {
        /* ignore — stale sentinel */
      }
      sentinelRef.current = null;
    }
    try {
      sentinelRef.current = await wl.request("screen");
    } catch {
      sentinelRef.current = null;
    }
  }, []);

  const release = React.useCallback(async () => {
    if (sentinelRef.current) {
      try {
        await sentinelRef.current.release();
      } catch {
        /* ignore */
      }
      sentinelRef.current = null;
    }
  }, []);

  // Restore the saved preference on mount (cookie-based, same pattern as the
  // typography/display providers — works under static export).
  React.useEffect(() => {
    setEnabledState(parseKeepScreenOn(getCookie(KEEP_SCREEN_ON_COOKIE)));
  }, []);

  // Apply the wake lock side effect whenever the toggle changes.
  React.useEffect(() => {
    if (enabled) {
      void acquire();
    } else {
      void release();
    }
  }, [enabled, acquire, release]);

  // Re-acquire when the page returns to visible (the lock auto-releases on
  // hide). Avoids leaving the screen unguarded after the app is backgrounded
  // and resumed.
  React.useEffect(() => {
    const onVisibility = () => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "visible" &&
        enabledRef.current
      ) {
        void acquire();
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", onVisibility);
      return () => document.removeEventListener("visibilitychange", onVisibility);
    }
  }, [acquire]);

  // Release on unmount so a held lock never outlives the component.
  React.useEffect(() => {
    return () => {
      void release();
    };
  }, [release]);

  const setEnabled = React.useCallback((next: boolean) => {
    setEnabledState(next);
    setCookie(KEEP_SCREEN_ON_COOKIE, next ? "1" : "0");
  }, []);

  return { enabled, setEnabled, isSupported } as const;
}
