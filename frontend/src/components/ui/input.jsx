import { cn } from "@/lib/utils";

function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 rounded-lg border border-[#d1d5db] bg-white text-sm text-[#374151] placeholder-[#9ca3af]",
        "focus:outline-none focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]",
        "transition-colors",
        className
      )}
      {...props}
    />
  );
}
export { Input };