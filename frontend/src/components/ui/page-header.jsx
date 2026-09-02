import { cn } from "@/lib/utils";

function PageHeader({ eyebrow, title, subtitle, children, className }) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6", className)}>
      <div className="space-y-1 animate-fade-in-up">
        {eyebrow && (
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 animate-fade-in">{children}</div>
      )}
    </div>
  );
}

export { PageHeader };