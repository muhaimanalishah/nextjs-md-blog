"use client";

import * as React from "react";
import { Post } from "@/lib/posts";
import { PostCard } from "./PostCard";
import { Loader2, LayoutGrid, List as ListIcon } from "lucide-react";
import { Button } from "./ui/button";
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
  const [layout, setLayout] = React.useState<"list" | "grid">("list");
  const observerTarget = React.useRef<HTMLDivElement>(null);

  const fetchMorePosts = React.useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const url = new URL("/api/posts", window.location.origin);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", "10");
      if (tag) {
        url.searchParams.set("tag", tag);
      }

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();

      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, tag, loading, hasMore]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMorePosts();
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchMorePosts, hasMore, loading]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
          Viewing {posts.length} {posts.length === 1 ? "Post" : "Posts"}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLayout("list")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 transition-all text-[10px] font-sans font-bold uppercase tracking-widest",
              layout === "list"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ListIcon className="h-3 w-3" />
            <span>Compact</span>
          </button>
          <button
            onClick={() => setLayout("grid")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 transition-all text-[10px] font-sans font-bold uppercase tracking-widest",
              layout === "grid"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LayoutGrid className="h-3 w-3" />
            <span>Grid</span>
          </button>
        </div>
      </div>

      <motion.div
        layout
        className={cn(
          "grid gap-6 md:gap-10",
          layout === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1",
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
        className="pt-8 flex flex-col items-center justify-center text-sm text-muted-foreground w-full"
      >
        {loading && (
          <div className="flex items-center gap-2 py-8">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-[10px] uppercase font-black tracking-widest text-primary">
              Loading
            </span>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="flex items-center gap-4 w-full py-12">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-muted-foreground/30 whitespace-nowrap">
              End of List
            </span>
            <div className="h-px flex-1 bg-border/50" />
          </div>
        )}
      </div>
    </div>
  );
}
