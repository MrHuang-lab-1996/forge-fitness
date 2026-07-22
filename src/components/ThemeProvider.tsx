import { useEffect } from "react";
import { useFitnessStore } from "@/store/useFitnessStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useFitnessStore((s) => s.getTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--theme-bg-primary", theme.bgPrimary);
    root.style.setProperty("--theme-bg-secondary", theme.bgSecondary);
    root.style.setProperty("--theme-bg-surface", theme.bgSurface);
    root.style.setProperty("--theme-accent", theme.accent);
    root.style.setProperty("--theme-accent-dark", theme.accentDark);
    root.style.setProperty("--theme-warning", theme.warning);
    root.style.setProperty("--theme-warning-dark", theme.warningDark);
    root.style.setProperty("--theme-gradient1-color", theme.gradient1.color);
    root.style.setProperty("--theme-gradient1-opacity", String(theme.gradient1.opacity));
    root.style.setProperty("--theme-gradient2-color", theme.gradient2.color);
    root.style.setProperty("--theme-gradient2-opacity", String(theme.gradient2.opacity));
  }, [theme]);

  return <>{children}</>;
}
