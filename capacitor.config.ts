import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration.
 *
 * The Next.js app is statically exported to `out/` (see next.config.js
 * `output: "export"`). `npx cap sync android` copies that folder into the
 * Android project's WebView assets, producing a native APK that runs the
 * web app offline — no server required.
 *
 * `appId` must be a stable, reverse-DNS identifier that matches the package
 * name baked into the AndroidManifest; it can never change once the app is
 * published to a store.
 */
const config: CapacitorConfig = {
  appId: "com.secretarrow.tahlilsingkat",
  appName: "Tahlil Singkat",
  webDir: "out",
  android: {
    // The static export uses only local assets; no mixed content is needed.
    allowMixedContent: false,
    // Prefer the system WebView's native scrolling/overscroll behaviour.
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
