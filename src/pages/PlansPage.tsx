import { useMemo, useState } from "react";
import { Plus, ListTodo, Filter } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PlanCard from "@/components/PlanCard";
import PlanEditorDrawer, {
  type PlanFormValue,
} from "@/components/PlanEditorDrawer";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useFitnessStore } from "@/store/useFitnessStore";
import { MUSCLE_GROUPS } from "@/data/exercises";
import type { Plan } from "@/types";
import { cn } from "@/lib/utils";

export default function PlansPage() {
  const plans = useFitnessStore((s) => s.plans);
  const addPlan = useFitnessStore((s) => s.addPlan);
  const updatePlan = useFitnessStore((s) => s.updatePlan);
  const deletePlan = useFitnessStore((s) => s.deletePlan);
  const duplicatePlan = useFitnessStore((s) => s.duplicatePlan);
  const getLogByPlanAndDate = useFitnessStore((s) => s.getLogByPlanAndDate);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);
  const [filterMuscle, setFilterMuscle] = useState<string>("all");

  const filteredPlans = useMemo(() => {
    const sorted = [...plans].sort((a, b) => {
      // 按日期升序，未过期优先
      if (a.scheduledDate !== b.scheduledDate) {
        return a.scheduledDate < b.scheduledDate ? -1 : 1;
      }
      return a.createdAt - b.createdAt;
    });
    if (filterMuscle === "all") return sorted;
    return sorted.filter((p) => p.muscleGroupId === filterMuscle);
  }, [plans, filterMuscle]);

  function openCreate() {
    setEditingPlan(null);
    setDrawerOpen(true);
  }

  function openEdit(plan: Plan) {
    setEditingPlan(plan);
    setDrawerOpen(true);
  }

  function handleSubmit(value: PlanFormValue) {
    if (editingPlan) {
      // 编辑：替换计划内容
      updatePlan(editingPlan.id, {
        name: value.name,
        muscleGroupId: value.muscleGroupId,
        scheduledDate: value.scheduledDate,
        notes: value.notes,
        exercises: value.exercises.map((ex) => ({
          id: ex.id,
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          sets: ex.sets.map((s) => ({
            id: s.id,
            targetReps: s.targetReps,
            restSeconds: s.restSeconds,
          })),
        })),
      });
    } else {
      addPlan({
        name: value.name,
        muscleGroupId: value.muscleGroupId,
        scheduledDate: value.scheduledDate,
        notes: value.notes,
        exercises: value.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          sets: ex.sets.map((s) => ({
            targetReps: s.targetReps,
            restSeconds: s.restSeconds,
          })),
        })),
      });
    }
    setDrawerOpen(false);
    setEditingPlan(null);
  }

  function handleDuplicate(plan: Plan) {
    duplicatePlan(plan.id);
  }

  function handleDeleteConfirm() {
    if (deleteTarget) {
      deletePlan(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  // 肌肉群筛选统计
  const filterCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of plans) {
      counts.set(p.muscleGroupId, (counts.get(p.muscleGroupId) || 0) + 1);
    }
    return counts;
  }, [plans]);

  return (
    <div>
      <PageHeader
        eyebrow="PLAN MANAGER"
        title="计划"
        subtitle="按肌肉群管理训练计划，细化到每个动作与组数"
        actions={
          <button onClick={openCreate} className="btn-volt">
            <Plus className="h-4 w-4" />
            新建计划
          </button>
        }
      />

      {/* 肌肉群筛选 */}
      {plans.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-ink-400 flex-shrink-0">
            <Filter className="h-3.5 w-3.5" />
            筛选
          </div>
          <button
            onClick={() => setFilterMuscle("all")}
            className={cn(
              "chip flex-shrink-0 transition-colors",
              filterMuscle === "all"
                ? "bg-volt text-ink-950"
                : "bg-ink-800 text-ink-300 hover:bg-ink-700"
            )}
          >
            全部
            <span className="opacity-60">{plans.length}</span>
          </button>
          {MUSCLE_GROUPS.filter((g) => filterCounts.get(g.id) > 0).map((g) => {
            const selected = filterMuscle === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setFilterMuscle(g.id)}
                className={cn(
                  "chip flex-shrink-0 transition-colors",
                  selected ? "text-ink-950" : "bg-ink-800 text-ink-300 hover:bg-ink-700"
                )}
                style={
                  selected
                    ? { backgroundColor: g.color }
                    : { borderColor: `${g.color}40`, border: `1px solid ${g.color}40` }
                }
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: selected ? "#0A0A0B" : g.color }}
                />
                {g.name}
                <span className="opacity-60">{filterCounts.get(g.id)}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 计划列表 */}
      {plans.length === 0 ? (
        <div className="surface rounded-2xl">
          <EmptyState
            icon={<ListTodo className="h-6 w-6" />}
            title="还没有训练计划"
            description="点击新建计划，按肌肉群组织你的训练，细化到每个动作与组数"
            action={
              <button onClick={openCreate} className="btn-volt">
                <Plus className="h-4 w-4" />
                创建第一个计划
              </button>
            }
          />
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="surface rounded-2xl">
          <EmptyState
            icon={<Filter className="h-6 w-6" />}
            title="未匹配到计划"
            description="当前筛选条件下没有计划，试试切换其他肌肉群"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPlans.map((plan) => {
            const log = getLogByPlanAndDate(plan.id, plan.scheduledDate);
            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                log={log}
                onEdit={() => openEdit(plan)}
                onDelete={() => setDeleteTarget(plan)}
                onDuplicate={() => handleDuplicate(plan)}
              />
            );
          })}
        </div>
      )}

      <PlanEditorDrawer
        open={drawerOpen}
        initial={editingPlan}
        onClose={() => {
          setDrawerOpen(false);
          setEditingPlan(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={`删除计划「${deleteTarget?.name}」`}
        description="删除后无法恢复，对应的训练记录也会一并清除。"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
