import { getAllPosts } from "@/lib/posts";
import { InfinitePostList } from "@/components/InfinitePostList";
import { Metadata } from "next";
import { TagBadge } from "@/components/TagBadge";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.metadata.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).map((tag) => ({
    tag,
  }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Posts tagged with "${tag}"`,
    description: `All blog posts categorized under the tag "${tag}".`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const allPosts = await getAllPosts();
  const filteredPosts = allPosts.filter((post) =>
    post.metadata.tags.includes(tag),
  );

  const initialPosts = filteredPosts.slice(0, 10);

  return (
    <div className="container max-w-4xl py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-4 mb-12">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">Tagged with:</span>
          <TagBadge tag={tag} />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl capitalize">
          {tag}
        </h1>
        <p className="text-xl text-muted-foreground">
          Found {filteredPosts.length} article
          {filteredPosts.length === 1 ? "" : "s"} specialized in this topic.
        </p>
      </div>

      <InfinitePostList initialPosts={initialPosts} tag={tag} />
    </div>
  );
}
