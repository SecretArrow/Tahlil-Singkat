"use client";

import * as React from "react";
import { Eye, Lightbulb, RotateCcw, X } from "lucide-react";
import { useDisplaySettings } from "@/components/display-settings-provider";
import { displayToggleLabels } from "@/data/display-settings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

// Same order as the keys of DisplayToggles for a stable, predictable list.
const TOGGLE_KEYS = ["arabic", "transliteration", "translation"] as const;

/** Shape of the keep-screen-on controller (from useKeepScreenOn). */
type KeepScreenControl = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
  isSupported: boolean;
};

/**
 * Display settings dialog — lets the reader show/hide each of the three text
 * layers (Arabic / Transliteration / Translation) inside every SectionCard,
 * and toggle "keep screen awake" so the screen doesn't lock mid-recitation.
 *
 * `keepScreen` is passed in from the always-mounted page (not read here) so
 * the wake lock survives the dialog opening/closing — Radix Dialog unmounts
 * its content when closed, which would otherwise release the lock.
 */
export function DisplaySettingsPanel({
  open,
  onClose,
  keepScreen,
}: {
  open: boolean;
  onClose: () => void;
  keepScreen: KeepScreenControl;
}) {
  const { toggles, setToggle, reset } = useDisplaySettings();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[88vh] overflow-y-auto gap-0 p-0 sm:max-w-md">
        <DialogHeader className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur px-5 py-4">
          <div className="flex items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white dark:from-emerald-500 dark:to-teal-600">
                <Eye className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-base font-bold">
                  Pengaturan Tampilan
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Lapisan teks &amp; perilaku layar.
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

        <div className="space-y-3 p-5">
          {TOGGLE_KEYS.map((key) => {
            const active = toggles[key];
            return (
              <label
                key={key}
                htmlFor={`toggle-${key}`}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-card/60 px-4 py-3 transition-colors hover:bg-accent/40"
              >
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {displayToggleLabels[key]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {active ? "Tampil" : "Disembunyikan"}
                  </span>
                </span>
                <Switch
                  id={`toggle-${key}`}
                  checked={active}
                  onCheckedChange={(v) => setToggle(key, v)}
                  aria-label={displayToggleLabels[key]}
                />
              </label>
            );
          })}

          {/* Live summary */}
          <p className="rounded-lg bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
            Aktif:{" "}
            <span className="font-medium text-foreground">
              {TOGGLE_KEYS.filter((k) => toggles[k])
                .map((k) => displayToggleLabels[k])
                .join(", ") || "(tidak ada)"}
            </span>
          </p>

          {/* Screen wake-lock — separate app-behaviour setting */}
          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5" />
              Layar
            </div>
            <label
              htmlFor="toggle-keep-screen-on"
              className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-card/60 px-4 py-3 transition-colors hover:bg-accent/40"
            >
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  Layar Tetap Hidup
                </span>
                <span className="text-xs text-muted-foreground">
                  {keepScreen.isSupported
                    ? keepScreen.enabled
                      ? "Layar tidak akan terkunci saat membaca"
                      : "Layar boleh terkunci seperti biasa"
                    : "Tidak didukung perangkat ini"}
                </span>
              </span>
              <Switch
                id="toggle-keep-screen-on"
                checked={keepScreen.enabled}
                onCheckedChange={keepScreen.setEnabled}
                aria-label="Layar Tetap Hidup"
                disabled={!keepScreen.isSupported}
              />
            </label>
          </div>

          {/* Reset */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Pengaturan tersimpan otomatis di perangkat ini.
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
