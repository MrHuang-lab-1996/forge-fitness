import { Sun, Moon } from "lucide-react";
import { useFitnessStore } from "@/store/useFitnessStore";

export default function WhiteBgToggle() {
  const whiteBg = useFitnessStore((s) => s.whiteBg);
  const toggle = useFitnessStore((s) => s.toggleWhiteBg);

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-ink-600 text-ink-300 hover:bg-ink-800 hover:text-ink-100 transition-all"
      title={whiteBg ? "切换为深色背景" : "切换为浅色背景"}
    >
      {whiteBg ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="text-xs font-semibold tracking-wider">
        {whiteBg ? "深色" : "浅色"}
      </span>
    </button>
  );
}
