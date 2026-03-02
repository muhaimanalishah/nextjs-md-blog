import Link from "next/link";
import { Post } from "@/lib/posts";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PostNavigationProps {
  older: Post | null;
  newer: Post | null;
}

export function PostNavigation({ older, newer }: PostNavigationProps) {
  if (!older && !newer) return null;

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-4 py-12 border-t mt-16">
      <div className="flex-1">
        {older && (
          <Link
            href={`/blog/${older.slug}`}
            className="group flex flex-col items-start gap-2 p-4 rounded-xl border hover:bg-accent/50 transition-all h-full"
          >
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Older Post
            </span>
            <span className="text-sm font-medium leading-relaxed group-hover:text-primary transition-colors">
              {older.metadata.title}
            </span>
          </Link>
        )}
      </div>
      <div className="flex-1">
        {newer && (
          <Link
            href={`/blog/${newer.slug}`}
            className="group flex flex-col items-end gap-2 p-4 rounded-xl border hover:bg-accent/50 transition-all text-right h-full"
          >
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Newer Post
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="text-sm font-medium leading-relaxed group-hover:text-primary transition-colors">
              {newer.metadata.title}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
