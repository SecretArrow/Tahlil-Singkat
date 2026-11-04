import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Vitest config — runs unit/component tests for the data layer, cookie
// helpers, hooks, and React components (jsdom environment so DOM APIs and
// @testing-library/react work). The `@/*` path alias is resolved directly
// (no extra plugin) so this config loads cleanly under Vite's CJS bundler.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/components/ui/**", "src/app/**", "**/*.d.ts"],
    },
  },
});
