import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Plan,
  PlanExercise,
  PlanSet,
  TrainingLog,
  SetLog,
  SetStatus,
} from "@/types";
import { getExercise } from "@/data/exercises";
import { getThemeById } from "@/data/themes";

let idCounter = 0;
function uid(prefix = "id"): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

interface FitnessState {
  plans: Plan[];
  logs: TrainingLog[];
  themeId: string;
  whiteBg: boolean;

  // 主题相关
  setTheme: (themeId: string) => void;
  getTheme: () => ReturnType<typeof getThemeById>;
  toggleWhiteBg: () => void;

  // 计划相关
  addPlan: (plan: {
    name: string;
    muscleGroupId: string;
    scheduledDate: string;
    notes?: string;
    exercises: {
      exerciseId: string;
      exerciseName: string;
      sets: Omit<PlanSet, "id">[];
    }[];
  }) => string;
  updatePlan: (id: string, patch: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  duplicatePlan: (id: string, newDate?: string) => string | undefined;
  getPlansByDate: (date: string) => Plan[];
  getPlanById: (id: string) => Plan | undefined;

  // 训练日志相关
  getLogByPlanAndDate: (planId: string, date: string) => TrainingLog | undefined;
  setSetStatus: (
    planId: string,
    date: string,
    setId: string,
    status: SetStatus,
    actualReps?: number
  ) => void;
  ensureLog: (planId: string, date: string, plan: Plan) => TrainingLog;
}

export const useFitnessStore = create<FitnessState>()(
  persist(
    (set, get) => ({
      plans: [],
      logs: [],
      themeId: "volt",
      whiteBg: false,

      setTheme: (themeId) => {
        set({ themeId });
      },

      getTheme: () => {
        return getThemeById(get().themeId);
      },

      toggleWhiteBg: () => {
        set((s) => ({ whiteBg: !s.whiteBg }));
      },

      addPlan: (input) => {
        const id = uid("plan");
        const exercises: PlanExercise[] = input.exercises.map((ex) => ({
          id: uid("pex"),
          exerciseId: ex.exerciseId,
          exerciseName:
            ex.exerciseName ||
            getExercise(ex.exerciseId)?.name ||
            "未知动作",
          sets: ex.sets.map((s) => ({
            id: uid("set"),
            targetReps: s.targetReps,
            restSeconds: s.restSeconds,
          })),
        }));
        const plan: Plan = {
          id,
          name: input.name,
          muscleGroupId: input.muscleGroupId,
          scheduledDate: input.scheduledDate,
          notes: input.notes,
          exercises,
          createdAt: Date.now(),
        };
        set((state) => ({ plans: [...state.plans, plan] }));
        return id;
      },

      updatePlan: (id, patch) => {
        set((state) => ({
          plans: state.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
      },

      deletePlan: (id) => {
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== id),
          logs: state.logs.filter((l) => l.planId !== id),
        }));
      },

      duplicatePlan: (id, newDate) => {
        const origin = get().plans.find((p) => p.id === id);
        if (!origin) return undefined;
        const newId = uid("plan");
        const exercises: PlanExercise[] = origin.exercises.map((ex) => ({
          id: uid("pex"),
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          sets: ex.sets.map((s) => ({
            id: uid("set"),
            targetReps: s.targetReps,
            restSeconds: s.restSeconds,
          })),
        }));
        const copy: Plan = {
          ...origin,
          id: newId,
          createdAt: Date.now(),
          scheduledDate: newDate || origin.scheduledDate,
          name: `${origin.name} 副本`,
          exercises,
        };
        set((state) => ({ plans: [...state.plans, copy] }));
        return newId;
      },

      getPlansByDate: (date) => {
        return get()
          .plans.filter((p) => p.scheduledDate === date)
          .sort((a, b) => a.createdAt - b.createdAt);
      },

      getPlanById: (id) => {
        return get().plans.find((p) => p.id === id);
      },

      getLogByPlanAndDate: (planId, date) => {
        return get().logs.find(
          (l) => l.planId === planId && l.date === date
        );
      },

      ensureLog: (planId, date, plan) => {
        const existing = get().logs.find(
          (l) => l.planId === planId && l.date === date
        );
        if (existing) return existing;

        const allSetIds = plan.exercises.flatMap((ex) => ex.sets.map((s) => s.id));
        const setLogs: SetLog[] = allSetIds.map((setId) => ({
          setId,
          status: "pending" as SetStatus,
          completion: 0,
        }));
        const newLog: TrainingLog = {
          id: uid("log"),
          planId,
          date,
          setLogs,
          updatedAt: Date.now(),
        };
        set((state) => ({ logs: [...state.logs, newLog] }));
        return newLog;
      },

      setSetStatus: (planId, date, setId, status, actualReps) => {
        const state = get();
        const plan = state.plans.find((p) => p.id === planId);
        if (!plan) return;

        // 确保日志存在
        get().ensureLog(planId, date, plan);

        const completion =
          status === "completed"
            ? 100
            : status === "partial"
            ? 50
            : status === "skipped"
            ? 0
            : 0;

        set((s) => ({
          logs: s.logs.map((l) => {
            if (l.planId !== planId || l.date !== date) return l;
            const setLogs = l.setLogs.some((sl) => sl.setId === setId)
              ? l.setLogs.map((sl) =>
                  sl.setId === setId
                    ? { ...sl, status, completion, actualReps }
                    : sl
                )
              : [
                  ...l.setLogs,
                  {
                    setId,
                    status,
                    completion,
                    actualReps,
                  } as SetLog,
                ];
            return { ...l, setLogs, updatedAt: Date.now() };
          }),
        }));
      },
    }),
    {
      name: "fitness-app-storage",
      version: 1,
    }
  )
);
