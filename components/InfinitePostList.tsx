"use client";

import * as React from "react";
import { Post } from "@/lib/posts";
import { PostCard } from "./PostCard";
import { Loader2 } from "lucide-react";

interface InfinitePostListProps {
  initialPosts: Post[];
  tag?: string;
}

export function InfinitePostList({ initialPosts, tag }: InfinitePostListProps) {
  const [posts, setPosts] = React.useState<Post[]>(initialPosts);
  const [page, setPage] = React.useState(2);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(initialPosts.length >= 10);
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
      // In a real app we might want to show a toast here
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
    <div className="grid gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}

      <div
        ref={observerTarget}
        className="pt-8 flex flex-col items-center justify-center text-sm text-muted-foreground w-full"
      >
        {loading && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Loading more posts...</span>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <span className="opacity-60">You've reached the end! 🎉</span>
        )}
      </div>
    </div>
  );
}
