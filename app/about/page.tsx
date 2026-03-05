import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Metadata } from "next";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PreWithCopy } from "@/components/PreWithCopy";
import { Callout } from "@/components/Callout";
import { JsonLd } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "About",
  description:
    "Muhaiman Ali Shah — full stack developer and data science student from Pakistan.",
  openGraph: {
    title: "About — miloasdev",
    description:
      "Muhaiman Ali Shah — full stack developer and data science student from Pakistan.",
    type: "profile",
  },
};

export default function AboutPage() {
  const filePath = path.join(process.cwd(), "content/about.mdx");
  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 container max-w-3xl py-12 duration-1000 md:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Muhaiman Ali Shah",
          url: `${SITE_URL}/about`,
          sameAs: [
            "https://github.com/muhaimanalishah",
            "https://x.com/muhaiman_as",
          ],
        }}
      />
      <div className="mb-8 flex flex-col gap-4">
        <h1 className="font-serif text-4xl font-black tracking-tight lg:text-5xl">
          About
        </h1>
        <p className="text-muted-foreground/70 font-sans text-lg leading-relaxed">
          Developer. Student. Perpetually curious
        </p>
      </div>

      <div className="prose prose-zinc dark:prose-invert prose-lg md:prose-xl max-w-none font-serif leading-relaxed">
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight, rehypeSlug],
            },
          }}
          components={{ pre: (props) => <PreWithCopy {...props} />, Callout }}
        />
      </div>
    </div>
  );
}
