import { getAllPosts } from "@/lib/posts";
import { InfinitePostList } from "@/components/InfinitePostList";

export default async function Home() {
  const allPosts = await getAllPosts();
  const initialPosts = allPosts.slice(0, 10);

  return (
    <div className="container max-w-4xl py-12 md:py-24">
      <div className="flex flex-col gap-4 mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to the Blog
        </h1>
        <p className="text-xl text-muted-foreground">
          Exploring the latest in web development, bilingual architecture, and
          more.
        </p>
      </div>

      <InfinitePostList initialPosts={initialPosts} />
    </div>
  );
}
