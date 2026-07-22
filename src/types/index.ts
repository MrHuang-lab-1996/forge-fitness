// 肌肉群
export interface MuscleGroup {
  id: string;
  name: string; // 胸肌 / 背部 / 肩部 ...
  abbr: string; // CHST / BACK / SHLD ...
  color: string; // hex 色值
}

// 预置动作
export interface Exercise {
  id: string;
  name: string;
  muscleGroupId: string;
}

// 训练计划中的单组配置
export interface PlanSet {
  id: string;
  targetReps: number;
  restSeconds: number;
}

// 训练计划中的单个动作
export interface PlanExercise {
  id: string;
  exerciseId: string;
  exerciseName: string; // 冗余存储，避免动作库变更影响历史
  sets: PlanSet[];
}

// 训练计划
export interface Plan {
  id: string;
  name: string; // 计划名 e.g. "推日 A"
  muscleGroupId: string;
  scheduledDate: string; // YYYY-MM-DD
  notes?: string;
  exercises: PlanExercise[];
  createdAt: number;
}

// 单组训练记录的状态
export type SetStatus = "completed" | "partial" | "skipped" | "pending";

// 单组训练记录
export interface SetLog {
  setId: string; // 对应 PlanSet.id
  status: SetStatus;
  completion: number; // 0-100
  actualReps?: number;
}

// 训练完成记录（按日期 + 计划）
export interface TrainingLog {
  id: string;
  planId: string;
  date: string; // YYYY-MM-DD
  setLogs: SetLog[];
  updatedAt: number;
}
