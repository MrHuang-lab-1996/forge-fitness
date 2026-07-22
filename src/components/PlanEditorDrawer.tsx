import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { X, Plus, Trash2, GripVertical, ChevronDown, Search } from "lucide-react";
import type { Plan } from "@/types";
import { MUSCLE_GROUPS, getExercisesByMuscleGroup } from "@/data/exercises";
import { cn } from "@/lib/utils";

interface EditorExercise {
  id: string; // local id
  exerciseId: string;
  exerciseName: string;
  sets: { id: string; targetReps: number; restSeconds: number }[];
}

export interface PlanFormValue {
  name: string;
  muscleGroupId: string;
  scheduledDate: string;
  notes: string;
  exercises: EditorExercise[];
}

interface PlanEditorDrawerProps {
  open: boolean;
  initial?: Plan | null;
  onClose: () => void;
  onSubmit: (value: PlanFormValue) => void;
}

let uidCounter = 0;
function localUid(prefix: string) {
  uidCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${uidCounter}`;
}

function emptyExercise(muscleGroupId: string): EditorExercise {
  const exercises = getExercisesByMuscleGroup(muscleGroupId);
  const first = exercises[0];
  return {
    id: localUid("ex"),
    exerciseId: first?.id || "",
    exerciseName: first?.name || "",
    sets: [
      { id: localUid("set"), targetReps: 10, restSeconds: 60 },
    ],
  };
}

function planToForm(plan: Plan): PlanFormValue {
  return {
    name: plan.name,
    muscleGroupId: plan.muscleGroupId,
    scheduledDate: plan.scheduledDate,
    notes: plan.notes || "",
    exercises: plan.exercises.map((ex) => ({
      id: ex.id,
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      sets: ex.sets.map((s) => ({
        id: s.id,
        targetReps: s.targetReps,
        restSeconds: s.restSeconds,
      })),
    })),
  };
}

function emptyForm(): PlanFormValue {
  const today = format(new Date(), "yyyy-MM-dd");
  return {
    name: "",
    muscleGroupId: "chest",
    scheduledDate: today,
    notes: "",
    exercises: [emptyExercise("chest")],
  };
}

export default function PlanEditorDrawer({
  open,
  initial,
  onClose,
  onSubmit,
}: PlanEditorDrawerProps) {
  const [form, setForm] = useState<PlanFormValue>(emptyForm);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showExercisePicker, setShowExercisePicker] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      const next = initial ? planToForm(initial) : emptyForm();
      setForm(next);
      setExpandedId(next.exercises[0]?.id || null);
      setShowExercisePicker(null);
      setSearchTerm("");
      setSubmitError("");
    }
  }, [open, initial]);

  // 切换肌肉群时，清空不匹配的动作
  function changeMuscleGroup(id: string) {
    setForm((f) => {
      const validExercises = getExercisesByMuscleGroup(id);
      const filtered = f.exercises.filter((ex) =>
        validExercises.some((e) => e.id === ex.exerciseId)
      );
      const next = filtered.length > 0 ? filtered : [emptyExercise(id)];
      return { ...f, muscleGroupId: id, exercises: next };
    });
  }

  function addExercise() {
    setForm((f) => {
      const ex = emptyExercise(f.muscleGroupId);
      setExpandedId(ex.id);
      return { ...f, exercises: [...f.exercises, ex] };
    });
  }

  function removeExercise(id: string) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.filter((e) => e.id !== id),
    }));
  }

  function updateExercise(id: string, patch: Partial<EditorExercise>) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    }));
  }

  function addSet(exerciseId: string) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((e) =>
        e.id === exerciseId
          ? {
              ...e,
              sets: [
                ...e.sets,
                {
                  id: localUid("set"),
                  targetReps: e.sets[e.sets.length - 1]?.targetReps || 10,
                  restSeconds: e.sets[e.sets.length - 1]?.restSeconds || 60,
                },
              ],
            }
          : e
      ),
    }));
  }

  function updateSet(
    exerciseId: string,
    setId: string,
    patch: Partial<{ targetReps: number; restSeconds: number }>
  ) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((e) =>
        e.id === exerciseId
          ? {
              ...e,
              sets: e.sets.map((s) =>
                s.id === setId ? { ...s, ...patch } : s
              ),
            }
          : e
      ),
    }));
  }

  function removeSet(exerciseId: string, setId: string) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((e) =>
        e.id === exerciseId
          ? { ...e, sets: e.sets.filter((s) => s.id !== setId) }
          : e
      ),
    }));
  }

  function pickExercise(
    targetExerciseId: string,
    exerciseId: string,
    exerciseName: string
  ) {
    updateExercise(targetExerciseId, { exerciseId, exerciseName });
    setShowExercisePicker(null);
    setSearchTerm("");
  }

  const [submitError, setSubmitError] = useState("");

  function handleSubmit() {
    if (!form.name.trim()) {
      setSubmitError("请输入计划名称");
      return;
    }
    if (form.exercises.length === 0) {
      setSubmitError("请至少添加一个动作");
      return;
    }
    setSubmitError("");
    onSubmit({
      ...form,
      name: form.name.trim(),
      exercises: form.exercises.filter((e) => e.exerciseId),
    });
  }

  const filteredExercises = getExercisesByMuscleGroup(form.muscleGroupId).filter(
    (e) => e.name.includes(searchTerm.trim())
  );

  const isEdit = !!initial;
  const totalSets = form.exercises.reduce((n, e) => n + e.sets.length, 0);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative h-full w-full max-w-xl bg-ink-900 border-l border-ink-700 flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
          >
            {/* 顶部 */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-ink-700">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-volt">
                  {isEdit ? "EDIT PLAN" : "NEW PLAN"}
                </div>
                <h2 className="font-display text-2xl tracking-wider text-ink-50 mt-1">
                  {isEdit ? "编辑计划" : "新建训练计划"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-lg border border-ink-600 flex items-center justify-center text-ink-300 hover:bg-ink-700 hover:text-ink-50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 表单内容 */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-6">
              {/* 计划名 */}
              <div>
                <label className="label-base">
                  计划名称 <span className="text-ember normal-case">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, name: e.target.value }));
                    if (submitError) setSubmitError("");
                  }}
                  placeholder="例如：推日 A、腿部轰炸"
                  className={cn("input-base", submitError && !form.name.trim() && "border-ember/60")}
                  maxLength={40}
                  autoFocus
                />
              </div>

              {/* 肌肉群选择 */}
              <div>
                <label className="label-base">目标肌肉群</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MUSCLE_GROUPS.map((g) => {
                    const selected = form.muscleGroupId === g.id;
                    return (
                      <button
                        key={g.id}
                        onClick={() => changeMuscleGroup(g.id)}
                        className={cn(
                          "relative rounded-lg p-3 border transition-all text-left",
                          selected
                            ? "border-transparent"
                            : "border-ink-600 hover:border-ink-500 bg-ink-800"
                        )}
                        style={
                          selected
                            ? {
                                backgroundColor: `${g.color}1A`,
                                border: `1px solid ${g.color}`,
                              }
                            : undefined
                        }
                      >
                        <div
                          className="font-display text-sm font-bold tracking-wider"
                          style={{ color: selected ? g.color : "#9A9AA0" }}
                        >
                          {g.abbr}
                        </div>
                        <div
                          className={cn(
                            "text-xs mt-0.5",
                            selected ? "text-ink-100" : "text-ink-400"
                          )}
                        >
                          {g.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 日期 */}
              <div>
                <label className="label-base">训练日期</label>
                <input
                  type="date"
                  value={form.scheduledDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, scheduledDate: e.target.value }))
                  }
                  className="input-base"
                />
              </div>

              {/* 动作配置 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="label-base mb-0">
                    动作与组数 · {form.exercises.length} 个动作 / {totalSets} 组
                  </label>
                  <button
                    onClick={addExercise}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-volt hover:text-volt-dark transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    添加动作
                  </button>
                </div>

                <div className="space-y-2">
                  {form.exercises.map((ex, idx) => {
                    const expanded = expandedId === ex.id;
                    const isPicking = showExercisePicker === ex.id;
                    return (
                      <div
                        key={ex.id}
                        className="rounded-lg border border-ink-600 bg-ink-850 overflow-hidden"
                      >
                        <div className="flex items-center gap-2 p-3">
                          <GripVertical className="h-4 w-4 text-ink-500 flex-shrink-0" />
                          <button
                            onClick={() =>
                              setExpandedId(expanded ? null : ex.id)
                            }
                            className="flex-1 flex items-center gap-2 text-left min-w-0"
                          >
                            <span className="text-[10px] font-bold text-ink-500 w-4">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm font-medium text-ink-50 truncate">
                              {ex.exerciseName || "选择动作"}
                            </span>
                            <span className="text-xs text-ink-400 ml-auto flex-shrink-0">
                              {ex.sets.length} 组
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-ink-400 transition-transform",
                                expanded && "rotate-180"
                              )}
                            />
                          </button>
                          <button
                            onClick={() => removeExercise(ex.id)}
                            className="h-7 w-7 inline-flex items-center justify-center rounded text-ink-400 hover:text-ember hover:bg-ember/10 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {expanded && (
                          <div className="px-3 pb-3 border-t border-ink-700 pt-3">
                            {/* 动作选择器 */}
                            <div className="mb-3">
                              <button
                                onClick={() =>
                                  setShowExercisePicker(isPicking ? null : ex.id)
                                }
                                className="w-full text-left text-xs font-semibold text-volt hover:text-volt-dark"
                              >
                                {isPicking ? "收起动作列表" : "更换动作 →"}
                              </button>
                            </div>

                            {isPicking && (
                              <div className="mb-3">
                                <div className="relative mb-2">
                                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-400" />
                                  <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                      setSearchTerm(e.target.value)
                                    }
                                    placeholder="搜索动作..."
                                    className="w-full pl-8 pr-3 py-2 text-xs rounded-md bg-ink-900 border border-ink-600 text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-volt/60"
                                  />
                                </div>
                                <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                                  {filteredExercises.map((e) => (
                                    <button
                                      key={e.id}
                                      onClick={() =>
                                        pickExercise(ex.id, e.id, e.name)
                                      }
                                      className={cn(
                                        "text-left px-3 py-2 rounded text-xs transition-colors",
                                        ex.exerciseId === e.id
                                          ? "bg-volt/15 text-volt"
                                          : "text-ink-200 hover:bg-ink-700"
                                      )}
                                    >
                                      {e.name}
                                    </button>
                                  ))}
                                  {filteredExercises.length === 0 && (
                                    <div className="text-xs text-ink-500 px-3 py-2">
                                      未找到匹配动作
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* 组数列表 */}
                            <div className="space-y-1.5">
                              <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold uppercase tracking-wider text-ink-400 px-1">
                                <div className="col-span-2">组</div>
                                <div className="col-span-4">目标次数</div>
                                <div className="col-span-4">休息(秒)</div>
                                <div className="col-span-2 text-right">操作</div>
                              </div>
                              {ex.sets.map((s, sIdx) => (
                                <div
                                  key={s.id}
                                  className="grid grid-cols-12 gap-2 items-center"
                                >
                                  <div className="col-span-2 text-sm font-display text-ink-200">
                                    {String(sIdx + 1).padStart(2, "0")}
                                  </div>
                                  <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={s.targetReps}
                                    onChange={(e) =>
                                      updateSet(ex.id, s.id, {
                                        targetReps: Math.max(
                                          1,
                                          parseInt(e.target.value) || 1
                                        ),
                                      })
                                    }
                                    className="col-span-4 rounded-md bg-ink-900 border border-ink-600 px-2 py-1.5 text-sm text-ink-50 focus:outline-none focus:border-volt/60"
                                  />
                                  <input
                                    type="number"
                                    min={0}
                                    max={600}
                                    step={15}
                                    value={s.restSeconds}
                                    onChange={(e) =>
                                      updateSet(ex.id, s.id, {
                                        restSeconds: Math.max(
                                          0,
                                          parseInt(e.target.value) || 0
                                        ),
                                      })
                                    }
                                    className="col-span-4 rounded-md bg-ink-900 border border-ink-600 px-2 py-1.5 text-sm text-ink-50 focus:outline-none focus:border-volt/60"
                                  />
                                  <button
                                    onClick={() => removeSet(ex.id, s.id)}
                                    disabled={ex.sets.length <= 1}
                                    className="col-span-2 h-7 inline-flex items-center justify-center rounded text-ink-400 hover:text-ember hover:bg-ember/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed justify-self-end"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addSet(ex.id)}
                                className="w-full mt-1 py-1.5 rounded-md border border-dashed border-ink-600 text-xs text-ink-300 hover:border-volt/50 hover:text-volt transition-colors inline-flex items-center justify-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                添加一组
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {form.exercises.length === 0 && (
                    <div className="rounded-lg border border-dashed border-ink-600 p-6 text-center text-sm text-ink-400">
                      点击"添加动作"开始构建训练计划
                    </div>
                  )}
                </div>
              </div>

              {/* 备注 */}
              <div>
                <label className="label-base">备注（可选）</label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="训练要点、目标重量、注意事项..."
                  rows={3}
                  className="input-base resize-none"
                  maxLength={200}
                />
              </div>
            </div>

            {/* 底部操作 */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-ink-700 flex flex-col gap-2 bg-ink-900">
              {submitError && (
                <div className="text-xs text-ember font-medium px-1">
                  {submitError}
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-ink-400">
                  {form.exercises.length} 动作 · {totalSets} 组
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={onClose} className="btn-ghost">
                    取消
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn-volt"
                  >
                    {isEdit ? "保存修改" : "创建计划"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
