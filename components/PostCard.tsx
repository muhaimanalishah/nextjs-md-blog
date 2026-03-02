import Link from "next/link";
import { Post } from "@/lib/posts";
import { ReadingTime } from "./ReadingTime";
import { Badge } from "./ui/badge";
import { TagBadge } from "./TagBadge";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const coverUrl = post.metadata.cover
    ? `/api/posts/${post.folder}/${post.metadata.cover.replace(/^\.\//, "")}`
    : null;

  return (
    <article className="group relative flex flex-col space-y-3 rounded-none border border-border bg-card p-6 transition-all hover:bg-accent/5 hover:shadow-sm dark:hover:bg-accent/10">
      {coverUrl && (
        <div className="aspect-[21/9] w-full overflow-hidden bg-muted -mx-6 -mt-6 rounded-none border-b mb-6">
          <img
            src={coverUrl}
            alt={post.metadata.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground/70 font-semibold tracking-wider uppercase mb-2">
        <time dateTime={post.metadata.date}>
          {new Date(post.metadata.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
        <ReadingTime minutes={post.readingTime} />
      </div>

      <div className="space-y-3">
        <Link href={`/blog/${post.slug}`} className="block group/title">
          <h2 className="text-3xl font-black tracking-tight group-hover/title:text-primary transition-colors leading-tight">
            {post.metadata.title}
          </h2>
        </Link>
        <p className="line-clamp-3 text-base text-muted-foreground/80 leading-relaxed max-w-2xl">
          {post.metadata.excerpt}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-6">
        {post.metadata.tags.slice(0, 3).map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
        {post.hasUrdu && (
          <Badge
            variant="outline"
            className="ml-auto text-primary border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-none"
          >
            Urdu Available
          </Badge>
        )}
      </div>
    </article>
  );
}
