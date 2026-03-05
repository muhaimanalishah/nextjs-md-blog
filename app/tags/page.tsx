import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Tags",
  description: "Browse all topics covered on miloasdev.",
  openGraph: {
    title: "All Tags — miloasdev",
    description: "Browse all topics covered on miloasdev.",
    type: "website",
  },
};

export default async function TagsPage() {
  const allPosts = await getAllPosts();
  const tagCounts: Record<string, number> = {};

  allPosts.forEach((post) => {
    post.metadata.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="container max-w-4xl py-12 md:py-24">
      <div className="mb-12 flex flex-col gap-4 text-center">
        <h1 className="font-serif text-4xl font-black tracking-tight lg:text-5xl">
          Browse by Tags
        </h1>
        <p className="text-muted-foreground text-xl">
          Explore posts by the topics that interest you most.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {sortedTags.map(([tag, count]) => (
          <Link key={tag} href={`/tags/${tag}`}>
            <Badge
              variant="secondary"
              className="hover:bg-primary hover:text-primary-foreground cursor-pointer gap-2 rounded-none px-4 py-2 text-lg transition-colors"
            >
              {tag}{" "}
              <span className="text-muted-foreground text-sm font-normal">
                ({count})
              </span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
