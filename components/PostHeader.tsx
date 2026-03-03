import { Post } from "@/lib/posts";
import { ReadingTime } from "./ReadingTime";
import { LangToggle } from "./LangToggle";
import { TagBadge } from "./TagBadge";

interface PostHeaderProps {
  post: Post;
  isUrdu?: boolean;
}

export function PostHeader({ post, isUrdu = false }: PostHeaderProps) {
  const coverUrl = post.metadata.cover
    ? `/api/posts/${post.folder}/${post.metadata.cover.replace(/^\.\//, "")}`
    : null;

  return (
    <header className="mb-12 md:mb-16">
      <div className="space-y-6 mb-8 text-left">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight text-foreground">
          {isUrdu && post.metadata.titleUrdu
            ? post.metadata.titleUrdu
            : post.metadata.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/80">
          <time dateTime={post.metadata.date}>
            {new Date(post.metadata.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span className="text-muted-foreground/30">•</span>
          <ReadingTime minutes={post.readingTime} />
          {isUrdu && (
            <>
              <span className="text-muted-foreground/30">•</span>
              <span className="text-primary">Roman Urdu</span>
            </>
          )}

          <div className="flex gap-2 ml-auto">
            <LangToggle hasUrdu={post.hasUrdu} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
          {post.metadata.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      {coverUrl && (
        <div className="w-full aspect-[21/9] overflow-hidden rounded-none border border-border">
          <img
            src={coverUrl}
            alt={post.metadata.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </header>
  );
}
