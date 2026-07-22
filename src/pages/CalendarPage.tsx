import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarDays, Plus, Flame } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import CalendarGrid from "@/components/CalendarGrid";
import TodayPlanCard from "@/components/TodayPlanCard";
import EmptyState from "@/components/EmptyState";
import { useFitnessStore } from "@/store/useFitnessStore";
import {
  calcPlanCompletion,
  countCompletedSets,
  countPlanSets,
} from "@/utils/completion";

export default function CalendarPage() {
  const plans = useFitnessStore((s) => s.plans);
  const logs = useFitnessStore((s) => s.logs);
  const getPlansByDate = useFitnessStore((s) => s.getPlansByDate);
  const getLogByPlanAndDate = useFitnessStore((s) => s.getLogByPlanAndDate);

  const [cursor, setCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 当月统计
  const monthStats = useMemo(() => {
    const monthPrefix = format(cursor, "yyyy-MM");
    const monthPlans = plans.filter((p) => p.scheduledDate.startsWith(monthPrefix));
    const trainDays = new Set(monthPlans.map((p) => p.scheduledDate)).size;
    const totalSets = monthPlans.reduce((n, p) => n + countPlanSets(p), 0);

    let completedSets = 0;
    let completionSum = 0;
    let completionCount = 0;
    for (const p of monthPlans) {
      const log = logs.find((l) => l.planId === p.id && l.date === p.scheduledDate);
      completedSets += countCompletedSets(p, log);
      if (countPlanSets(p) > 0) {
        completionSum += calcPlanCompletion(p, log);
        completionCount += 1;
      }
    }
    const avgCompletion = completionCount === 0 ? 0 : Math.round(completionSum / completionCount);

    return { trainDays, totalSets, completedSets, avgCompletion };
  }, [plans, logs, cursor]);

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const todayPlans = getPlansByDate(selectedDateStr);

  return (
    <div>
      <PageHeader
        eyebrow="TRAINING DASHBOARD"
        title="日历"
        subtitle="按月查看训练计划与完成情况，点击日期查看当日训练详情"
        actions={
          <Link to="/plans" className="btn-volt">
            <Plus className="h-4 w-4" />
            新建计划
          </Link>
        }
      />

      {/* 顶部统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="本月训练日"
          value={monthStats.trainDays}
          unit="天"
          accent="volt"
        />
        <StatCard
          label="计划总组数"
          value={monthStats.totalSets}
          unit="组"
        />
        <StatCard
          label="已完成组数"
          value={monthStats.completedSets}
          unit="组"
          accent="volt"
        />
        <StatCard
          label="平均完成度"
          value={monthStats.avgCompletion}
          unit="%"
          accent={monthStats.avgCompletion >= 80 ? "volt" : "ember"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 月历 */}
        <div className="lg:col-span-3">
          <CalendarGrid
            cursor={cursor}
            selectedDate={selectedDate}
            plans={plans}
            logs={logs}
            onCursorChange={setCursor}
            onSelectedChange={setSelectedDate}
          />
        </div>

        {/* 当日计划列表 */}
        <div className="lg:col-span-2">
          <div className="surface rounded-2xl p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-400">
                  选中日期
                </div>
                <div className="font-display text-2xl tracking-wider text-ink-50 mt-1">
                  {format(selectedDate, "M月d日", { locale: zhCN })}
                </div>
                <div className="text-xs text-ink-400 mt-0.5">
                  {format(selectedDate, "EEEE", { locale: zhCN })}
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-ink-800 border border-ink-600 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-ink-300" />
              </div>
            </div>

            {todayPlans.length === 0 ? (
              <EmptyState
                icon={<Flame className="h-6 w-6" />}
                title="今日休息"
                description="选中日期暂无训练计划，去计划页添加一个吧"
                action={
                  <Link to="/plans" className="btn-ghost text-sm">
                    <Plus className="h-4 w-4" />
                    添加计划
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {todayPlans.map((plan) => {
                  const log = getLogByPlanAndDate(plan.id, selectedDateStr);
                  return (
                    <TodayPlanCard
                      key={plan.id}
                      plan={plan}
                      log={log}
                      date={selectedDate}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
