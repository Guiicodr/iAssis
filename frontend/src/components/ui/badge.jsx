import { cn } from "@/lib/utils";

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-[#e5e7eb] text-[#374151]",
    success: "bg-[#d1fae5] text-[#065f46]",
    warning: "bg-[#fef3c7] text-[#92400e]",
    danger: "bg-[#fce4ec] text-[#c62828]",
    info: "bg-[#dbeafe] text-[#1e40af]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}
export { Badge };