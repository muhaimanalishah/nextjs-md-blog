import { getAllPosts } from "@/lib/posts";
import { InfinitePostList } from "@/components/InfinitePostList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Exploring the latest in web development, bilingual architecture, and more.",
};

export default async function Home() {
  const allPosts = await getAllPosts();
  const initialPosts = allPosts.slice(0, 10);

  return (
    <div className="flex w-full flex-col">
      <section className="bg-background relative w-full overflow-hidden py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-end justify-between gap-12 md:flex-row">
            <div className="max-w-3xl space-y-6">
              <h1 className="text-foreground font-serif text-6xl leading-[0.95] tracking-tighter md:text-8xl lg:text-[7rem]">
                Write Once.
                <br />
                <span className="text-muted-foreground font-light italic">
                  Reach Everyone.
                </span>
              </h1>
            </div>
            <div className="flex max-w-sm flex-col items-start gap-6 text-left md:items-end md:text-right">
              <p className="text-muted-foreground/70 font-sans text-sm leading-relaxed tracking-wide">
                Exploring the latest in web development, bilingual architecture,
                and the future of modular content creation.
              </p>
              <div className="text-foreground flex items-center gap-4 font-sans text-xs font-bold tracking-widest uppercase">
                <span>Read the latest</span>
                <div className="bg-foreground h-px w-12" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-border container mx-auto max-w-6xl border-t px-6 py-16 md:py-24">
        <InfinitePostList initialPosts={initialPosts} />
      </div>
    </div>
  );
}
