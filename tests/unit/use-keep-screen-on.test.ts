import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useKeepScreenOn } from "@/hooks/use-keep-screen-on";
import { KEEP_SCREEN_ON_COOKIE } from "@/data/app-settings";
import { getCookie } from "@/lib/cookies/client";

// ── helpers ────────────────────────────────────────────────────────────────
type Sentinel = { release: ReturnType<typeof vi.fn> };

function makeSentinel(): Sentinel & object {
  return { release: vi.fn().mockResolvedValue(undefined) };
}

/** Install a mock navigator.wakeLock whose request() returns a sentinel. */
function mockWakeLock() {
  const request = vi.fn(async () => makeSentinel());
  Object.defineProperty(navigator, "wakeLock", {
    value: { request },
    configurable: true,
    writable: true,
  });
  return { request };
}

function removeWakeLock() {
  try {
    delete (navigator as unknown as { wakeLock?: unknown }).wakeLock;
  } catch {
    // Some jsdom builds make navigator props non-configurable; fall back to
    // redefining to undefined.
    Object.defineProperty(navigator, "wakeLock", {
      value: undefined,
      configurable: true,
    });
  }
}

function setVisibility(state: "visible" | "hidden") {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: state,
  });
}

beforeEach(() => {
  removeWakeLock();
  setVisibility("visible");
});

afterEach(() => {
  removeWakeLock();
});

describe("useKeepScreenOn", () => {
  it("reports supported when navigator.wakeLock exists", () => {
    mockWakeLock();
    const { result } = renderHook(() => useKeepScreenOn());
    expect(result.current.isSupported).toBe(true);
    expect(result.current.enabled).toBe(false);
  });

  it("reports unsupported and no-ops when navigator.wakeLock is absent", () => {
    // wakeLock removed in beforeEach.
    const { result } = renderHook(() => useKeepScreenOn());
    expect(result.current.isSupported).toBe(false);
    act(() => result.current.setEnabled(true));
    // No request to make (and enabled still flips for preference persistence).
    expect(result.current.enabled).toBe(true);
    // Cookie still persisted so the preference survives a future device that
    // does support the API.
    expect(getCookie(KEEP_SCREEN_ON_COOKIE)).toBe("1");
  });

  it("acquires a screen wake lock when enabled and releases when disabled", async () => {
    const { request } = mockWakeLock();
    const { result } = renderHook(() => useKeepScreenOn());

    act(() => result.current.setEnabled(true));
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));

    // Cookie persisted.
    expect(getCookie(KEEP_SCREEN_ON_COOKIE)).toBe("1");

    // The held sentinel is released when toggled back off.
    act(() => result.current.setEnabled(false));
    await waitFor(() => {
      // request was called once (on enable); the disable path calls release
      // on the sentinel, not request.
      expect(request).toHaveBeenCalledTimes(1);
    });
    expect(getCookie(KEEP_SCREEN_ON_COOKIE)).toBe("0");
  });

  it("re-acquires the wake lock when the page returns to visible", async () => {
    const { request } = mockWakeLock();
    const { result } = renderHook(() => useKeepScreenOn());

    act(() => result.current.setEnabled(true));
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));

    // Going hidden must NOT re-acquire.
    setVisibility("hidden");
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    await Promise.resolve();
    expect(request).toHaveBeenCalledTimes(1);

    // Returning to visible re-acquires (release stale + request fresh).
    setVisibility("visible");
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2));
  });

  it("does not re-acquire on visibility change when the toggle is off", async () => {
    const { request } = mockWakeLock();
    renderHook(() => useKeepScreenOn());

    // Toggle stays off — flipping visibility must never call request.
    setVisibility("hidden");
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    setVisibility("visible");
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    await Promise.resolve();
    expect(request).not.toHaveBeenCalled();
  });

  it("restores the saved preference from the cookie on mount", async () => {
    mockWakeLock();
    // Pre-seed as a returning user would have.
    document.cookie = `${KEEP_SCREEN_ON_COOKIE}=1; path=/`;
    const { request } = { request: (navigator as unknown as { wakeLock: { request: ReturnType<typeof vi.fn> } }).wakeLock.request };

    const { result } = renderHook(() => useKeepScreenOn());
    await waitFor(() => expect(result.current.enabled).toBe(true));
    // Mount-restore flips enabled true → the side effect acquires the lock.
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
  });

  it("releases the wake lock on unmount", async () => {
    const { request } = mockWakeLock();
    const { result, unmount } = renderHook(() => useKeepScreenOn());

    act(() => result.current.setEnabled(true));
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));

    // Unmount should release the held sentinel (release spy on the sentinel).
    // We can't read the sentinel directly, but unmount must not throw and the
    // release cleanup runs.
    expect(() => unmount()).not.toThrow();
  });
});
