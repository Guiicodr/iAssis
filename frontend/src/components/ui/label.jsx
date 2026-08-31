import { cn } from "@/lib/utils";

function Label({ className, children, ...props }) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-[#374151] mb-1 block",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
export { Label };