import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Reset the DOM between tests so component state never leaks across cases.
afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
  // Clear cookies so cookie-based providers start from a clean slate each test.
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
});

// jsdom doesn't implement matchMedia; framer-motion & next-themes query it.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}

// jsdom doesn't implement scrollTo / scrollIntoView — no-op them so
// BackToTop / smooth-scroll tests don't throw.
if (typeof window !== "undefined") {
  window.scrollTo = () => {};
}
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// jsdom has no IntersectionObserver / ResizeObserver — framer-motion's
// `whileInView` feature needs them. Provide inert stubs so components that
// use viewport-triggered animation render without crashing (the animation
// itself simply never fires, which is fine for unit assertions).
class IOStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
if (typeof global !== "undefined" && !global.IntersectionObserver) {
  global.IntersectionObserver = IOStub as unknown as typeof IntersectionObserver;
}
if (typeof window !== "undefined" && !window.IntersectionObserver) {
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IOStub;
}
if (typeof global !== "undefined" && !global.ResizeObserver) {
  global.ResizeObserver = IOStub as unknown as typeof ResizeObserver;
}
if (typeof window !== "undefined" && !window.ResizeObserver) {
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = IOStub;
}
