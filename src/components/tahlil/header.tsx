"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Menu, Moon, Sun, Type, Eye, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { tahlilNav } from "@/data/tahlil-content";

type HeaderProps = {
  onOpenNav: () => void;
  onOpenArabicStyle: () => void;
  onOpenDisplay: () => void;
};

/**
 * Sticky top app bar. Holds the brand, the mobile-nav trigger, the theme
 * toggle, and the two settings-panel triggers (Arabic typography + display
 * layers). Buttons are icon-only on small screens and gain labels on `sm+`.
 */
export function Header({
  onOpenNav,
  onOpenArabicStyle,
  onOpenDisplay,
}: HeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = (mounted ? resolvedTheme : theme) === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        {/* Mobile nav trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenNav}
          aria-label="Buka navigasi"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Brand */}
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label="Tahlil Singkat — ke atas"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm dark:from-emerald-500 dark:to-teal-600">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold tracking-tight text-foreground">
              Tahlil Singkat
            </span>
            <span className="text-[11px] text-muted-foreground">
              Majelis Tahlil &amp; Doa
            </span>
          </span>
        </a>

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          {/* Arabic typography settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenArabicStyle}
            className="gap-1.5"
            aria-label="Pengaturan teks Arab"
          >
            <Type className="h-4 w-4" />
            <span className="hidden md:inline">Teks Arab</span>
          </Button>

          {/* Display layers settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenDisplay}
            className="gap-1.5"
            aria-label="Pengaturan tampilan"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden md:inline">Tampilan</span>
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
          >
            {mounted ? (
              isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            ) : (
              <Sun className="h-5 w-5 opacity-0" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Slide-in navigation listing every section in the tahlil sequence. Clicking
 * an item scrolls to that section (anchor `#<section.id>`) and closes the
 * sheet. Shown only on `< lg` screens; the header triggers it.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="text-base">Daftar Bacaan</SheetTitle>
          <p className="text-xs text-muted-foreground">
            {tahlilNav.length} bagian · lompat cepat
          </p>
        </SheetHeader>
        <nav className="overflow-y-auto p-2">
          <ul className="space-y-0.5">
            {tahlilNav.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold tabular-nums text-primary">
                    {item.number}
                  </span>
                  <span className="font-medium text-foreground">
                    {item.title}
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
