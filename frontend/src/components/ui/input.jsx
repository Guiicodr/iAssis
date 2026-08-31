import { cn } from "@/lib/utils";

function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
        "transition-colors",
        className
      )}
      {...props}
    />
  );
}
export { Input };