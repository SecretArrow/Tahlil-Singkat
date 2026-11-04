import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ArabicStyleProvider, useArabicStyle } from "@/components/arabic-style-provider";
import {
  DisplaySettingsProvider,
  useDisplaySettings,
} from "@/components/display-settings-provider";
import { defaultArabicSettings } from "@/data/arabic-style";
import { defaultDisplayToggles } from "@/data/display-settings";
import { COOKIE_KEYS, getCookie } from "@/lib/cookies/client";

/** Probe component that exposes the arabic-style context via a button. */
function ArabicProbe() {
  const { settings, setMode, setFontSize, reset } = useArabicStyle();
  return (
    <>
      <div data-testid="mode">{settings.mode}</div>
      <div data-testid="fontSize">{settings.fontSize}</div>
      <button onClick={() => setMode("naskhi")}>set-naskhi</button>
      <button onClick={() => setFontSize(3)}>set-size-3</button>
      <button onClick={reset}>reset</button>
    </>
  );
}

function DisplayProbe() {
  const { toggles, setToggle, reset } = useDisplaySettings();
  return (
    <>
      <div data-testid="arabic">{String(toggles.arabic)}</div>
      <div data-testid="translation">{String(toggles.translation)}</div>
      <button onClick={() => setToggle("translation", false)}>hide-translation</button>
      <button onClick={reset}>reset</button>
    </>
  );
}

describe("ArabicStyleProvider", () => {
  it("seeds with the default settings", () => {
    render(
      <ArabicStyleProvider>
        <ArabicProbe />
      </ArabicStyleProvider>
    );
    expect(screen.getByTestId("mode").textContent).toBe(defaultArabicSettings.mode);
  });

  it("setMode updates settings and persists to the cookie", () => {
    render(
      <ArabicStyleProvider>
        <ArabicProbe />
      </ArabicStyleProvider>
    );
    act(() => {
      fireEvent.click(screen.getByText("set-naskhi"));
    });
    expect(screen.getByTestId("mode").textContent).toBe("naskhi");
    const stored = getCookie(COOKIE_KEYS.arabicStyle);
    expect(stored).toContain('"mode":"naskhi"');
    // The naskhi mode carries a `suggested` spacing bump — verify it applied.
    expect(JSON.parse(stored!).lineHeight).toBeGreaterThan(defaultArabicSettings.lineHeight);
  });

  it("reset returns to defaults", () => {
    render(
      <ArabicStyleProvider>
        <ArabicProbe />
      </ArabicStyleProvider>
    );
    act(() => {
      fireEvent.click(screen.getByText("set-size-3"));
    });
    expect(screen.getByTestId("fontSize").textContent).toBe("3");
    act(() => {
      fireEvent.click(screen.getByText("reset"));
    });
    expect(screen.getByTestId("fontSize").textContent).toBe(String(defaultArabicSettings.fontSize));
  });
});

describe("DisplaySettingsProvider", () => {
  it("seeds with all layers visible", () => {
    render(
      <DisplaySettingsProvider>
        <DisplayProbe />
      </DisplaySettingsProvider>
    );
    expect(screen.getByTestId("arabic").textContent).toBe("true");
    expect(screen.getByTestId("translation").textContent).toBe("true");
  });

  it("setToggle flips one layer and persists", () => {
    render(
      <DisplaySettingsProvider>
        <DisplayProbe />
      </DisplaySettingsProvider>
    );
    act(() => {
      fireEvent.click(screen.getByText("hide-translation"));
    });
    expect(screen.getByTestId("translation").textContent).toBe("false");
    // arabic untouched.
    expect(screen.getByTestId("arabic").textContent).toBe("true");
    const stored = getCookie(COOKIE_KEYS.displayToggles);
    expect(stored).toContain('"translation":false');
    expect(stored).toContain('"arabic":true');
  });

  it("reset restores every layer to visible", () => {
    render(
      <DisplaySettingsProvider>
        <DisplayProbe />
      </DisplaySettingsProvider>
    );
    act(() => {
      fireEvent.click(screen.getByText("hide-translation"));
    });
    expect(screen.getByTestId("translation").textContent).toBe("false");
    act(() => {
      fireEvent.click(screen.getByText("reset"));
    });
    expect(screen.getByTestId("translation").textContent).toBe(
      String(defaultDisplayToggles.translation)
    );
  });

  it("restores saved toggles from the cookie on mount", () => {
    // Pre-seed the cookie as a returning user would have.
    document.cookie =
      `${COOKIE_KEYS.displayToggles}=${encodeURIComponent(
        JSON.stringify({ arabic: true, transliteration: false, translation: false })
      )}; path=/`;
    render(
      <DisplaySettingsProvider>
        <DisplayProbe />
      </DisplaySettingsProvider>
    );
    // The mount-restore effect runs after the first paint; wait for it.
    // We assert by checking the next microtask via act-friendly polling.
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(screen.getByTestId("translation").textContent).toBe("false");
        resolve();
      }, 0);
    });
  });
});
