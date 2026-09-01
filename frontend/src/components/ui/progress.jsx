import { cn } from "@/lib/utils";

function Progress({ value, className, ...props }) {
  const pct = Math.min(Math.max(value || 0, 0), 100);
  return (
    <div
      className={cn("h-2 w-full rounded-full bg-muted overflow-hidden", className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div
        className="h-full rounded-full bg-primary progress-bar-primary"
        style={{ "--progress-pct": `${pct}%` }}
      />
    </div>
  );
}

export { Progress };