import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
  return (
    <div
      className={cn("bg-white rounded-xl border border-[#e5e7eb] shadow-sm", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn("px-6 py-4 border-b border-[#e5e7eb]", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("px-6 py-5", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return <div className={cn("px-6 py-3 border-t border-[#e5e7eb]", className)} {...props} />;
}

export { Card, CardHeader, CardContent, CardFooter };