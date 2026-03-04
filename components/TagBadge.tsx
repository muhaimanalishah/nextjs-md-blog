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
        className="hover:bg-primary hover:text-primary-foreground flex cursor-pointer items-center gap-1.5 rounded-none py-1 transition-all"
      >
        <span>#</span>
        <span className="capitalize">{tag}</span>
        {count !== undefined && (
          <span className="ml-0.5 text-[10px] opacity-60">({count})</span>
        )}
      </Badge>
    </Link>
  );
}
