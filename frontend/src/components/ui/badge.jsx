import { cn } from "@/lib/utils";

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    danger: "bg-red-500/10 text-red-600 border border-red-500/20",
    info: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    amber: "bg-amber-100 text-amber-700 border border-amber-200",
    sage: "bg-primary/10 text-primary border border-primary/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}
export { Badge };