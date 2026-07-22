import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      <div className="h-14 w-14 rounded-full bg-ink-800 border border-ink-600 flex items-center justify-center text-ink-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-ink-100">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-ink-400 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
