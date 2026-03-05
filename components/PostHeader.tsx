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
    ? `/posts/${post.folder}/${post.metadata.cover.replace(/^[\.\/]+/, "")}`
    : null;

  return (
    <header className="mx-auto mb-12 max-w-6xl md:mb-16">
      <div className="mb-8 space-y-6">
        <h1 className="text-foreground font-serif text-4xl leading-tight font-black tracking-tight md:text-5xl lg:text-6xl">
          {isUrdu && post.urMetadata.title
            ? post.urMetadata.title
            : post.metadata.title}
        </h1>

        <div className="text-muted-foreground/80 flex flex-wrap items-center gap-3 font-sans text-[10px] font-bold tracking-[0.2em] uppercase">
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
          <ReadingTime
            minutes={
              isUrdu && post.urReadingTime
                ? post.urReadingTime
                : post.readingTime
            }
          />
          {isUrdu && (
            <>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-primary">Roman Urdu</span>
            </>
          )}
        </div>

        {post.hasUrdu && (
          <div className="text-muted-foreground/80 w-full font-sans text-[10px] font-bold tracking-[0.2em] uppercase">
            <LangToggle hasUrdu={post.hasUrdu} />
          </div>
        )}

        <div className="border-border/50 flex flex-wrap gap-2 border-t pt-4">
          {post.metadata.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      {coverUrl && (
        <div className="border-border relative aspect-video w-full overflow-hidden border sm:aspect-21/9">
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
