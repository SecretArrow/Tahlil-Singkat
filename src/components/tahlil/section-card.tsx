"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Repeat, Quote } from "lucide-react";
import { ArabicText } from "@/components/arabic-text";
import { useDisplaySettings } from "@/components/display-settings-provider";
import type { TahlilSection } from "@/data/tahlil-content";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  section: TahlilSection;
};

/**
 * One recitation in the tahlil sequence. Renders the Arabic original (via
 * <ArabicText/>, which applies the user's chosen typography mode & sizing),
 * the Latin transliteration, and the Indonesian translation. Each of the
 * three layers can be shown or hidden independently through the Display
 * settings panel (Arabic / Transliteration / Translation toggles).
 *
 * The repeat count (when > 1) is shown as a badge so the reader knows how
 * many times to recite. The citation is shown as a footer line so the source
 * of every recitation is transparent.
 */
export function SectionCard({ section }: SectionCardProps) {
  const { toggles } = useDisplaySettings();

  const showArabic = toggles.arabic && section.arabic;
  const showTransliteration = toggles.transliteration && section.transliteration;
  const showTranslation = toggles.translation && section.translation;

  // If all three layers are hidden, show a gentle hint instead of an empty card.
  const allHidden = !showArabic && !showTransliteration && !showTranslation;

  return (
    <motion.article
      id={section.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="scroll-mt-20 overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur"
    >
      {/* Header row */}
      <header className="flex items-start gap-3 border-b border-border/60 bg-gradient-to-r from-emerald-50/50 to-transparent px-5 py-4 dark:from-emerald-950/20 dark:to-transparent">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-sm font-bold tabular-nums text-white dark:from-emerald-500 dark:to-teal-600">
          {section.number}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              {section.title}
            </h2>
            {section.repeat && section.repeat > 1 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                <Repeat className="h-3 w-3" />
                {section.repeat}×
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {section.description}
          </p>
        </div>
      </header>

      {/* Body — three layers, each independently toggleable */}
      <div className="space-y-5 px-5 py-5">
        {allHidden ? (
          <p className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
            Semua lapisan disembunyikan. Aktifkan minimal satu di panel
            &ldquo;Tampilan&rdquo;.
          </p>
        ) : (
          <>
            {showArabic ? (
              <div className="rounded-xl bg-gradient-to-br from-emerald-50/70 to-amber-50/50 px-4 py-4 dark:from-emerald-950/30 dark:to-amber-950/10">
                <ArabicText
                  text={section.arabic}
                  className="text-foreground"
                />
                {section.repeat && section.repeat > 1 ? (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    dibaca {section.repeat} kali
                  </p>
                ) : null}
              </div>
            ) : null}

            {showTransliteration ? (
              <p
                lang="id"
                className="font-mono text-sm italic leading-relaxed text-foreground/80"
              >
                {section.transliteration}
              </p>
            ) : null}

            {showTranslation ? (
              <div className="flex gap-2">
                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-foreground/90">
                  {section.translation}
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Footer — source citation */}
      <footer
        className={cn(
          "border-t border-border/60 bg-muted/30 px-5 py-2.5",
          "text-[11px] font-medium text-muted-foreground"
        )}
      >
        Sumber: {section.source}
      </footer>
    </motion.article>
  );
}
