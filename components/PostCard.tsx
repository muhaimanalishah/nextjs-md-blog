import Link from "next/link";
import { Post } from "@/lib/posts";
import { ReadingTime } from "./ReadingTime";
import { Badge } from "./ui/badge";
import { TagBadge } from "./TagBadge";

interface PostCardProps {
  post: Post;
  layout?: "list" | "grid";
}

export function PostCard({ post, layout = "list" }: PostCardProps) {
  const coverUrl = post.metadata.cover
    ? `/api/posts/${post.folder}/${post.metadata.cover.replace(/^\.\//, "")}`
    : null;

  if (layout === "list") {
    return (
      <article className="group relative flex flex-col sm:flex-row gap-6 rounded-none border-b border-border/50 py-10 transition-all hover:bg-accent/5 items-start sm:items-center">
        {coverUrl && (
          <div className="aspect-[16/9] sm:aspect-square w-full sm:w-40 xl:w-48 shrink-0 overflow-hidden bg-muted rounded-none border border-border">
            <img
              src={coverUrl}
              alt={post.metadata.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">
            <time dateTime={post.metadata.date}>
              {new Date(post.metadata.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>

          <Link href={`/blog/${post.slug}`} className="block group/title mb-2">
            <h2 className="text-xl md:text-2xl font-serif font-black tracking-tight group-hover/title:text-primary transition-colors leading-tight">
              {post.metadata.title}.
            </h2>
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground/70 leading-relaxed max-w-2xl mb-4 group-hover:text-muted-foreground transition-colors">
            {post.metadata.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {post.metadata.tags.slice(0, 2).map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
            <ReadingTime minutes={post.readingTime} />
            {post.hasUrdu && (
              <Badge
                variant="outline"
                className="ml-auto text-primary border-primary/20 bg-primary/5 px-2 py-0 border-none text-[8px] font-black uppercase tracking-widest rounded-none"
              >
                Urdu
              </Badge>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col h-full bg-card p-0 transition-all">
      {coverUrl && (
        <div className="aspect-[16/10] w-full overflow-hidden bg-muted border border-border">
          <img
            src={coverUrl}
            alt={post.metadata.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 py-6 px-4 border-b border-border/50 group-hover:bg-accent/5 transition-colors">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-4">
          <time dateTime={post.metadata.date}>
            {new Date(post.metadata.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
          <ReadingTime minutes={post.readingTime} />
        </div>

        <div className="space-y-3 mb-6 flex-1">
          <Link href={`/blog/${post.slug}`} className="block group/title">
            <h2 className="text-xl font-serif font-black tracking-tight group-hover/title:text-primary transition-colors leading-tight line-clamp-2">
              {post.metadata.title}.
            </h2>
          </Link>
          <p className="line-clamp-3 text-sm text-muted-foreground/70 leading-relaxed group-hover:text-muted-foreground transition-colors">
            {post.metadata.excerpt}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-4 mt-auto">
          {post.metadata.tags.slice(0, 2).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {post.hasUrdu && (
            <Badge
              variant="outline"
              className="ml-auto text-primary border-none bg-primary/5 px-2 py-0 text-[8px] font-black uppercase tracking-widest rounded-none"
            >
              Urdu
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
