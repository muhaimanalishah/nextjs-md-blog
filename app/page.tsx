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
      <section className="w-full relative overflow-hidden border-b py-20 md:py-32 bg-accent/5">
        {/* Abstract background blobs for premium feel */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="container max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter md:text-8xl lg:text-9xl bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent leading-none">
              WRITE ONCE
              <br />
              REACH EVERYONE
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              Exploring the latest in web development, bilingual architecture,
              and the future of modular content.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="h-px w-24 bg-primary/30" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60">
              Scroll to explore
            </span>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-6 py-16 md:py-24">
        <InfinitePostList initialPosts={initialPosts} />
      </div>
    </div>
  );
}
