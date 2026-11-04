import { describe, it, expect } from "vitest";
import { COOKIE_KEYS, getCookie, setCookie } from "@/lib/cookies/client";

describe("cookie client helpers", () => {
  it("returns null for a missing cookie", () => {
    expect(getCookie("does-not-exist")).toBeNull();
  });

  it("round-trips a value through set/get", () => {
    setCookie(COOKIE_KEYS.arabicStyle, JSON.stringify({ mode: "naskhi" }));
    expect(getCookie(COOKIE_KEYS.arabicStyle)).toBe(JSON.stringify({ mode: "naskhi" }));
  });

  it("URL-encodes values with special characters", () => {
    setCookie(COOKIE_KEYS.displayToggles, '{"arabic":true,"a;b":false}');
    const raw = getCookie(COOKIE_KEYS.displayToggles);
    expect(raw).toBe('{"arabic":true,"a;b":false}');
  });

  it("handles values containing '=' safely", () => {
    setCookie("test-eq", "a=b=c");
    expect(getCookie("test-eq")).toBe("a=b=c");
  });
});
