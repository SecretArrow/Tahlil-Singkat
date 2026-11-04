import { test, expect, type Page } from "@playwright/test";

/**
 * End-to-end coverage for every user-facing feature of Tahlil Singkat.
 * Each test targets one feature so a failure points straight at the cause.
 */

const SECTION_TITLES = [
  "Al-Fātihah",
  "Tahlil",
  "Ṣalawat Ibrāhīmiyyah",
  "Surah Al-Ikhlāṣ",
  "Surah Al-Falaq",
  "Surah An-Nās",
  "Āyatul-Kursī",
  "Tasbīḥ, Taḥmid & Takbīr",
  "Doa untuk Arwah",
  "Doa Penutup & Al-Fātihah",
];

/** Wait for the app to hydrate (the hero basmala is client-rendered). */
async function ready(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { name: "Tahlil Singkat" })).toBeVisible();
}

test.describe("Home page", () => {
  test("loads with the correct title and hero invocation", async ({ page }) => {
    await ready(page);
    await expect(page).toHaveTitle(/Tahlil Singkat/i);
    // Hero basmala (Arabic) is present.
    await expect(page.getByText("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ").first()).toBeVisible();
  });

  test("renders every section in the tahlil sequence", async ({ page }) => {
    await ready(page);
    for (const title of SECTION_TITLES) {
      // exact: true — without it "Al-Fātihah" also matches the section
      // titled "Doa Penutup & Al-Fātihah" (substring match).
      await expect(
        page.getByRole("heading", { name: title, exact: true })
      ).toHaveCount(1);
    }
  });

  test("shows the repeat badge on repeated recitations", async ({ page }) => {
    await ready(page);
    // Tahlil is repeated 100×.
    await expect(page.getByText("100×", { exact: true })).toBeVisible();
    // Al-Ikhlas / Al-Falaq / An-Nas are 3×.
    await expect(page.getByText("3×", { exact: true })).toHaveCount(3);
  });
});

test.describe("Theme toggle", () => {
  test("switches between light and dark on click", async ({ page }) => {
    await ready(page);
    const html = page.locator("html");

    // Chromium defaults to prefers-color-scheme: light → no .dark initially.
    await expect(html).not.toHaveClass(/dark/);

    await page.getByLabel("Aktifkan mode gelap").click();
    await expect(html).toHaveClass(/dark/);

    await page.getByLabel("Aktifkan mode terang").click();
    await expect(html).not.toHaveClass(/dark/);
  });
});

test.describe("Display settings panel", () => {
  test("hides the translation layer when its switch is turned off", async ({ page }) => {
    await ready(page);
    // A known translation string is visible before toggling.
    const ikhlasTranslation = page.getByText("Katakanlah: Dialah Allah, Yang Maha Esa.");
    await expect(ikhlasTranslation).toBeVisible();

    await page.getByLabel("Pengaturan tampilan").click();
    await expect(page.getByRole("heading", { name: "Pengaturan Tampilan" })).toBeVisible();

    const translationSwitch = page.getByRole("switch", { name: "Terjemahan" });
    await expect(translationSwitch).toHaveAttribute("aria-checked", "true");
    await translationSwitch.click();
    await expect(translationSwitch).toHaveAttribute("aria-checked", "false");

    // Translation disappears from the section.
    await expect(ikhlasTranslation).toHaveCount(0);
  });

  test("hides the arabic layer when its switch is turned off", async ({ page }) => {
    await ready(page);
    await expect(page.locator(".ayah-mark").first()).toBeVisible();

    await page.getByLabel("Pengaturan tampilan").click();
    await page.getByRole("switch", { name: "Teks Arab" }).click();

    await expect(page.locator(".ayah-mark")).toHaveCount(0);
  });

  test("persists display toggles across reload", async ({ page }) => {
    await ready(page);
    await page.getByLabel("Pengaturan tampilan").click();
    await page.getByRole("switch", { name: "Transliterasi" }).click();
    // Close the dialog by pressing Escape.
    await page.keyboard.press("Escape");

    await page.reload();
    await page.waitForLoadState("networkidle");
    // Transliteration is still hidden after reload (cookie restored on mount).
    await expect(page.getByText("Qul huwallāhu aḥad")).toHaveCount(0);
  });
});

test.describe("Arabic typography panel", () => {
  test("applies the naskhi (beginner) mode to every arabic verse", async ({ page }) => {
    await ready(page);
    // Default mode is quran → verses use the quran font class.
    await expect(page.locator(".arabic-text.font-arabic-quran").first()).toBeVisible();

    await page.getByLabel("Pengaturan teks Arab").click();
    await expect(page.getByRole("heading", { name: "Pengaturan Teks Arab" })).toBeVisible();

    // Switch to the Naskhi Tebal (Pemula) mode card.
    await page.getByRole("button", { name: /Naskhi Tebal/ }).click();

    // Every arabic verse INSIDE a section card now carries the naskhi font
    // class. (Scoped to `article` so the panel's own comparison previews —
    // which force their own mode — are excluded.)
    const verses = page.locator("article .arabic-text");
    const count = await verses.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(verses.nth(i)).toHaveClass(/font-arabic-naskhi/);
    }
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens the nav drawer and jumps to a section", async ({ page }) => {
    await ready(page);
    await page.getByLabel("Buka navigasi").click();
    await expect(page.getByRole("heading", { name: "Daftar Bacaan" })).toBeVisible();

    // Tap a section deep in the list.
    await page.getByRole("link", { name: /Āyatul-Kursī/ }).click();

    // The drawer closes and the target section scrolls into view.
    await expect(page.locator("#ayat-kursi")).toBeInViewport();
  });
});

test.describe("Back-to-top button", () => {
  test("appears after scrolling and returns to the hero", async ({ page }) => {
    await ready(page);
    // Not visible at the top.
    await expect(page.getByLabel("Kembali ke atas")).toHaveCount(0);

    // Scroll most of the way down.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByLabel("Kembali ke atas")).toBeVisible();

    await page.getByLabel("Kembali ke atas").click();
    // Hero (#top) should be back in view at the top of the page.
    await expect(page.locator("#top")).toBeInViewport();
  });
});

test.describe("Keep-screen-on (Layar Tetap Hidup)", () => {
  test("toggles on/off and shows the live status hint", async ({ page }) => {
    await ready(page);
    await page.getByLabel("Pengaturan tampilan").click();

    const sw = page.getByRole("switch", { name: "Layar Tetap Hidup" });
    // Chromium (Capacitor's WebView) supports the Screen Wake Lock API, so the
    // switch is enabled and starts off.
    await expect(sw).toBeEnabled();
    await expect(sw).toHaveAttribute("aria-checked", "false");
    // Off hint.
    await expect(page.getByText("Layar boleh terkunci seperti biasa")).toBeVisible();

    await sw.click();
    await expect(sw).toHaveAttribute("aria-checked", "true");
    // On hint.
    await expect(page.getByText("Layar tidak akan terkunci saat membaca")).toBeVisible();
  });

  test("persisted across reload (cookie restored on mount)", async ({ page }) => {
    await ready(page);
    await page.getByLabel("Pengaturan tampilan").click();
    const sw = page.getByRole("switch", { name: "Layar Tetap Hidup" });
    await sw.click();
    await expect(sw).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Escape");

    // Reload — the preference is restored from the cookie on mount.
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.getByLabel("Pengaturan tampilan").click();
    await expect(
      page.getByRole("switch", { name: "Layar Tetap Hidup" })
    ).toHaveAttribute("aria-checked", "true");
  });
});
