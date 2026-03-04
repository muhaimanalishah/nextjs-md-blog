import { Clock } from "lucide-react";

interface ReadingTimeProps {
  minutes: number;
  className?: string;
}

export function ReadingTime({ minutes, className }: ReadingTimeProps) {
  return (
    <div
      className={`flex items-center font-sans text-[10px] font-bold uppercase tracking-widest text-muted-foreground gap-1.5 ${className}`}
    >
      <Clock className="w-3 h-3" />
      <span>{minutes} min read</span>
    </div>
  );
}
