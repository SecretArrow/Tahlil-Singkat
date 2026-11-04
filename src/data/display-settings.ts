/**
 * Display toggles — let the reader show/hide each of the three text layers
 * (Arabic, transliteration, Indonesian translation) independently inside a
 * SectionCard. Persisted via cookie + /api/settings (see providers).
 */
export type DisplayToggles = {
  arabic: boolean;
  transliteration: boolean;
  translation: boolean;
};

export const defaultDisplayToggles: DisplayToggles = {
  arabic: true,
  transliteration: true,
  translation: true,
};

export const displayToggleLabels: Record<keyof DisplayToggles, string> = {
  arabic: "Teks Arab",
  transliteration: "Transliterasi",
  translation: "Terjemahan",
};
