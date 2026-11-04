import { describe, it, expect } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { BackToTop } from "@/components/tahlil/back-to-top";

/** Simulate the page being scrolled past one viewport height. */
function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, writable: true, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: 800, writable: true, configurable: true });
  window.dispatchEvent(new Event("scroll"));
}

describe("BackToTop", () => {
  it("is hidden until the reader scrolls past ~one viewport", () => {
    render(<BackToTop />);
    expect(screen.queryByLabelText("Kembali ke atas")).not.toBeInTheDocument();

    act(() => scrollTo(800)); // threshold is 0.8 * 800 = 640
    expect(screen.getByLabelText("Kembali ke atas")).toBeInTheDocument();
  });

  it("is hidden again when scrolled back near the top", async () => {
    render(<BackToTop />);
    act(() => scrollTo(1200));
    expect(screen.getByLabelText("Kembali ke atas")).toBeInTheDocument();
    act(() => scrollTo(10));
    // framer-motion's AnimatePresence removes the button after its exit
    // animation completes; wait for that to settle.
    await waitFor(() => {
      expect(screen.queryByLabelText("Kembali ke atas")).not.toBeInTheDocument();
    });
  });
});
