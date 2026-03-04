import { Clock } from "lucide-react";

interface ReadingTimeProps {
  minutes: number;
  className?: string;
}

export function ReadingTime({ minutes, className }: ReadingTimeProps) {
  return (
    <div
      className={`text-muted-foreground flex items-center gap-1.5 font-sans text-[10px] font-bold tracking-widest uppercase ${className}`}
    >
      <Clock className="h-3 w-3" />
      <span>{minutes} min read</span>
    </div>
  );
}
