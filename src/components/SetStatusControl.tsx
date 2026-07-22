import { Check, Minus, X, Clock } from "lucide-react";
import type { SetLog, SetStatus } from "@/types";
import { cn } from "@/lib/utils";

interface SetStatusControlProps {
  setNumber: number;
  targetReps: number;
  restSeconds: number;
  log?: SetLog;
  onStatusChange: (status: SetStatus, actualReps?: number) => void;
}

const STATUS_OPTIONS: {
  value: SetStatus;
  label: string;
  icon: typeof Check;
  activeClass: string;
}[] = [
  {
    value: "completed",
    label: "完成",
    icon: Check,
    activeClass: "bg-theme text-ink-950 border-theme",
  },
  {
    value: "partial",
    label: "部分",
    icon: Minus,
    activeClass: "bg-ember text-ink-50 border-ember",
  },
  {
    value: "skipped",
    label: "跳过",
    icon: X,
    activeClass: "bg-ink-700 text-ink-200 border-ink-500",
  },
  {
    value: "pending",
    label: "待完成",
    icon: Clock,
    activeClass: "bg-ink-800 text-ink-400 border-ink-600",
  },
];

export default function SetStatusControl({
  setNumber,
  targetReps,
  restSeconds,
  log,
  onStatusChange,
}: SetStatusControlProps) {
  const currentStatus: SetStatus = log?.status || "pending";

  return (
    <div className="grid grid-cols-12 gap-2 items-center py-2.5 px-3 rounded-lg hover:bg-ink-800/40 transition-colors">
      {/* 组号 */}
      <div className="col-span-2 flex items-center gap-2">
        <span className="h-7 w-7 rounded-md bg-ink-800 border border-ink-600 flex items-center justify-center font-display text-sm text-ink-200">
          {setNumber}
        </span>
      </div>

      {/* 目标 */}
      <div className="col-span-3 text-sm">
        <div className="text-ink-100 font-medium">{targetReps} 次</div>
        <div className="text-[11px] text-ink-400">休息 {restSeconds}s</div>
      </div>

      {/* 实际次数输入 */}
      <div className="col-span-3">
        {(currentStatus === "completed" || currentStatus === "partial") && (
          <input
            type="number"
            min={0}
            max={1000}
            value={log?.actualReps ?? targetReps}
            onChange={(e) =>
              onStatusChange(
                currentStatus,
                Math.max(0, parseInt(e.target.value) || 0)
              )
            }
            className="w-full rounded-md bg-ink-900 border border-ink-600 px-2 py-1 text-sm text-ink-50 focus:outline-none focus:border-theme/60"
            placeholder="实际次数"
          />
        )}
        {currentStatus === "skipped" && (
          <span className="text-xs text-ink-500 italic">已跳过</span>
        )}
        {currentStatus === "pending" && (
          <span className="text-xs text-ink-500">待训练</span>
        )}
      </div>

      {/* 状态按钮组 */}
      <div className="col-span-4 flex items-center justify-end gap-1">
        {STATUS_OPTIONS.map((opt) => {
          const active = currentStatus === opt.value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value, opt.value === "completed" || opt.value === "partial" ? log?.actualReps ?? targetReps : undefined)}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1.5 rounded-md border text-[11px] font-semibold transition-all",
                active
                  ? opt.activeClass
                  : "bg-transparent border-ink-700 text-ink-400 hover:bg-ink-700/50 hover:text-ink-200"
              )}
              title={opt.label}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
