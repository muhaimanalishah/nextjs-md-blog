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
    <div className="mt-16 flex flex-col items-stretch gap-4 border-t py-12 sm:flex-row">
      <div className="flex-1">
        {older ? (
          <Link
            href={`/blog/${older.slug}`}
            className="group hover:bg-accent/50 flex h-full flex-col items-start gap-2 rounded-none border p-6 transition-all"
          >
            <span className="text-muted-foreground flex items-center gap-1 font-sans text-xs font-semibold tracking-widest uppercase">
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
              Older Post
            </span>
            <span className="group-hover:text-primary text-base font-black transition-colors">
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
            className="group hover:bg-accent/50 flex h-full flex-col items-end gap-2 rounded-none border p-6 text-right transition-all"
          >
            <span className="text-muted-foreground flex items-center gap-1 font-sans text-xs font-semibold tracking-widest uppercase">
              Newer Post
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="group-hover:text-primary text-base font-black transition-colors">
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
