import { Clock } from "lucide-react";

interface ReadingTimeProps {
  minutes: number;
  className?: string;
}

export function ReadingTime({ minutes, className }: ReadingTimeProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Clock className="w-4 h-4" />
      <span>{minutes} min read</span>
    </div>
  );
}
