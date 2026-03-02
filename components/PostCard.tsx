import Link from "next/link";
import { Post } from "@/lib/posts";
import { ReadingTime } from "./ReadingTime";
import { Badge } from "./ui/badge";
import { TagBadge } from "./TagBadge";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group relative flex flex-col space-y-3 rounded-2xl border bg-card p-6 transition-all hover:bg-accent/50 hover:shadow-lg dark:hover:bg-accent/20">
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
        <time dateTime={post.metadata.date}>
          {new Date(post.metadata.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
        <ReadingTime minutes={post.readingTime} />
      </div>

      <div className="space-y-2">
        <Link href={`/blog/${post.slug}`} className="block">
          <h2 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
            {post.metadata.title}
          </h2>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
          {post.metadata.excerpt}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        {post.metadata.tags.slice(0, 3).map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
        {post.hasUrdu && (
          <Badge
            variant="outline"
            className="ml-auto text-primary border-primary/20 bg-primary/5"
          >
            Urdu Available
          </Badge>
        )}
      </div>
    </article>
  );
}
