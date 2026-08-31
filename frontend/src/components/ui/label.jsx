import { cn } from "@/lib/utils";

function Label({ className, children, ...props }) {
  return (
    <label
      className={cn("text-sm font-medium text-foreground mb-1 block", className)}
      {...props}
    >
      {children}
    </label>
  );
}
export { Label };