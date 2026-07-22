import { getMuscleGroup } from "@/data/exercises";
import { cn } from "@/lib/utils";

interface MuscleBadgeProps {
  muscleGroupId: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

export default function MuscleBadge({
  muscleGroupId,
  size = "md",
  showName = true,
  className,
}: MuscleBadgeProps) {
  const group = getMuscleGroup(muscleGroupId);
  if (!group) return null;

  const sizeMap = {
    sm: { box: "h-6 w-6 text-[10px]", text: "text-xs" },
    md: { box: "h-8 w-8 text-[11px]", text: "text-sm" },
    lg: { box: "h-10 w-10 text-xs", text: "text-base" },
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-md font-display font-bold tracking-tight",
          sizeMap[size].box
        )}
        style={{
          backgroundColor: `${group.color}1F`,
          color: group.color,
          border: `1px solid ${group.color}40`,
        }}
        title={group.name}
      >
        {group.abbr}
      </div>
      {showName && (
        <span className={cn("font-medium text-ink-100", sizeMap[size].text)}>
          {group.name}
        </span>
      )}
    </div>
  );
}
