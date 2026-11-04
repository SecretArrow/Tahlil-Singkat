"use client";

import * as React from "react";
import { useArabicStyle } from "@/components/arabic-style-provider";
import { arabicStyleModes } from "@/data/arabic-style";

/**
 * ArabicText — renders an Arabic string with the user's chosen style settings
 * (font family, font size, line-height, word spacing, letter spacing,
 * alignment) applied consistently. RTL is enforced via dir="rtl".
 * The text content is never modified — only typography/visual presentation.
 *
 * `forceMode` can be used to render with a specific mode (used for the
 * side-by-side comparison view).
 *
 * Ayah marks (۝ followed by Arabic-Indic digits) are detected and rendered
 * as a styled span with the digit overlaid in the center of the ornamental
 * ۝ symbol — mimicking proper Mushaf typography.
 *
 * Each ayat (mark + following text) is wrapped in a `.ayah-line` span so
 * that on mobile (CSS `max-width: 640px`) each verse breaks to a new line
 * for readability; on desktop verses flow inline (Mushaf style).
 */

// Matches ۝ (U+06DD ARABIC END OF AYAH) followed by one or more Arabic-Indic
// digits (٠-٩). Capturing group lets String.split() include the marks.
const AYAH_MARK_REGEX = /(۝[٠-٩]+)/g;

/** Render a single ayah mark (۝X) as an ornamental circle with digit. */
function AyahMark({ digit }: { digit: string }) {
  return (
    <span className="ayah-mark" dir="rtl" aria-label={`Ayah ${digit}`}>
      <span className="ayah-mark-ornament" aria-hidden="true">
        ۝
      </span>
      <span className="ayah-mark-digit">{digit}</span>
    </span>
  );
}

/** Inline style for each line — display:block + margin to ensure each
    ayah/clause is on its own line (CSS class sometimes gets overridden
    by Tailwind v4 layer system, so inline style is more reliable). */
const LINE_STYLE: React.CSSProperties = {
  display: "block",
  marginBottom: "0.25em",
};

/**
 * Parse an Arabic string and return an array of React nodes where:
 *  - each ayah (text + ۝X mark) is wrapped together in an `.ayah-line` span,
 *    with the ayah number mark placed at the END of the verse text —
 *    matching standard Mushaf convention (number marks the end of the verse)
 *  - each `.ayah-line` is `display: block` on ALL viewports so every verse
 *    gets its own line — easier to read & memorise.
 *
 * For Arabic text WITHOUT ayah marks (e.g., long dua text), split by Arabic
 * comma (،) and Latin period (.) so each clause also gets its own line.
 */
function renderArabicWithAyahMarks(
  text: string,
  keyPrefix: string
): React.ReactNode[] {
  const matches = Array.from(text.matchAll(AYAH_MARK_REGEX));
  if (matches.length === 0) {
    // No ayah marks — this is likely a long dua text.
    // Split by Arabic comma (،) or Latin period (.) to break into lines.
    return splitBySentence(text, keyPrefix);
  }

  const nodes: React.ReactNode[] = [];
  let lineKey = 0;
  let cursor = 0;

  matches.forEach((m, i) => {
    const full = m[0]; // e.g., ۝١
    const digit = full.slice(1); // e.g., ١
    const markStart = m.index ?? 0;

    // Text BEFORE this mark (the verse that this mark ends)
    const textBefore = text.substring(cursor, markStart);

    // Wrap verse text + mark together — mark at the END of the verse
    nodes.push(
      <span key={`${keyPrefix}-${lineKey++}`} className="ayah-line" style={LINE_STYLE}>
        {textBefore}
        <AyahMark digit={digit} />
      </span>
    );

    cursor = markStart + full.length;
  });

  // After the last mark, there may be trailing text (e.g., final verse text
  // without a closing mark, or whitespace) — render it as a trailing line.
  if (cursor < text.length) {
    const trailing = text.substring(cursor);
    // Also split trailing by sentence for dua-style text
    nodes.push(...splitBySentence(trailing, `${keyPrefix}-trail`));
  }

  return nodes;
}

/**
 * Split a string by Arabic comma (،) and Latin period (.) into lines.
 * Each line is wrapped in an `.ayah-line` span (display: block).
 * The delimiter is preserved at the END of each line (per user request:
 * "berikan tanda di akhir kalimatnya").
 */
function splitBySentence(
  text: string,
  keyPrefix: string
): React.ReactNode[] {
  // Trim leading/trailing whitespace
  const trimmed = text.trim();
  if (!trimmed) return [<React.Fragment key={`${keyPrefix}-0`} />];

  // Split by Arabic comma or Latin period, KEEPING the delimiter
  // The regex captures the delimiter so split() includes it in the result
  const parts = trimmed.split(/(،|\.)/);
  const lines: React.ReactNode[] = [];
  let current = "";
  let keyIdx = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    current += part;
    // If this part is a delimiter, finish the current line
    if (part === "،" || part === ".") {
      lines.push(
        <span key={`${keyPrefix}-${keyIdx++}`} className="ayah-line" style={LINE_STYLE}>
          {current}
        </span>
      );
      current = "";
    }
  }
  // Trailing text without delimiter
  if (current.trim()) {
    lines.push(
      <span key={`${keyPrefix}-${keyIdx++}`} className="ayah-line" style={LINE_STYLE}>
        {current}
      </span>
    );
  }

  return lines;
}

type Props = {
  text: string;
  forceMode?: "standard" | "quran" | "naskhi";
  forceSettings?: {
    fontSize: number;
    lineHeight: number;
    wordSpacing: number;
    letterSpacing?: number;
    align: "right" | "justify";
  };
  className?: string;
  lang?: string;
  /** Optional node to render after the text (e.g. repeat counter) */
  suffix?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "children">;

export function ArabicText({
  text,
  forceMode,
  forceSettings,
  className = "",
  lang = "ar",
  suffix,
  ...rest
}: Props) {
  const { settings } = useArabicStyle();

  const mode = forceMode ?? settings.mode;
  const s = forceSettings ?? settings;
  const cfg = arabicStyleModes[mode];

  const style: React.CSSProperties = {
    fontFamily: cfg.fontFamily,
    fontSize: `${s.fontSize}rem`,
    lineHeight: s.lineHeight,
    wordSpacing: `${s.wordSpacing}em`,
    letterSpacing: `${s.letterSpacing ?? 0}em`,
    textAlign: s.align,
    direction: "rtl",
    unicodeBidi: "isolate",
  };

  return (
    <p
      dir="rtl"
      lang={lang}
      className={`arabic-text ${cfg.cssClass} ${className}`}
      style={style}
      {...rest}
    >
      {renderArabicWithAyahMarks(text, "t")}
      {suffix}
    </p>
  );
}
