"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Thin wrapper around next-themes' ThemeProvider.
 *
 * next-themes v0.4 persists to localStorage via `storageKey` (the `cookieName`
 * / `storage="cookie"` props from v0.3 were removed). For a static-export /
 * Capacitor app localStorage is the right store: the WebView persists it across
 * launches, and next-themes injects an inline script that applies the saved
 * theme before first paint — so there is no flash of the wrong theme.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="tahlil-theme"
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
