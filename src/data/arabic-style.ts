/**
 * Arabic typography settings — the source of truth for the three rendering
 * "modes" (Mushaf Quran, Standar Amiri, Naskhi Tebal/Pemula) and the user-
 * adjustable numeric settings (size, line-height, spacing, alignment).
 *
 * The CSS classes referenced here are defined in `src/app/globals.css`:
 *   .font-arabic-quran  → Amiri Quran (joined, mushaf-style)
 *   .font-arabic         → Amiri (joined, standard)
 *   .font-arabic-naskhi  → Scheherazade New (disjoined, beginner-friendly)
 */

export type ArabicStyleMode = "standard" | "quran" | "naskhi";

export type ArabicStyleAlign = "right" | "justify";

export type ArabicStyleSettings = {
  mode: ArabicStyleMode;
  /** Font size in rem. Range 1.2–3.5. */
  fontSize: number;
  /** Line height (unitless). Range 1.4–3.5. */
  lineHeight: number;
  /** Word spacing in em. Range 0–0.6. */
  wordSpacing: number;
  /** Letter spacing in em. Range 0–0.2. */
  letterSpacing: number;
  align: ArabicStyleAlign;
};

export const ARABIC_FONT_SIZE_MIN = 1.2;
export const ARABIC_FONT_SIZE_MAX = 3.5;
export const ARABIC_LINE_HEIGHT_MIN = 1.4;
export const ARABIC_LINE_HEIGHT_MAX = 3.5;
export const ARABIC_WORD_SPACING_MIN = 0;
export const ARABIC_WORD_SPACING_MAX = 0.6;
export const ARABIC_LETTER_SPACING_MIN = 0;
export const ARABIC_LETTER_SPACING_MAX = 0.2;

export const defaultArabicSettings: ArabicStyleSettings = {
  mode: "quran",
  fontSize: 2.0,
  lineHeight: 2.4,
  wordSpacing: 0.05,
  letterSpacing: 0,
  align: "justify",
};

export type ArabicStyleModeConfig = {
  label: string;
  description: string;
  /** CSS font-family value applied inline by <ArabicText/>. */
  fontFamily: string;
  /** CSS class that carries the font-family fallback + OpenType features. */
  cssClass: string;
  /**
   * Optional recommended settings to apply when this mode is selected
   * (e.g. Naskhi benefits from larger line-height + word spacing).
   */
  suggested?: Partial<ArabicStyleSettings>;
};

export const arabicStyleModes: Record<ArabicStyleMode, ArabicStyleModeConfig> = {
  quran: {
    label: "Mushaf Quran",
    description:
      "Font Amiri Quran bergaya mushaf dengan ligatur & harakat penuh — sesuai untuk tilawah Al-Qur’an.",
    fontFamily: "var(--font-arabic-quran)",
    cssClass: "font-arabic-quran",
  },
  standard: {
    label: "Standar Amiri",
    description:
      "Font Amiri standar, nyaman dibaca untuk zikir & doa harian dengan ligatur natural.",
    fontFamily: "var(--font-arabic)",
    cssClass: "font-arabic",
  },
  naskhi: {
    label: "Naskhi Tebal (Pemula)",
    description:
      "Scheherazade New dengan huruf terpisah (un-joined) — memudahkan pemula mengenali huruf demi huruf. Harakat tetap menempel sempurna.",
    fontFamily: "var(--font-arabic-naskh)",
    cssClass: "font-arabic-naskhi",
    suggested: {
      fontSize: 1.6,
      lineHeight: 2.6,
      wordSpacing: 0.18,
      letterSpacing: 0,
      align: "right",
    },
  },
};

export const arabicStyleModeOrder: ArabicStyleMode[] = ["quran", "standard", "naskhi"];
