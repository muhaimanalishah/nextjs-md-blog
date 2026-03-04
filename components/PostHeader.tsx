import { Post } from "@/lib/posts";
import { ReadingTime } from "./ReadingTime";
import { LangToggle } from "./LangToggle";
import { TagBadge } from "./TagBadge";
import Image from "next/image";

interface PostHeaderProps {
  post: Post;
  isUrdu?: boolean;
}

export function PostHeader({ post, isUrdu = false }: PostHeaderProps) {
  const coverUrl = post.metadata.cover
    ? `/api/posts/${post.folder}/${post.metadata.cover}`
    : null;

  return (
    <header className="mb-12 md:mb-16 max-w-6xl mx-auto">
      <div className="space-y-6 mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight text-foreground">
          {isUrdu && post.urMetadata.title
            ? post.urMetadata.title
            : post.metadata.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-muted-foreground/80">
          <span>{post.metadata.author}</span>
          <span className="text-muted-foreground/30">·</span>
          <time dateTime={post.metadata.date}>
            {new Date(post.metadata.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span className="text-muted-foreground/30">·</span>
          <ReadingTime minutes={post.readingTime} />
          {isUrdu && (
            <>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-primary">Roman Urdu</span>
            </>
          )}
        </div>

        {post.hasUrdu && (
          <div className="w-full text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-muted-foreground/80">
            <LangToggle hasUrdu={post.hasUrdu} />
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
          {post.metadata.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      {coverUrl && (
        <div className="relative w-full aspect-video sm:aspect-21/9 overflow-hidden border border-border">
          <Image
            src={coverUrl}
            alt={post.metadata.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
    </header>
  );
}
