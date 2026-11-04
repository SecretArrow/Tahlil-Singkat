import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SectionCard } from "@/components/tahlil/section-card";
import { ArabicStyleProvider } from "@/components/arabic-style-provider";
import { DisplaySettingsProvider, useDisplaySettings } from "@/components/display-settings-provider";
import type { TahlilSection } from "@/data/tahlil-content";

const sample: TahlilSection = {
  id: "al-ikhlas",
  number: 4,
  title: "Surah Al-Ikhlāṣ",
  description: "Pernyataan tauhid yang ringkas.",
  arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝١",
  transliteration: "Qul huwallāhu aḥad",
  translation: "Katakanlah: Dialah Allah, Yang Maha Esa.",
  repeat: 3,
  source: "QS. Al-Ikhlāṣ: 1–4",
};

/** A tiny control to flip display toggles from inside the tree. */
function ToggleControl({ off }: { off: "arabic" | "transliteration" | "translation" }) {
  const { setToggle } = useDisplaySettings();
  return <button onClick={() => setToggle(off, false)}>turn-off-{off}</button>;
}

// Mirror the production provider nesting (ArabicStyle outer, Display inner)
// so every context the SectionCard reads from is present.
function tree(node: React.ReactNode) {
  return (
    <ArabicStyleProvider>
      <DisplaySettingsProvider>{node}</DisplaySettingsProvider>
    </ArabicStyleProvider>
  );
}

describe("SectionCard", () => {
  it("renders all three layers + repeat badge + source by default", () => {
    render(tree(<SectionCard section={sample} />));
    expect(screen.getByText("Surah Al-Ikhlāṣ")).toBeInTheDocument();
    expect(screen.getByText(/Qul huwallāhu aḥad/)).toBeInTheDocument(); // transliteration
    expect(screen.getByText(/Katakanlah: Dialah Allah/)).toBeInTheDocument(); // translation
    expect(screen.getByText("3×")).toBeInTheDocument(); // repeat badge
    expect(screen.getByText(/QS\. Al-Ikhlāṣ: 1–4/)).toBeInTheDocument(); // source
    // Arabic verse present (contains the ayah mark ornament).
    expect(document.querySelector(".ayah-mark")).not.toBeNull();
  });

  it("hides the translation layer when that toggle is off", () => {
    render(
      tree(
        <>
          <ToggleControl off="translation" />
          <SectionCard section={sample} />
        </>
      )
    );
    expect(screen.getByText(/Katakanlah: Dialah Allah/)).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByText("turn-off-translation"));
    });
    expect(screen.queryByText(/Katakanlah: Dialah Allah/)).not.toBeInTheDocument();
    // Arabic + transliteration remain.
    expect(screen.getByText(/Qul huwallāhu aḥad/)).toBeInTheDocument();
    expect(document.querySelector(".ayah-mark")).not.toBeNull();
  });

  it("hides the arabic layer when that toggle is off", () => {
    render(
      tree(
        <>
          <ToggleControl off="arabic" />
          <SectionCard section={sample} />
        </>
      )
    );
    expect(document.querySelector(".ayah-mark")).not.toBeNull();
    act(() => {
      fireEvent.click(screen.getByText("turn-off-arabic"));
    });
    expect(document.querySelector(".ayah-mark")).toBeNull();
    // Translation still visible.
    expect(screen.getByText(/Katakanlah: Dialah Allah/)).toBeInTheDocument();
  });

  it("shows a hint instead of an empty body when every layer is hidden", () => {
    render(
      tree(
        <>
          <ToggleControl off="arabic" />
          <ToggleControl off="transliteration" />
          <ToggleControl off="translation" />
          <SectionCard section={sample} />
        </>
      )
    );
    act(() => {
      fireEvent.click(screen.getByText("turn-off-arabic"));
    });
    act(() => {
      fireEvent.click(screen.getByText("turn-off-transliteration"));
    });
    act(() => {
      fireEvent.click(screen.getByText("turn-off-translation"));
    });
    expect(
      screen.getByText(/Semua lapisan disembunyikan/i)
    ).toBeInTheDocument();
  });
});
