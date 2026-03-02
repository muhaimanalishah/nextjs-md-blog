import Link from "next/link";
import { Badge } from "./ui/badge";

interface TagBadgeProps {
  tag: string;
  count?: number;
}

export function TagBadge({ tag, count }: TagBadgeProps) {
  return (
    <Link href={`/tags/${tag}`}>
      <Badge
        variant="secondary"
        className="hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer flex items-center gap-1.5 py-1"
      >
        <span>#</span>
        <span className="capitalize">{tag}</span>
        {count !== undefined && (
          <span className="text-[10px] opacity-60 ml-0.5">({count})</span>
        )}
      </Badge>
    </Link>
  );
}
