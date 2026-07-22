import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { zhCN } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Plan, TrainingLog } from "@/types";
import { getMuscleGroup } from "@/data/exercises";
import { calcPlanCompletion } from "@/utils/completion";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  cursor: Date;
  selectedDate: Date;
  plans: Plan[];
  logs: TrainingLog[];
  onCursorChange: (d: Date) => void;
  onSelectedChange: (d: Date) => void;
}

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

export default function CalendarGrid({
  cursor,
  selectedDate,
  plans,
  logs,
  onCursorChange,
  onSelectedChange,
}: CalendarGridProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(cursor);
    const monthEnd = endOfMonth(cursor);
    // 周一作为一周开始
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [cursor]);

  // 按日期索引计划
  const planMap = useMemo(() => {
    const m = new Map<string, Plan[]>();
    for (const p of plans) {
      const arr = m.get(p.scheduledDate) || [];
      arr.push(p);
      m.set(p.scheduledDate, arr);
    }
    return m;
  }, [plans]);

  return (
    <div className="surface rounded-2xl p-4 sm:p-6">
      {/* 月份切换 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-theme">
            {format(cursor, "yyyy", { locale: zhCN })}
          </div>
          <div className="font-display text-3xl tracking-wider text-ink-50 mt-1">
            {format(cursor, "M月", { locale: zhCN })}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCursorChange(subMonths(cursor, 1))}
            className="h-9 w-9 rounded-lg border border-ink-600 flex items-center justify-center text-ink-300 hover:bg-ink-700 hover:text-ink-50 transition-colors"
            aria-label="上一月"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              onCursorChange(new Date());
              onSelectedChange(new Date());
            }}
            className="px-3 h-9 rounded-lg border border-ink-600 text-xs font-semibold text-ink-200 hover:bg-ink-700 hover:text-ink-50 transition-colors"
          >
            今天
          </button>
          <button
            onClick={() => onCursorChange(addMonths(cursor, 1))}
            className="h-9 w-9 rounded-lg border border-ink-600 flex items-center justify-center text-ink-300 hover:bg-ink-700 hover:text-ink-50 transition-colors"
            aria-label="下一月"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 星期表头 */}
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-center text-[10px] font-semibold uppercase tracking-widest text-ink-400 py-1"
          >
            {w}
          </div>
        ))}
      </div>

      {/* 日期格 */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayPlans = planMap.get(dateStr) || [];
          const inMonth = isSameMonth(day, cursor);
          const isTodayFlag = isToday(day);
          const isSelected = isSameDay(day, selectedDate);
          const hasPlans = dayPlans.length > 0;

          // 当日整体完成度
          const overallCompletion =
            dayPlans.length === 0
              ? 0
              : Math.round(
                  dayPlans.reduce((sum, p) => {
                    const log = logs.find(
                      (l) => l.planId === p.id && l.date === dateStr
                    );
                    return sum + calcPlanCompletion(p, log);
                  }, 0) / dayPlans.length
                );

          const isDone = hasPlans && overallCompletion >= 100;
          const isPartial = hasPlans && overallCompletion > 0 && overallCompletion < 100;
          const isPending = hasPlans && overallCompletion === 0;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectedChange(day)}
              className={cn(
                "relative aspect-square rounded-lg border p-1.5 sm:p-2 flex flex-col items-start transition-all text-left",
                isSelected
                  ? "border-theme bg-theme/10 shadow-theme"
                  : isTodayFlag
                  ? "border-ink-500 bg-ink-800"
                  : "border-ink-700/60 hover:border-ink-500 hover:bg-ink-800/60",
                !inMonth && "opacity-30"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={cn(
                    "text-xs sm:text-sm font-semibold",
                    isTodayFlag ? "text-theme" : "text-ink-200",
                    !inMonth && "text-ink-500"
                  )}
                >
                  {format(day, "d")}
                </span>
                {isTodayFlag && (
                  <span className="h-1 w-1 rounded-full bg-theme" />
                )}
              </div>

              {hasPlans && (
                <div className="mt-auto w-full">
                  {/* 完成度条 */}
                  <div className="h-1 w-full rounded-full bg-ink-700 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isDone
                          ? "bg-theme"
                          : isPartial
                          ? "bg-warning"
                          : "bg-ink-500"
                      )}
                      style={{ width: `${overallCompletion}%` }}
                    />
                  </div>
                  {/* 肌肉群色点 */}
                  <div className="flex flex-wrap gap-0.5 mt-1.5">
                    {dayPlans.slice(0, 4).map((p) => {
                      const g = getMuscleGroup(p.muscleGroupId);
                      return (
                        <span
                          key={p.id}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: g?.color }}
                          title={g?.name}
                        />
                      );
                    })}
                    {dayPlans.length > 4 && (
                      <span className="text-[9px] text-ink-400 leading-none">
                        +{dayPlans.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 状态标识 */}
              {isDone && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-theme shadow-theme" />
              )}
              {isPending && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-ink-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-ink-700/60 text-[11px] text-ink-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-theme" />
          <span>已完成</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warning" />
          <span>部分完成</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink-500" />
          <span>待训练</span>
        </div>
      </div>
    </div>
  );
}
