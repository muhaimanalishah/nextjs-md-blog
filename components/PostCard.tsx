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
      <article className="group border-border/50 hover:bg-muted/50 relative flex flex-row items-center gap-6 border-b px-4 py-8 transition-all duration-300">
        {coverUrl && (
          <div className="bg-muted border-border relative h-24 w-24 shrink-0 overflow-hidden border sm:h-32 sm:w-32">
            <Image
              src={coverUrl}
              alt={post.metadata.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="text-muted-foreground mb-2 flex items-center gap-2 font-sans text-[10px] font-bold tracking-widest uppercase">
            <span>{post.metadata.author}</span>
            <span className="text-muted-foreground/30">·</span>
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

          <Link href={`/blog/${post.slug}`} className="group/title mb-2 block">
            <h2 className="group-hover/title:text-primary font-serif text-lg leading-snug font-black tracking-tight transition-colors sm:text-xl">
              {post.metadata.title}.
            </h2>
          </Link>

          <p className="text-muted-foreground/70 mb-3 line-clamp-2 hidden max-w-2xl text-sm leading-relaxed sm:block">
            {post.metadata.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {post.metadata.tags.slice(0, 2).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {post.hasUrdu && (
              <Badge
                variant="outline"
                className="text-primary bg-primary/5 ml-auto rounded-none border-none px-2 py-1 font-sans text-[8px] font-bold tracking-widest uppercase"
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
    <article className="group border-border hover:border-primary/40 relative flex h-full flex-col border transition-all duration-300 hover:shadow-sm">
      {coverUrl && (
        <div className="bg-muted relative aspect-16/10 w-full overflow-hidden">
          <Image
            src={coverUrl}
            alt={post.metadata.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="text-muted-foreground mb-3 flex items-center gap-2 font-sans text-[10px] font-bold tracking-widest uppercase">
          <span>{post.metadata.author}</span>
          <span className="text-muted-foreground/30">·</span>
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

        <div className="mb-4 flex-1 space-y-2">
          <Link href={`/blog/${post.slug}`} className="group/title block">
            <h2 className="group-hover/title:text-primary line-clamp-2 font-serif text-lg leading-snug font-black tracking-tight transition-colors">
              {post.metadata.title}.
            </h2>
          </Link>
          <p className="text-muted-foreground/70 line-clamp-2 text-sm leading-relaxed">
            {post.metadata.excerpt}
          </p>
        </div>

        <div className="border-border/40 mt-auto flex flex-wrap items-center gap-2 border-t pt-3">
          {post.metadata.tags.slice(0, 2).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {post.hasUrdu && (
            <Badge
              variant="outline"
              className="text-primary bg-primary/5 ml-auto rounded-none border-none px-2 py-1 font-sans text-[8px] font-bold tracking-widest uppercase"
            >
              Urdu
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
