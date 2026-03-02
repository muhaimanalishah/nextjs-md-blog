import { Post } from "@/lib/posts";

interface InfinitePostListProps {
  initialPosts: Post[];
}

export function InfinitePostList({ initialPosts }: InfinitePostListProps) {
  return (
    <div className="space-y-8">
      {initialPosts.map((post) => (
        <div key={post.slug} className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold">{post.metadata.title}</h2>
          <p className="text-muted-foreground">{post.metadata.excerpt}</p>
        </div>
      ))}
      <div className="pt-8 text-center text-sm text-muted-foreground">
        More posts coming soon...
      </div>
    </div>
  );
}
