"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Type,
  AlignRight,
  AlignJustify,
  RotateCcw,
  Columns2,
  Eye,
  Check,
} from "lucide-react";
import { useArabicStyle } from "@/components/arabic-style-provider";
import { arabicStyleModes } from "@/data/arabic-style";
import { ArabicText } from "@/components/arabic-text";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Sample text chosen to showcase ligatures, harakat, kashrah, and connections
// — same string in both modes so the user can directly compare rendering.
const SAMPLE_TEXT =
  "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ. الْحَمْدُ لِلهِ رَبِّ الْعٰلَمِيْنَ";

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

function ModeCard({
  mode,
  active,
  onSelect,
}: {
  mode: "standard" | "quran" | "naskhi";
  active: boolean;
  onSelect: () => void;
}) {
  const cfg = arabicStyleModes[mode];
  // For Naskhi mode, use the suggested spacing in the preview so user can see the benefit
  const previewSettings = mode === "naskhi"
    ? { fontSize: 1.4, lineHeight: 2.2, wordSpacing: 0.18, align: "right" as const }
    : { fontSize: 1.4, lineHeight: 1.9, wordSpacing: 0.05, align: "right" as const };
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
          : "border-border bg-card/60 hover:border-primary/40 hover:bg-accent"
      }`}
    >
      {active && (
        <motion.span
          layoutId="mode-active"
          className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </motion.span>
      )}
      <ArabicText
        text={SAMPLE_TEXT}
        forceMode={mode}
        forceSettings={previewSettings}
        className="mb-2 text-foreground/90"
      />
      <p className="text-sm font-semibold text-foreground">{cfg.label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {cfg.description}
      </p>
    </button>
  );
}

export function ArabicStylePanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { settings, setMode, setFontSize, setLineHeight, setWordSpacing, setLetterSpacing, setAlign, reset } =
    useArabicStyle();

  const [compare, setCompare] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur px-5 py-4">
          <div className="flex items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white dark:from-emerald-500 dark:to-teal-600">
                <Type className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-base font-bold">
                  Pengaturan Teks Arab
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Pilih gaya, ukuran, dan tata letak. Pratinjau langsung.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-5">
          {/* Mode selection */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Mode Penulisan
              </h3>
              <button
                type="button"
                onClick={() => setCompare((c) => !c)}
                aria-pressed={compare}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  compare
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                <Columns2 className="h-3.5 w-3.5" />
                {compare ? "Bandingkan: Aktif" : "Bandingkan berdampingan"}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ModeCard mode="quran" active={settings.mode === "quran"} onSelect={() => setMode("quran")} />
              <ModeCard mode="standard" active={settings.mode === "standard"} onSelect={() => setMode("standard")} />
              <ModeCard mode="naskhi" active={settings.mode === "naskhi"} onSelect={() => setMode("naskhi")} />
            </div>

            {/* Side-by-side comparison */}
            <AnimatePresence initial={false}>
              {compare && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-4">
                    <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Eye className="h-3.5 w-3.5" />
                      Perbandingan berdampingan
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {(["quran", "standard", "naskhi"] as const).map((m) => (
                        <div
                          key={m}
                          className={`rounded-xl border p-3 ${
                            settings.mode === m
                              ? "border-primary/50 bg-primary/5"
                              : "border-border bg-background"
                          }`}
                        >
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {arabicStyleModes[m].label}
                            {settings.mode === m && (
                              <span className="ms-1.5 text-primary">• Aktif</span>
                            )}
                          </p>
                          <ArabicText
                            text={SAMPLE_TEXT}
                            forceMode={m}
                            // For Naskhi in compare view, use its suggested spacing so the difference is visible
                            forceSettings={
                              m === "naskhi"
                                ? {
                                    fontSize: 1.6,
                                    lineHeight: 2.6,
                                    wordSpacing: 0.18,
                                    align: "right" as const,
                                  }
                                : {
                                    fontSize: settings.fontSize,
                                    lineHeight: settings.lineHeight,
                                    wordSpacing: settings.wordSpacing,
                                    align: settings.align,
                                  }
                            }
                            className="text-foreground"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                      Teks identik di ketiga kolom — hanya tipografi yang berbeda.
                      Tidak ada huruf, harakat, atau urutan yang diubah.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Typography controls */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Tipografi
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Slider
                label="Ukuran Huruf"
                value={settings.fontSize}
                min={1.2}
                max={3.2}
                step={0.05}
                onChange={setFontSize}
                formatValue={(v) => `${v.toFixed(2)} rem`}
              />
              <Slider
                label="Jarak Antarbaris"
                value={settings.lineHeight}
                min={1.4}
                max={3.2}
                step={0.05}
                onChange={setLineHeight}
                formatValue={(v) => v.toFixed(2)}
              />
              <Slider
                label="Jarak Antarkata"
                value={settings.wordSpacing}
                min={0}
                max={0.6}
                step={0.01}
                onChange={setWordSpacing}
                formatValue={(v) => `${v.toFixed(2)} em`}
              />
              <Slider
                label="Jarak Antar Huruf"
                value={settings.letterSpacing}
                min={0}
                max={0.15}
                step={0.005}
                onChange={setLetterSpacing}
                formatValue={(v) => `${v.toFixed(3)} em`}
              />
              {/* Alignment */}
              <div className="space-y-1.5">
                <span className="block text-sm font-medium text-foreground">
                  Perataan
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAlign("right")}
                    aria-pressed={settings.align === "right"}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition-colors ${
                      settings.align === "right"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <AlignRight className="h-4 w-4" />
                    Kanan
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlign("justify")}
                    aria-pressed={settings.align === "justify"}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition-colors ${
                      settings.align === "justify"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <AlignJustify className="h-4 w-4" />
                    Rata Kanan-Kiri
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Live preview with current settings */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Pratinjau Langsung
            </h3>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-emerald-50/80 to-amber-50/60 p-5 dark:from-emerald-950/40 dark:to-amber-950/20">
              <ArabicText
                text={SAMPLE_TEXT}
                className="text-foreground"
              />
              <p className="mt-3 border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
                Mode aktif: <span className="font-semibold text-foreground">{arabicStyleModes[settings.mode].label}</span>
                {" · "}
                {settings.fontSize.toFixed(2)}rem / LH {settings.lineHeight.toFixed(2)} / WS {settings.wordSpacing.toFixed(2)}em / LS {settings.letterSpacing.toFixed(3)}em /{" "}
                {settings.align === "right" ? "rata kanan" : "rata kanan-kiri"}
              </p>
            </div>
          </section>

          {/* Reset */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Pengaturan tersimpan otomatis di browser ini.
            </p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
