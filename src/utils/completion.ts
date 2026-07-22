import type { Plan, TrainingLog, SetLog } from "@/types";

/** 计算单条日志的完成度 (0-100) */
export function calcLogCompletion(log: TrainingLog | undefined): number {
  if (!log || log.setLogs.length === 0) return 0;
  const total = log.setLogs.reduce((sum, s) => sum + s.completion, 0);
  return Math.round(total / log.setLogs.length);
}

/** 计算单条计划在指定日期的完成度 (0-100) */
export function calcPlanCompletion(
  plan: Plan,
  log: TrainingLog | undefined
): number {
  const totalSets = plan.exercises.reduce((n, ex) => n + ex.sets.length, 0);
  if (totalSets === 0) return 0;
  if (!log) return 0;
  return calcLogCompletion(log);
}

/** 计算多组计划的总完成度 */
export function calcOverallCompletion(
  plans: Plan[],
  logs: TrainingLog[]
): number {
  if (plans.length === 0) return 0;
  let sum = 0;
  let count = 0;
  for (const plan of plans) {
    const totalSets = plan.exercises.reduce((n, ex) => n + ex.sets.length, 0);
    if (totalSets === 0) continue;
    const log = logs.find((l) => l.planId === plan.id);
    sum += calcPlanCompletion(plan, log);
    count += 1;
  }
  return count === 0 ? 0 : Math.round(sum / count);
}

/** 获取某计划的总组数 */
export function countPlanSets(plan: Plan): number {
  return plan.exercises.reduce((n, ex) => n + ex.sets.length, 0);
}

/** 获取某计划在指定日志下已完成的组数 */
export function countCompletedSets(
  plan: Plan,
  log: TrainingLog | undefined
): number {
  if (!log) return 0;
  return log.setLogs.filter(
    (s) => s.status === "completed" || s.status === "partial"
  ).length;
}

/** 根据 SetLog 状态获取中文标签 */
export function statusLabel(status: SetLog["status"]): string {
  switch (status) {
    case "completed":
      return "已完成";
    case "partial":
      return "部分完成";
    case "skipped":
      return "跳过";
    case "pending":
    default:
      return "待完成";
  }
}
