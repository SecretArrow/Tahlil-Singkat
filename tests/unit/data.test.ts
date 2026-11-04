import { describe, it, expect } from "vitest";
import { tahlilSections, tahlilNav } from "@/data/tahlil-content";
import {
  defaultArabicSettings,
  arabicStyleModes,
  arabicStyleModeOrder,
  ARABIC_FONT_SIZE_MIN,
  ARABIC_FONT_SIZE_MAX,
} from "@/data/arabic-style";
import {
  defaultDisplayToggles,
  displayToggleLabels,
} from "@/data/display-settings";

describe("tahlil-content", () => {
  it("renders the full short-tahlil sequence", () => {
    // 10 sections: Al-Fatihah → Tahlil → Shalawat → 3 Qul surahs →
    // Ayat Kursi → Tasbih → Doa arwah → Doa penutup.
    expect(tahlilSections).toHaveLength(10);
  });

  it("has stable, unique ids used as anchors", () => {
    const ids = tahlilSections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
  });

  it("numbers sections 1..N sequentially", () => {
    tahlilSections.forEach((s, i) => {
      expect(s.number).toBe(i + 1);
    });
  });

  it("every section has non-empty arabic + translation + source", () => {
    tahlilSections.forEach((s) => {
      expect(s.arabic.trim().length).toBeGreaterThan(0);
      expect(s.translation.trim().length).toBeGreaterThan(0);
      expect(s.source.trim().length).toBeGreaterThan(0);
    });
  });

  it("includes the ۝ ayah-end mark in Quranic sections", () => {
    const fatihah = tahlilSections.find((s) => s.id === "al-fatihah")!;
    expect(fatihah.arabic).toContain("۝");
    // Al-Fatihah has 7 ayat → 7 ayah marks.
    const marks = fatihah.arabic.match(/۝/g);
    expect(marks).toHaveLength(7);
  });

  it("marks repeated recitations with a repeat count > 1", () => {
    const tahlil = tahlilSections.find((s) => s.id === "tahlil")!;
    expect(tahlil.repeat).toBe(100);
    const ikhlas = tahlilSections.find((s) => s.id === "al-ikhlas")!;
    expect(ikhlas.repeat).toBe(3);
    // Sections without an explicit repeat default to undefined (read once).
    const fatihah = tahlilSections.find((s) => s.id === "al-fatihah")!;
    expect(fatihah.repeat).toBeUndefined();
  });

  it("tahlilNav mirrors the section list for quick navigation", () => {
    expect(tahlilNav).toHaveLength(tahlilSections.length);
    expect(tahlilNav[0]).toEqual({ id: "al-fatihah", number: 1, title: "Al-Fātihah" });
  });
});

describe("arabic-style data", () => {
  it("exposes the three rendering modes in a stable order", () => {
    expect(arabicStyleModeOrder).toEqual(["quran", "standard", "naskhi"]);
    arabicStyleModeOrder.forEach((m) => {
      const cfg = arabicStyleModes[m];
      expect(cfg.label.length).toBeGreaterThan(0);
      expect(cfg.description.length).toBeGreaterThan(0);
      expect(cfg.fontFamily.length).toBeGreaterThan(0);
      expect(cfg.cssClass.length).toBeGreaterThan(0);
    });
  });

  it("defaults to quran mode with sane typography", () => {
    expect(defaultArabicSettings.mode).toBe("quran");
    expect(defaultArabicSettings.fontSize).toBeGreaterThanOrEqual(ARABIC_FONT_SIZE_MIN);
    expect(defaultArabicSettings.fontSize).toBeLessThanOrEqual(ARABIC_FONT_SIZE_MAX);
    expect(defaultArabicSettings.align === "right" || defaultArabicSettings.align === "justify").toBe(true);
  });

  it("suggests larger spacing for the beginner naskhi mode", () => {
    const suggested = arabicStyleModes.naskhi.suggested;
    expect(suggested).toBeDefined();
    expect(suggested!.lineHeight).toBeGreaterThan(defaultArabicSettings.lineHeight);
  });
});

describe("display-settings data", () => {
  it("defaults to showing every text layer", () => {
    expect(defaultDisplayToggles).toEqual({
      arabic: true,
      transliteration: true,
      translation: true,
    });
  });

  it("labels every toggle key", () => {
    (Object.keys(defaultDisplayToggles) as (keyof typeof defaultDisplayToggles)[]).forEach(
      (k) => {
        expect(displayToggleLabels[k].length).toBeGreaterThan(0);
      }
    );
  });
});
