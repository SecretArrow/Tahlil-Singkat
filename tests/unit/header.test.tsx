import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header, MobileNav } from "@/components/tahlil/header";
import { ThemeProvider } from "@/components/theme-provider";
import { tahlilNav } from "@/data/tahlil-content";

// next-themes needs its provider; wrap with a permissive ThemeProvider.
function withTheme(node: React.ReactNode) {
  return <ThemeProvider>{node}</ThemeProvider>;
}

describe("Header", () => {
  it("fires the three panel/nav callbacks when its buttons are pressed", () => {
    const onOpenNav = vi.fn();
    const onOpenArabicStyle = vi.fn();
    const onOpenDisplay = vi.fn();
    render(
      withTheme(
        <Header
          onOpenNav={onOpenNav}
          onOpenArabicStyle={onOpenArabicStyle}
          onOpenDisplay={onOpenDisplay}
        />
      )
    );

    fireEvent.click(screen.getByLabelText("Buka navigasi"));
    expect(onOpenNav).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText("Pengaturan teks Arab"));
    expect(onOpenArabicStyle).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText("Pengaturan tampilan"));
    expect(onOpenDisplay).toHaveBeenCalledTimes(1);
  });

  it("shows the brand name on sm+ screens", () => {
    render(
      withTheme(
        <Header onOpenNav={() => {}} onOpenArabicStyle={() => {}} onOpenDisplay={() => {}} />
      )
    );
    expect(screen.getByText("Tahlil Singkat")).toBeInTheDocument();
  });
});

describe("MobileNav", () => {
  it("lists every section for quick jumping", () => {
    render(withTheme(<MobileNav open={true} onClose={() => {}} />));
    tahlilNav.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it("calls onClose when a nav item is tapped", () => {
    const onClose = vi.fn();
    render(withTheme(<MobileNav open={true} onClose={onClose} />));
    fireEvent.click(screen.getByText("Al-Fātihah"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders nothing actionable when closed", () => {
    const onClose = vi.fn();
    render(withTheme(<MobileNav open={false} onClose={onClose} />));
    // Radix Sheet keeps content unmounted when closed — none of the titles appear.
    expect(screen.queryByText("Al-Fātihah")).not.toBeInTheDocument();
  });
});
