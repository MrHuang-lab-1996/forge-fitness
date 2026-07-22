import { Link } from "react-router-dom";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ChevronRight, Dumbbell, Layers } from "lucide-react";
import type { Plan, TrainingLog } from "@/types";
import MuscleBadge from "@/components/MuscleBadge";
import ProgressRing from "@/components/ProgressRing";
import { getMuscleGroup } from "@/data/exercises";
import {
  calcPlanCompletion,
  countCompletedSets,
  countPlanSets,
} from "@/utils/completion";
import { cn } from "@/lib/utils";

interface TodayPlanCardProps {
  plan: Plan;
  log?: TrainingLog;
  date: Date;
}

export default function TodayPlanCard({ plan, log, date }: TodayPlanCardProps) {
  const group = getMuscleGroup(plan.muscleGroupId);
  const completion = calcPlanCompletion(plan, log);
  const totalSets = countPlanSets(plan);
  const doneSets = countCompletedSets(plan, log);
  const exerciseCount = plan.exercises.length;

  return (
    <Link
      to={`/train/${format(date, "yyyy-MM-dd")}`}
      className={cn(
        "group block surface surface-hover rounded-xl overflow-hidden relative"
      )}
    >
      {/* 左侧色条 */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: group?.color }}
      />

      <div className="p-4 pl-5 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <MuscleBadge muscleGroupId={plan.muscleGroupId} size="sm" />
            <span className="text-[11px] text-ink-400">
              {format(date, "M月d日 EEEE", { locale: zhCN })}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-ink-50 truncate">
            {plan.name}
          </h3>
          <div className="flex items-center gap-4 mt-2 text-xs text-ink-300">
            <span className="inline-flex items-center gap-1">
              <Dumbbell className="h-3.5 w-3.5" />
              {exerciseCount} 个动作
            </span>
            <span className="inline-flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              {doneSets}/{totalSets} 组
            </span>
          </div>

          {/* 进度条 */}
          <div className="mt-3 h-1.5 w-full rounded-full bg-ink-700 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                completion >= 100
                  ? "bg-theme"
                  : completion > 0
                  ? "bg-ember"
                  : "bg-ink-500"
              )}
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <ProgressRing value={completion} size={56} stroke={5}>
            <span className="font-display text-sm text-ink-50">
              {completion}
            </span>
          </ProgressRing>
          <ChevronRight className="h-5 w-5 text-ink-400 group-hover:text-theme group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}
