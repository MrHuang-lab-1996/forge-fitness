import { useEffect } from "react";
import { useFitnessStore } from "@/store/useFitnessStore";
import { getThemeById } from "@/data/themes";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeId = useFitnessStore((s) => s.themeId);
  const whiteBg = useFitnessStore((s) => s.whiteBg);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const theme = getThemeById(themeId);

    root.style.setProperty("--theme-accent", theme.accent);
    root.style.setProperty("--theme-accent-dark", theme.accentDark);
    root.style.setProperty("--theme-warning", theme.warning);
    root.style.setProperty("--theme-warning-dark", theme.warningDark);

    if (whiteBg) {
      body.setAttribute("data-white-bg", "true");
      root.style.setProperty("--theme-bg-primary", "#F8F9FA");
      root.style.setProperty("--theme-bg-secondary", "#FFFFFF");
      root.style.setProperty("--theme-bg-surface", "#FFFFFF");
      root.style.setProperty("--theme-gradient1-color", theme.accent);
      root.style.setProperty("--theme-gradient1-opacity", "0.06");
      root.style.setProperty("--theme-gradient2-color", theme.warning);
      root.style.setProperty("--theme-gradient2-opacity", "0.04");
    } else {
      body.removeAttribute("data-white-bg");
      root.style.setProperty("--theme-bg-primary", theme.bgPrimary);
      root.style.setProperty("--theme-bg-secondary", theme.bgSecondary);
      root.style.setProperty("--theme-bg-surface", theme.bgSurface);
      root.style.setProperty("--theme-gradient1-color", theme.gradient1.color);
      root.style.setProperty("--theme-gradient1-opacity", String(theme.gradient1.opacity));
      root.style.setProperty("--theme-gradient2-color", theme.gradient2.color);
      root.style.setProperty("--theme-gradient2-opacity", String(theme.gradient2.opacity));
    }
  }, [themeId, whiteBg]);

  return <>{children}</>;
}
