import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  accent?: "volt" | "ember" | "ink";
  className?: string;
}

export default function StatCard({
  label,
  value,
  unit,
  accent = "ink",
  className,
}: StatCardProps) {
  const accentColor =
    accent === "volt"
      ? "text-theme"
      : accent === "ember"
      ? "text-warning"
      : "text-ink-50";

  return (
    <div
      className={cn(
        "relative surface rounded-xl p-4 overflow-hidden",
        className
      )}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-400">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className={cn(
            "font-display text-4xl leading-none count-up",
            accentColor
          )}
        >
          {value}
        </span>
        {unit && <span className="text-xs text-ink-400">{unit}</span>}
      </div>
      {accent === "volt" && (
        <div className="absolute -right-2 -bottom-2 h-12 w-12 rounded-full bg-theme/5 blur-xl" />
      )}
    </div>
  );
}
