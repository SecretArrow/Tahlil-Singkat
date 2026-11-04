"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";

/**
 * Hero banner at the top of the home page. Carries the app identity, a short
 * Arabic invocation, and a one-line description of the majelis. Purely
 * presentational — no props, no client state beyond framer-motion's entrance
 * animation.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border bg-gradient-to-b from-emerald-50/60 via-background to-background dark:from-emerald-950/30 dark:via-background dark:to-background"
    >
      {/* Decorative islamic pattern overlay */}
      <div className="islamic-pattern absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Crest */}
          <span className="animate-glow flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/20 dark:from-emerald-500 dark:to-teal-600">
            <BookOpen className="h-8 w-8" />
          </span>

          {/* Eyebrow */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Majelis Doa &amp; Zikir
          </span>

          {/* Title */}
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            <span className="gradient-text">Tahlil Singkat</span>
          </h1>

          {/* Ornamental divider */}
          <div className="ornament-divider w-full max-w-xs">
            <span className="text-lg">۞</span>
          </div>

          {/* Arabic invocation */}
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic-quran text-2xl leading-relaxed text-foreground sm:text-3xl"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          {/* Description */}
          <p className="mx-auto max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Rangkaian zikir, tahlil, Al-Fātihah, Āyatul-Kursī, dan doa untuk
            mendoakan para arwah kaum muslimin. Disusun ringkas dari
            Al-Qur&apos;an, hadits, dan amaliah ulama.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
