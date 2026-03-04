import Link from "next/link";
import { Post } from "@/lib/posts";
import { ReadingTime } from "./ReadingTime";
import { Badge } from "./ui/badge";
import { TagBadge } from "./TagBadge";
import Image from "next/image";

interface PostCardProps {
  post: Post;
  layout?: "list" | "grid";
}

export function PostCard({ post, layout = "list" }: PostCardProps) {
  const coverUrl = post.metadata.cover
    ? `/posts/${post.folder}/${post.metadata.cover.replace(/^\.\//, "")}`
    : null;

  if (layout === "list") {
    return (
      <article className="group relative flex flex-row gap-6 border-b border-border/50 py-8 transition-all duration-300 px-4 hover:bg-muted/50 items-center">
        {coverUrl && (
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 overflow-hidden bg-muted border border-border">
            <Image
              src={coverUrl}
              alt={post.metadata.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-sans font-bold uppercase tracking-widest mb-2">
            <time dateTime={post.metadata.date}>
              {new Date(post.metadata.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span className="text-muted-foreground/30">·</span>
            <ReadingTime minutes={post.readingTime} />
          </div>

          <Link href={`/blog/${post.slug}`} className="block group/title mb-2">
            <h2 className="text-lg sm:text-xl font-serif font-black tracking-tight group-hover/title:text-primary transition-colors leading-snug">
              {post.metadata.title}.
            </h2>
          </Link>

          <p className="hidden sm:block line-clamp-2 text-sm text-muted-foreground/70 leading-relaxed max-w-2xl mb-3">
            {post.metadata.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {post.metadata.tags.slice(0, 2).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {post.hasUrdu && (
              <Badge
                variant="outline"
                className="ml-auto text-primary border-none bg-primary/5 px-2 py-1 text-[8px] font-sans font-bold uppercase tracking-widest rounded-none"
              >
                Urdu
              </Badge>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Grid layout
  return (
    <article className="group relative flex flex-col h-full border border-border transition-all duration-300 hover:border-primary/40 hover:shadow-sm">
      {coverUrl && (
        <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
          <Image
            src={coverUrl}
            alt={post.metadata.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-sans font-bold uppercase tracking-widest mb-3">
          <time dateTime={post.metadata.date}>
            {new Date(post.metadata.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
          <span className="text-muted-foreground/30">·</span>
          <ReadingTime minutes={post.readingTime} />
        </div>

        <div className="flex-1 space-y-2 mb-4">
          <Link href={`/blog/${post.slug}`} className="block group/title">
            <h2 className="text-lg font-serif font-black tracking-tight group-hover/title:text-primary transition-colors leading-snug line-clamp-2">
              {post.metadata.title}.
            </h2>
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground/70 leading-relaxed">
            {post.metadata.excerpt}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3 mt-auto border-t border-border/40">
          {post.metadata.tags.slice(0, 2).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {post.hasUrdu && (
            <Badge
              variant="outline"
              className="ml-auto text-primary border-none bg-primary/5 px-2 py-1 text-[8px] font-sans font-bold uppercase tracking-widest rounded-none"
            >
              Urdu
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
