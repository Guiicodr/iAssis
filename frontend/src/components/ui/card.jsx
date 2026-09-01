import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
  return (
    <div
      className={cn("bg-card text-card-foreground rounded-xl border border-border shadow-sm group-card", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn("px-5 py-3.5 border-b border-border", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return <div className={cn("px-5 py-2.5 border-t border-border", className)} {...props} />;
}

export { Card, CardHeader, CardContent, CardFooter };