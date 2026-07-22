import { Link } from "react-router-dom";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Copy, Pencil, Trash2, Dumbbell, Layers, ChevronRight } from "lucide-react";
import type { Plan, TrainingLog } from "@/types";
import MuscleBadge from "@/components/MuscleBadge";
import ProgressRing from "@/components/ProgressRing";
import { getMuscleGroup } from "@/data/exercises";
import {
  calcPlanCompletion,
  countCompletedSets,
  countPlanSets,
} from "@/utils/completion";

interface PlanCardProps {
  plan: Plan;
  log?: TrainingLog;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function PlanCard({
  plan,
  log,
  onEdit,
  onDelete,
  onDuplicate,
}: PlanCardProps) {
  const group = getMuscleGroup(plan.muscleGroupId);
  const completion = calcPlanCompletion(plan, log);
  const totalSets = countPlanSets(plan);
  const doneSets = countCompletedSets(plan, log);
  const date = new Date(plan.scheduledDate + "T00:00:00");

  return (
    <div className="surface rounded-xl overflow-hidden relative group">
      {/* 顶部色带 */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${group?.color}, ${group?.color}40)`,
        }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <MuscleBadge muscleGroupId={plan.muscleGroupId} size="sm" />
            <h3 className="text-xl font-semibold text-ink-50 mt-2 truncate">
              {plan.name}
            </h3>
            <div className="text-xs text-ink-400 mt-1">
              {format(date, "yyyy年M月d日 EEEE", { locale: zhCN })}
            </div>
          </div>
          <ProgressRing value={completion} size={48} stroke={4}>
            <span className="font-display text-xs text-ink-50">{completion}</span>
          </ProgressRing>
        </div>

        <div className="flex items-center gap-4 text-xs text-ink-300 mb-4">
          <span className="inline-flex items-center gap-1">
            <Dumbbell className="h-3.5 w-3.5" />
            {plan.exercises.length} 动作
          </span>
          <span className="inline-flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            {doneSets}/{totalSets} 组
          </span>
        </div>

        {/* 动作预览 */}
        <div className="space-y-1 mb-4">
          {plan.exercises.slice(0, 3).map((ex) => (
            <div
              key={ex.id}
              className="flex items-center justify-between text-xs text-ink-300"
            >
              <span className="truncate">{ex.exerciseName}</span>
              <span className="text-ink-400 ml-2 flex-shrink-0">
                {ex.sets.length} × {ex.sets[0]?.targetReps || 0}
              </span>
            </div>
          ))}
          {plan.exercises.length > 3 && (
            <div className="text-xs text-ink-500">
              +{plan.exercises.length - 3} 个动作
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 pt-3 border-t border-ink-700/60">
          <Link
            to={`/train/${plan.scheduledDate}`}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-theme hover:bg-theme/10 transition-colors"
          >
            开始训练
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={onEdit}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-300 hover:bg-ink-700 hover:text-ink-50 transition-colors"
            title="编辑"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDuplicate}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-300 hover:bg-ink-700 hover:text-ink-50 transition-colors"
            title="复制"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-300 hover:bg-ember/10 hover:text-ember transition-colors"
            title="删除"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
