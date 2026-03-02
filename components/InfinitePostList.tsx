import { Post } from "@/lib/posts";
import { PostCard } from "./PostCard";

interface InfinitePostListProps {
  initialPosts: Post[];
}

export function InfinitePostList({ initialPosts }: InfinitePostListProps) {
  return (
    <div className="grid gap-6">
      {initialPosts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
      <div className="pt-8 text-center text-sm text-muted-foreground">
        More posts coming soon...
      </div>
    </div>
  );
}
