import { getAllPosts } from "@/lib/posts";
import { InfinitePostList } from "@/components/InfinitePostList";
import { Metadata } from "next";

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

  return (
    <div className="container max-w-4xl py-12 md:py-24">
      <div className="flex flex-col gap-4 mb-12">
        <p className="text-sm font-medium text-primary uppercase tracking-wider">
          Topic
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl capitalize">
          {tag}
        </h1>
        <p className="text-xl text-muted-foreground">
          Found {filteredPosts.length} post
          {filteredPosts.length === 1 ? "" : "s"} specialized in this topic.
        </p>
      </div>

      <InfinitePostList initialPosts={filteredPosts} />
    </div>
  );
}
