import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8",
        className
      )}
    >
      <div>
        {eyebrow && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-volt mb-2">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-5xl md:text-6xl leading-none tracking-wider text-ink-50">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-ink-300 text-sm md:text-base max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
