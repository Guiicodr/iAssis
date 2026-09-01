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
  return <div className={cn("px-6 py-4 border-b border-border", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("px-6 py-5", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return <div className={cn("px-6 py-3 border-t border-border", className)} {...props} />;
}

export { Card, CardHeader, CardContent, CardFooter };