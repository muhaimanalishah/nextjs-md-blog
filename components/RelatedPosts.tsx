import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/posts";

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-border/50">
      <p className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mb-8">
        Related Posts
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const coverUrl = post.metadata.cover
            ? `/posts/${post.folder}/${post.metadata.cover}`
            : null;

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col border border-border hover:border-primary/40 transition-all duration-300"
            >
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

              <div className="flex flex-col gap-2 p-4 border-t border-border/40">
                <div className="flex flex-wrap gap-1.5">
                  {post.metadata.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-none"
                    >
                      <span>#</span>
                      <span className="capitalize">{tag}</span>
                    </span>
                  ))}
                </div>
                <h3 className="text-base font-serif font-black tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {post.metadata.title}.
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground/60">
                  <span>{post.metadata.author}</span>
                  <span className="text-muted-foreground/30">·</span>
                  <time dateTime={post.metadata.date}>
                    {new Date(post.metadata.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
