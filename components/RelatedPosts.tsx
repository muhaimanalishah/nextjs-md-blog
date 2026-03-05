import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/posts";

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="border-border/50 mt-16 border-t pt-12">
      <p className="text-muted-foreground/60 mb-8 font-sans text-[10px] font-bold tracking-[0.3em] uppercase">
        Related Posts
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const coverUrl = post.metadata.cover
            ? `/posts/${post.folder}/${post.metadata.cover.replace(/^\.\//, "")}`
            : null;

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group border-border hover:border-primary/40 flex flex-col border transition-all duration-300"
            >
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

              <div className="border-border/40 flex flex-col gap-2 border-t p-4">
                <div className="flex flex-wrap gap-1.5">
                  {post.metadata.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-none px-2 py-1 text-xs"
                    >
                      <span>#</span>
                      <span className="capitalize">{tag}</span>
                    </span>
                  ))}
                </div>
                <h3 className="group-hover:text-primary line-clamp-2 font-serif text-base leading-snug font-black tracking-tight transition-colors">
                  {post.metadata.title}.
                </h3>
                <div className="text-muted-foreground/60 flex items-center gap-2 font-sans text-[10px] font-bold tracking-widest uppercase">
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
