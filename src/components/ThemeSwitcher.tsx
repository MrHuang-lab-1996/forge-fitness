import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, ChevronDown, Check } from "lucide-react";
import { useFitnessStore } from "@/store/useFitnessStore";
import { THEMES } from "@/data/themes";
import { cn } from "@/lib/utils";

function ThemeDropdown({
  open,
  themeId,
  anchorRef,
  onSelect,
  onClose,
}: {
  open: boolean;
  themeId: string;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const menuWidth = 192; // w-48 = 12rem
      const menuHeight = 280; // approx
      const gap = 8;
      const pad = 8;

      // 水平：优先右对齐按钮，如果超出左边界则左对齐
      let left = rect.right - menuWidth;
      if (left < pad) left = pad;
      if (left + menuWidth > window.innerWidth - pad) {
        left = window.innerWidth - menuWidth - pad;
      }

      // 垂直：优先向下展开，如果下方空间不够则向上展开
      let top = rect.bottom + gap;
      if (top + menuHeight > window.innerHeight - pad) {
        top = rect.top - menuHeight - gap;
      }

      setPos({ top, left });
    }
  }, [open, anchorRef]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {createPortal(
            <div
              className="fixed inset-0 z-[100]"
              onClick={onClose}
            />,
            document.body
          )}
          {createPortal(
            <motion.div
              className="fixed z-[101] w-48 rounded-xl bg-ink-900 border border-ink-600 shadow-card overflow-hidden"
              style={{ top: pos.top, left: pos.left }}
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
                    onClick={() => onSelect(theme.id)}
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
                      <div
                        className={cn(
                          "text-sm font-medium",
                          themeId === theme.id ? "text-ink-50" : "text-ink-200"
                        )}
                      >
                        {theme.name}
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                        {theme.accentName}
                      </div>
                    </div>
                    {themeId === theme.id && (
                      <Check
                        className="h-4 w-4"
                        style={{ color: theme.accent }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>,
            document.body
          )}
        </>
      )}
    </AnimatePresence>
  );
}

export default function ThemeSwitcher() {
  const themeId = useFitnessStore((s) => s.themeId);
  const setTheme = useFitnessStore((s) => s.setTheme);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  function handleSelect(id: string) {
    setTheme(id);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
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
          className={cn(
            "h-4 w-4 text-ink-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <ThemeDropdown
        open={open}
        themeId={themeId}
        anchorRef={btnRef}
        onSelect={handleSelect}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
