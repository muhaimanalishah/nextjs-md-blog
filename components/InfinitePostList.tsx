"use client";

import * as React from "react";
import { Post } from "@/lib/posts";
import { PostCard } from "./PostCard";
import { Loader2, LayoutGrid, List as ListIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface InfinitePostListProps {
  initialPosts: Post[];
  tag?: string;
}

export function InfinitePostList({ initialPosts, tag }: InfinitePostListProps) {
  const [posts, setPosts] = React.useState<Post[]>(initialPosts);
  const [page, setPage] = React.useState(2);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(initialPosts.length >= 10);
  const [layout, setLayout] = React.useState<"list" | "grid">("grid");
  const [error, setError] = React.useState(false);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  const fetchMorePosts = React.useCallback(async () => {
    if (loading || !hasMore) return;

    setError(false);
    setLoading(true);
    try {
      const prefix = tag ? `posts-${tag}` : "posts";
      const res = await fetch(`/api/${prefix}-${page}.json`);
      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, tag, page]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [fetchMorePosts, hasMore, loading]);

  return (
    <div className="flex flex-col gap-10">
      {/* Toolbar */}
      <div className="border-border flex items-center justify-between border-b pb-4">
        <span className="text-muted-foreground font-sans text-[10px] font-bold tracking-[0.3em] uppercase">
          {posts.length} {posts.length === 1 ? "Post" : "Posts"}
        </span>

        <div className="border-border hidden items-center border sm:flex">
          <button
            onClick={() => setLayout("grid")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 font-sans text-[10px] font-bold tracking-widest uppercase transition-all",
              layout === "grid"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            )}
          >
            <LayoutGrid className="h-3 w-3" />
            Grid
          </button>
          <button
            onClick={() => setLayout("list")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 font-sans text-[10px] font-bold tracking-widest uppercase transition-all",
              layout === "list"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            )}
          >
            <ListIcon className="h-3 w-3" />
            List
          </button>
        </div>
      </div>

      <motion.div
        layout
        className={cn(
          "grid gap-6 md:gap-8",
          layout === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        )}
      >
        <AnimatePresence mode="popLayout">
          {posts.map((post) => (
            <motion.div
              layout
              key={post.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <PostCard post={post} layout={layout} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div
        ref={observerTarget}
        className="flex w-full flex-col items-center justify-center pt-4"
      >
        {error && (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Failed to load posts.{" "}
            <button onClick={fetchMorePosts} className="underline">
              Retry
            </button>
          </p>
        )}
        {loading && (
          <div className="flex items-center gap-2 py-8">
            <Loader2 className="text-primary h-4 w-4 animate-spin" />
            <span className="text-primary text-[10px] font-black tracking-widest uppercase">
              Loading
            </span>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="flex w-full items-center gap-4 py-12">
            <div className="bg-border/50 h-px flex-1" />
            <span className="text-muted-foreground/40 font-sans text-[10px] font-bold tracking-[0.3em] whitespace-nowrap uppercase">
              End of List
            </span>
            <div className="bg-border/50 h-px flex-1" />
          </div>
        )}
      </div>
    </div>
  );
}