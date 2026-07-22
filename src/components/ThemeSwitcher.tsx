import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, ChevronDown, Check } from "lucide-react";
import { useFitnessStore } from "@/store/useFitnessStore";
import { THEMES } from "@/data/themes";
import { cn } from "@/lib/utils";

export default function ThemeSwitcher() {
  const themeId = useFitnessStore((s) => s.themeId);
  const setTheme = useFitnessStore((s) => s.setTheme);
  const [open, setOpen] = useState(false);

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  function handleSelect(id: string) {
    setTheme(id);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-ink-600 text-ink-300 hover:bg-ink-800 hover:text-ink-100 transition-all"
      >
        <div
          className="h-4 w-4 rounded-full"
          style={{ backgroundColor: currentTheme.accent }}
        />
        <span className="text-xs font-semibold tracking-wider">
          {currentTheme.name}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-ink-400 transition-transform", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-ink-900 border border-ink-600 shadow-card overflow-hidden z-50"
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <div className="px-4 py-3 border-b border-ink-700">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-300">
                  <Palette className="h-3.5 w-3.5" />
                  选择主题
                </div>
              </div>
              <div className="p-1">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleSelect(theme.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                      themeId === theme.id
                        ? "bg-ink-800"
                        : "hover:bg-ink-800/50"
                    )}
                  >
                    <div className="relative">
                      <div
                        className="h-5 w-5 rounded-full ring-2 ring-ink-600"
                        style={{ backgroundColor: theme.accent }}
                      />
                      <div
                        className="absolute -inset-0.5 rounded-full opacity-20 blur-sm"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={cn("text-sm font-medium", themeId === theme.id ? "text-ink-50" : "text-ink-200")}>
                        {theme.name}
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                        {theme.accentName}
                      </div>
                    </div>
                    {themeId === theme.id && (
                      <Check className="h-4 w-4" style={{ color: theme.accent }} />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
