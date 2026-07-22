import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  ArrowLeft,
  ChevronRight,
  Dumbbell,
  Layers,
  Flame,
  Clock,
  CalendarDays,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ProgressRing from "@/components/ProgressRing";
import MuscleBadge from "@/components/MuscleBadge";
import EmptyState from "@/components/EmptyState";
import SetStatusControl from "@/components/SetStatusControl";
import { useFitnessStore } from "@/store/useFitnessStore";
import { getMuscleGroup } from "@/data/exercises";
import {
  calcPlanCompletion,
  countCompletedSets,
  countPlanSets,
} from "@/utils/completion";
import type { SetStatus } from "@/types";

export default function TrainingPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const logs = useFitnessStore((s) => s.logs);
  const getPlansByDate = useFitnessStore((s) => s.getPlansByDate);
  const getLogByPlanAndDate = useFitnessStore((s) => s.getLogByPlanAndDate);
  const setSetStatus = useFitnessStore((s) => s.setSetStatus);

  const dateObj = useMemo(() => {
    if (!date) return new Date();
    try {
      return parseISO(date);
    } catch {
      return new Date();
    }
  }, [date]);

  const dateStr = format(dateObj, "yyyy-MM-dd");
  const dayPlans = getPlansByDate(dateStr);

  // 当日整体完成度
  const overallCompletion = useMemo(() => {
    if (dayPlans.length === 0) return 0;
    const sum = dayPlans.reduce((acc, p) => {
      const log = logs.find((l) => l.planId === p.id && l.date === dateStr);
      return acc + calcPlanCompletion(p, log);
    }, 0);
    return Math.round(sum / dayPlans.length);
  }, [dayPlans, logs, dateStr]);

  const totalSets = dayPlans.reduce((n, p) => n + countPlanSets(p), 0);
  const doneSets = dayPlans.reduce((n, p) => {
    const log = logs.find((l) => l.planId === p.id && l.date === dateStr);
    return n + countCompletedSets(p, log);
  }, 0);

  function handleStatusChange(
    planId: string,
    setId: string,
    status: SetStatus,
    actualReps?: number
  ) {
    setSetStatus(planId, dateStr, setId, status, actualReps);
  }

  return (
    <div>
      <button
        onClick={() => navigate("/calendar")}
        className="inline-flex items-center gap-1.5 text-sm text-ink-300 hover:text-theme transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        返回日历
      </button>

      <PageHeader
        eyebrow="TRAINING SESSION"
        title={format(dateObj, "M月d日", { locale: zhCN })}
        subtitle={`${format(dateObj, "EEEE", { locale: zhCN })} · ${
          dayPlans.length > 0 ? `${dayPlans.length} 个训练计划` : "今日休息"
        }`}
      />

      {dayPlans.length === 0 ? (
        <div className="surface rounded-2xl">
          <EmptyState
            icon={<CalendarDays className="h-6 w-6" />}
            title="今日无训练计划"
            description="去计划页添加一个训练计划，或选择其他日期"
            action={
              <Link to="/plans" className="btn-volt">
                添加计划
              </Link>
            }
          />
        </div>
      ) : (
        <>
          {/* 顶部总览 */}
          <div className="surface rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-6">
              <ProgressRing
                value={overallCompletion}
                size={96}
                stroke={8}
                color={overallCompletion >= 100 ? "#C6FF3D" : "#FF6B35"}
              >
                <div className="text-center">
                  <div className="font-display text-2xl text-ink-50 leading-none">
                    {overallCompletion}
                  </div>
                  <div className="text-[10px] text-ink-400 mt-0.5">完成度</div>
                </div>
              </ProgressRing>

              <div className="flex-1 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                    计划
                  </div>
                  <div className="font-display text-3xl text-ink-50 mt-1">
                    {dayPlans.length}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                    完成组数
                  </div>
                  <div className="font-display text-3xl text-theme mt-1">
                    {doneSets}
                    <span className="text-base text-ink-400">/{totalSets}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                    状态
                  </div>
                  <div className="mt-1.5">
                    {overallCompletion >= 100 ? (
                      <span className="chip bg-theme/15 text-theme border border-theme/30">
                        <Flame className="h-3 w-3" />
                        全部完成
                      </span>
                    ) : overallCompletion > 0 ? (
                      <span className="chip bg-ember/15 text-ember border border-ember/30">
                        <Clock className="h-3 w-3" />
                        训练中
                      </span>
                    ) : (
                      <span className="chip bg-ink-700 text-ink-300">
                        待开始
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 计划与动作列表 */}
          <div className="space-y-6">
            {dayPlans.map((plan) => {
              const group = getMuscleGroup(plan.muscleGroupId);
              const log = getLogByPlanAndDate(plan.id, dateStr);
              const planCompletion = calcPlanCompletion(plan, log);
              // 若无日志，构造一个全 pending 的临时日志用于展示
              const ensuredLog =
                log || {
                  id: "temp",
                  planId: plan.id,
                  date: dateStr,
                  updatedAt: 0,
                  setLogs: plan.exercises.flatMap((ex) =>
                    ex.sets.map((s) => ({
                      setId: s.id,
                      status: "pending" as const,
                      completion: 0,
                    }))
                  ),
                };

              return (
                <div
                  key={plan.id}
                  className="surface rounded-2xl overflow-hidden"
                >
                  {/* 计划头 */}
                  <div className="flex items-center justify-between p-5 border-b border-ink-700/60">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-12 w-1 rounded-full"
                        style={{ backgroundColor: group?.color }}
                      />
                      <div className="min-w-0">
                        <MuscleBadge
                          muscleGroupId={plan.muscleGroupId}
                          size="sm"
                        />
                        <h2 className="text-xl font-semibold text-ink-50 mt-1.5 truncate">
                          {plan.name}
                        </h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                          完成度
                        </div>
                        <div className="font-display text-2xl text-ink-50">
                          {planCompletion}
                          <span className="text-sm text-ink-400">%</span>
                        </div>
                      </div>
                      <ProgressRing value={planCompletion} size={48} stroke={4}>
                        <span className="font-display text-xs text-ink-50">
                          {planCompletion}
                        </span>
                      </ProgressRing>
                    </div>
                  </div>

                  {/* 备注 */}
                  {plan.notes && (
                    <div className="px-5 py-3 bg-ink-850/50 border-b border-ink-700/60 text-sm text-ink-300">
                      <span className="text-ink-400 mr-2">备注:</span>
                      {plan.notes}
                    </div>
                  )}

                  {/* 动作列表 */}
                  <div className="divide-y divide-ink-700/60">
                    {plan.exercises.map((ex, exIdx) => {
                      const exSets = ex.sets;
                      const exDone = exSets.filter((s) => {
                        const sl = ensuredLog.setLogs.find(
                          (l) => l.setId === s.id
                        );
                        return (
                          sl?.status === "completed" ||
                          sl?.status === "partial"
                        );
                      }).length;

                      return (
                        <div key={ex.id} className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="font-display text-lg text-ink-500">
                                {String(exIdx + 1).padStart(2, "0")}
                              </span>
                              <h3 className="text-base font-semibold text-ink-50 truncate">
                                {ex.exerciseName}
                              </h3>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-ink-400 flex-shrink-0">
                              <span className="inline-flex items-center gap-1">
                                <Layers className="h-3.5 w-3.5" />
                                {exDone}/{exSets.length} 组
                              </span>
                            </div>
                          </div>

                          {/* 表头 */}
                          <div className="grid grid-cols-12 gap-2 items-center px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                            <div className="col-span-2">组</div>
                            <div className="col-span-3">目标</div>
                            <div className="col-span-3">实际</div>
                            <div className="col-span-4 text-right">状态</div>
                          </div>

                          {/* 各组状态 */}
                          <div className="space-y-0.5">
                            {exSets.map((s, sIdx) => {
                              const sl = ensuredLog.setLogs.find(
                                (l) => l.setId === s.id
                              );
                              return (
                                <SetStatusControl
                                  key={s.id}
                                  setNumber={sIdx + 1}
                                  targetReps={s.targetReps}
                                  restSeconds={s.restSeconds}
                                  log={sl}
                                  onStatusChange={(status, actualReps) =>
                                    handleStatusChange(
                                      plan.id,
                                      s.id,
                                      status,
                                      actualReps
                                    )
                                  }
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部导航 */}
          <div className="mt-6 flex items-center justify-between">
            <Link to="/calendar" className="btn-ghost">
              <ArrowLeft className="h-4 w-4" />
              返回日历
            </Link>
            <Link to="/plans" className="btn-ghost">
              <Dumbbell className="h-4 w-4" />
              管理计划
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
