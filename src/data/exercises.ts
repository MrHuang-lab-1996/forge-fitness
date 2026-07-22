import type { MuscleGroup, Exercise } from "@/types";

// 预置肌肉群
export const MUSCLE_GROUPS: MuscleGroup[] = [
  { id: "chest", name: "胸肌", abbr: "CHST", color: "#FF6B35" },
  { id: "back", name: "背部", abbr: "BACK", color: "#4ECDC4" },
  { id: "shoulders", name: "肩部", abbr: "SHLD", color: "#FFD23F" },
  { id: "arms", name: "手臂", abbr: "ARMS", color: "#C6FF3D" },
  { id: "legs", name: "腿部", abbr: "LEGS", color: "#FF5E8A" },
  { id: "core", name: "核心", abbr: "CORE", color: "#A78BFA" },
  { id: "glutes", name: "臀部", abbr: "GLUT", color: "#60A5FA" },
];

// 预置动作库
export const EXERCISES: Exercise[] = [
  // 胸肌
  { id: "ex_chest_1", name: "杠铃卧推", muscleGroupId: "chest" },
  { id: "ex_chest_2", name: "哑铃飞鸟", muscleGroupId: "chest" },
  { id: "ex_chest_3", name: "上斜哑铃推举", muscleGroupId: "chest" },
  { id: "ex_chest_4", name: "双杠臂屈伸", muscleGroupId: "chest" },
  { id: "ex_chest_5", name: "绳索夹胸", muscleGroupId: "chest" },
  // 背部
  { id: "ex_back_1", name: "引体向上", muscleGroupId: "back" },
  { id: "ex_back_2", name: "杠铃划船", muscleGroupId: "back" },
  { id: "ex_back_3", name: "高位下拉", muscleGroupId: "back" },
  { id: "ex_back_4", name: "坐姿划船", muscleGroupId: "back" },
  { id: "ex_back_5", name: "直臂下压", muscleGroupId: "back" },
  // 肩部
  { id: "ex_shld_1", name: "哑铃推举", muscleGroupId: "shoulders" },
  { id: "ex_shld_2", name: "侧平举", muscleGroupId: "shoulders" },
  { id: "ex_shld_3", name: "前平举", muscleGroupId: "shoulders" },
  { id: "ex_shld_4", name: "反向飞鸟", muscleGroupId: "shoulders" },
  { id: "ex_shld_5", name: "面拉", muscleGroupId: "shoulders" },
  // 手臂
  { id: "ex_arms_1", name: "杠铃弯举", muscleGroupId: "arms" },
  { id: "ex_arms_2", name: "哑铃锤式弯举", muscleGroupId: "arms" },
  { id: "ex_arms_3", name: "绳索下压", muscleGroupId: "arms" },
  { id: "ex_arms_4", name: "窄距俯卧撑", muscleGroupId: "arms" },
  { id: "ex_arms_5", name: "集中弯举", muscleGroupId: "arms" },
  // 腿部
  { id: "ex_legs_1", name: "杠铃深蹲", muscleGroupId: "legs" },
  { id: "ex_legs_2", name: "腿举", muscleGroupId: "legs" },
  { id: "ex_legs_3", name: "罗马尼亚硬拉", muscleGroupId: "legs" },
  { id: "ex_legs_4", name: "腿弯举", muscleGroupId: "legs" },
  { id: "ex_legs_5", name: "保加利亚分腿蹲", muscleGroupId: "legs" },
  // 核心
  { id: "ex_core_1", name: "平板支撑", muscleGroupId: "core" },
  { id: "ex_core_2", name: "卷腹", muscleGroupId: "core" },
  { id: "ex_core_3", name: "俄罗斯转体", muscleGroupId: "core" },
  { id: "ex_core_4", name: "悬垂举腿", muscleGroupId: "core" },
  { id: "ex_core_5", name: "山羊挺身", muscleGroupId: "core" },
  // 臀部
  { id: "ex_glutes_1", name: "臀桥", muscleGroupId: "glutes" },
  { id: "ex_glutes_2", name: "罗马尼亚硬拉", muscleGroupId: "glutes" },
  { id: "ex_glutes_3", name: "保加利亚分腿蹲", muscleGroupId: "glutes" },
  { id: "ex_glutes_4", name: "臀推", muscleGroupId: "glutes" },
  { id: "ex_glutes_5", name: "蛙泵", muscleGroupId: "glutes" },
];

export function getMuscleGroup(id: string): MuscleGroup | undefined {
  return MUSCLE_GROUPS.find((m) => m.id === id);
}

export function getExercisesByMuscleGroup(muscleGroupId: string): Exercise[] {
  return EXERCISES.filter((e) => e.muscleGroupId === muscleGroupId);
}

export function getExercise(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
