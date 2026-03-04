import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about the person behind this blog.",
};

export default function AboutPage() {
  const Content = dynamic(() => import("@/content/about.mdx"));

  return (
    <div className="container max-w-3xl py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-4xl lg:text-5xl font-serif font-black tracking-tight">
          About Me
        </h1>
        <p className="text-lg text-muted-foreground/70 font-sans leading-relaxed">
          The story behind the Markdown Blog and its creator.
        </p>
      </div>

      <div className="prose prose-zinc dark:prose-invert prose-lg md:prose-xl max-w-none font-serif leading-relaxed">
        <Content />
      </div>
    </div>
  );
}
