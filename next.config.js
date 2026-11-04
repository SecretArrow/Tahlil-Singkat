/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the built site can be bundled into the Android APK via
  // Capacitor (no Node server required at runtime).
  output: "export",

  // Capacitor serves the site from the device filesystem; trailing slashes
  // make local links resolve correctly without a server rewrites layer.
  trailingSlash: true,

  // next/image optimization requires a server — disabled for static export.
  images: {
    unoptimized: true,
  },

  // The /api/* routes are server-only and are intentionally excluded from a
  // static export. Client code already persists settings to a local cookie
  // (see src/lib/cookies/client.ts) and the fire-and-forget POST to /api/settings
  // is wrapped in .catch(() => {}), so removing the endpoint does not break
  // the app — persistence simply falls back to the client cookie.
  reactStrictMode: true,
};

module.exports = nextConfig;
