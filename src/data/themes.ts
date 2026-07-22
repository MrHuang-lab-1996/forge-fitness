export interface ThemeConfig {
  id: string;
  name: string;
  accentName: string;
  bgPrimary: string;
  bgSecondary: string;
  bgSurface: string;
  accent: string;
  accentDark: string;
  warning: string;
  warningDark: string;
  gradient1: { color: string; opacity: number };
  gradient2: { color: string; opacity: number };
}

export const THEMES: ThemeConfig[] = [
  {
    id: "volt",
    name: "电光绿",
    accentName: "VOLT",
    bgPrimary: "#0A0A0B",
    bgSecondary: "#0F0F12",
    bgSurface: "#16161A",
    accent: "#C6FF3D",
    accentDark: "#9FCC2A",
    warning: "#FF6B35",
    warningDark: "#CC5529",
    gradient1: { color: "#C6FF3D", opacity: 0.08 },
    gradient2: { color: "#FF6B35", opacity: 0.05 },
  },
  {
    id: "cyber",
    name: "赛博蓝",
    accentName: "CYBER",
    bgPrimary: "#0A0A12",
    bgSecondary: "#0F0F1A",
    bgSurface: "#161622",
    accent: "#00D4FF",
    accentDark: "#00A8CC",
    warning: "#FF3D68",
    warningDark: "#CC3152",
    gradient1: { color: "#00D4FF", opacity: 0.08 },
    gradient2: { color: "#FF3D68", opacity: 0.05 },
  },
  {
    id: "neon",
    name: "霓虹粉",
    accentName: "NEON",
    bgPrimary: "#0F0A12",
    bgSecondary: "#1A0F1A",
    bgSurface: "#221622",
    accent: "#FF00FF",
    accentDark: "#CC00CC",
    warning: "#FF9500",
    warningDark: "#CC7700",
    gradient1: { color: "#FF00FF", opacity: 0.08 },
    gradient2: { color: "#FF9500", opacity: 0.05 },
  },
  {
    id: "aurora",
    name: "极光紫",
    accentName: "AURORA",
    bgPrimary: "#0A0F12",
    bgSecondary: "#0F1A1F",
    bgSurface: "#162228",
    accent: "#A855F7",
    accentDark: "#8B45D0",
    warning: "#EC4899",
    warningDark: "#C23B7D",
    gradient1: { color: "#A855F7", opacity: 0.08 },
    gradient2: { color: "#EC4899", opacity: 0.05 },
  },
  {
    id: "sunset",
    name: "日落橙",
    accentName: "SUNSET",
    bgPrimary: "#120A0A",
    bgSecondary: "#1A0F0F",
    bgSurface: "#221616",
    accent: "#FF6B35",
    accentDark: "#CC5529",
    warning: "#FFD700",
    warningDark: "#CCAC00",
    gradient1: { color: "#FF6B35", opacity: 0.08 },
    gradient2: { color: "#FFD700", opacity: 0.05 },
  },
];

export function getThemeById(id: string): ThemeConfig {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}
