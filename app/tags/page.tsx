import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata() {
  return {
    title: "All Tags",
    description: "Browse all topics covered in the blog.",
  };
}

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
      <div className="flex flex-col gap-4 mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Browse by Tags
        </h1>
        <p className="text-xl text-muted-foreground">
          Explore posts by the topics that interest you most.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {sortedTags.map(([tag, count]) => (
          <Link key={tag} href={`/tags/${tag}`}>
            <Badge
              variant="secondary"
              className="text-lg py-2 px-4 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
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
