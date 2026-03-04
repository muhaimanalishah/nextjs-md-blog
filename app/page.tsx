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
    <div className="flex flex-col w-full">
      <section className="w-full relative overflow-hidden py-24 md:py-32 bg-background">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-12">
            <div className="space-y-6 max-w-3xl">
              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-serif tracking-tighter leading-[0.95] text-foreground">
                Write Once.
                <br />
                <span className="text-muted-foreground italic font-light">
                  Reach Everyone.
                </span>
              </h1>
            </div>
            <div className="flex flex-col items-start md:items-end gap-6 max-w-sm text-left md:text-right">
              <p className="text-sm text-muted-foreground/70 font-sans leading-relaxed tracking-wide">
                Exploring the latest in web development, bilingual architecture,
                and the future of modular content creation.
              </p>
              <div className="flex items-center gap-4 text-xs font-sans font-bold uppercase tracking-widest text-foreground">
                <span>Read the latest</span>
                <div className="h-px w-12 bg-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-6 py-16 md:py-24 border-t border-border">
        <InfinitePostList initialPosts={initialPosts} />
      </div>
    </div>
  );
}
