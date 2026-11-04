import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ArabicText } from "@/components/arabic-text";
import { ArabicStyleProvider } from "@/components/arabic-style-provider";

// Wrap with the provider so useArabicStyle() resolves.
function withProvider(node: React.ReactNode) {
  return <ArabicStyleProvider>{node}</ArabicStyleProvider>;
}

// ArabicText renders its text inside nested .ayah-line spans, so querying by
// text returns a span (which has no dir/lang attrs). Grab the <p> directly.
function arabicP(container: HTMLElement) {
  return container.querySelector("p.arabic-text") as HTMLParagraphElement;
}

describe("ArabicText", () => {
  it("renders the arabic string with RTL direction", () => {
    const { container } = render(withProvider(<ArabicText text="بِسْمِ اللَّهِ" />));
    const p = arabicP(container);
    expect(p).not.toBeNull();
    expect(p.getAttribute("dir")).toBe("rtl");
    expect(p.getAttribute("lang")).toBe("ar");
    expect(p.textContent).toContain("بِسْمِ");
  });

  it("splits Quranic text into one ayah-line per ayah mark", () => {
    // Two ayah marks → two .ayah-line spans wrapping each verse.
    render(
      withProvider(<ArabicText text="الْحَمْدُ لِلَّهِ ۝١ الرَّحْمَٰنِ ۝٢" />)
    );
    const lines = document.querySelectorAll(".ayah-line");
    expect(lines.length).toBe(2);
  });

  it("splits long dua text (no ayah marks) by sentence", () => {
    render(
      withProvider(
        <ArabicText text="سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَاللَّهُ أَكْبَرُ" />
      )
    );
    // Three clauses delimited by Arabic comma → three lines.
    const lines = document.querySelectorAll(".ayah-line");
    expect(lines.length).toBe(3);
  });

  it("renders the ayah-end ornament as a styled mark", () => {
    render(withProvider(<ArabicText text="الْحَمْدُ لِلَّهِ ۝١" />));
    const mark = document.querySelector(".ayah-mark");
    expect(mark).not.toBeNull();
    // The digit (١) must be rendered inside the ornament.
    expect(mark?.textContent).toContain("١");
  });

  it("applies the forced mode's font family over the user default", () => {
    const { container } = render(
      withProvider(<ArabicText text="نَصٌّ" forceMode="naskhi" />)
    );
    const p = arabicP(container);
    expect(p.className).toContain("font-arabic-naskhi");
  });
});
