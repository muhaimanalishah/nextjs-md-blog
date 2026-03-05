import { getAllPosts } from "@/lib/posts";
import { InfinitePostList } from "@/components/InfinitePostList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Exploring the latest in web development, bilingual architecture, and more.",
  openGraph: {
    title: "miloasdev",
    description: "Exploring the latest in web development, bilingual architecture, and more.",
    type: "website",
  },
};

export default async function Home() {
  const allPosts = await getAllPosts();
  const initialPosts = allPosts.slice(0, 10);

  return (
    <div className="flex w-full flex-col">
      <section className="w-full py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-foreground font-serif text-5xl leading-none font-black tracking-tight md:text-7xl">
              miloasdev.
            </h1>
            <p className="text-muted-foreground max-w-md font-sans text-base leading-relaxed">
              I build. I learn. I write.
            </p>
          </div>
        </div>
      </section>

      <div className="border-border container mx-auto max-w-6xl border-t px-6 py-16 md:py-24">
        <InfinitePostList initialPosts={initialPosts} />
      </div>
    </div>
  );
}
