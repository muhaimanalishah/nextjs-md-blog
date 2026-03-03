import Link from "next/link";
import { Post } from "@/lib/posts";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PostNavigationProps {
  older: Post | null;
  newer: Post | null;
}

export function PostNavigation({ older, newer }: PostNavigationProps) {
  if (!older && !newer) return null;

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-4 py-12 border-t mt-16">
      <div className="flex-1">
        {older ? (
          <Link
            href={`/blog/${older.slug}`}
            className="group flex flex-col items-start gap-2 p-6 rounded-none border hover:bg-accent/50 transition-all h-full"
          >
            <span className="text-xs text-muted-foreground font-sans font-semibold uppercase tracking-widest flex items-center gap-1">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Older Post
            </span>
            <span className="text-base font-black group-hover:text-primary transition-colors">
              {older.metadata.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
      <div className="flex-1">
        {newer ? (
          <Link
            href={`/blog/${newer.slug}`}
            className="group flex flex-col items-end gap-2 p-6 rounded-none border hover:bg-accent/50 transition-all text-right h-full"
          >
            <span className="text-xs text-muted-foreground font-sans font-semibold uppercase tracking-widest flex items-center gap-1">
              Newer Post
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-base font-black group-hover:text-primary transition-colors">
              {newer.metadata.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
