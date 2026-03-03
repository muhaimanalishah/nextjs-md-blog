import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { PostNavigation } from "@/components/PostNavigation";
import { LangToggle } from "@/components/LangToggle";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  // Only generate routes for posts that have an Urdu version
  return posts
    .filter((post) => post.hasUrdu)
    .map((post) => ({
      slug: post.slug,
    }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.hasUrdu) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.metadata.titleUrdu || `${post.metadata.title} (Roman Urdu)`,
    description: post.metadata.excerpt,
  };
}

import { TableOfContents } from "@/components/TableOfContents";
import { PostHeader } from "@/components/PostHeader";

export default async function UrduPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.hasUrdu) {
    notFound();
  }

  // Dynamically import the Roman Urdu MDX content
  const Content = dynamic(
    () => import(`@/content/posts/${post.folder}/ur.mdx`),
  );

  return (
    <div className="container relative py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PostHeader post={post} isUrdu={true} />

      <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">
        <article className="flex-1 min-w-0">
          <div className="prose prose-zinc dark:prose-invert prose-lg md:prose-xl max-w-none font-serif leading-relaxed">
            <Content />
          </div>

          <div className="mt-24 pt-12 border-t border-border/50">
            <PostNavigation older={post.older} newer={post.newer} />
          </div>
        </article>

        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-28 space-y-8">
            <div className="h-px w-full bg-border/50" />
            <div className="h-px w-full bg-border/50" />
            <TableOfContents />
          </div>
        </aside>
      </div>
    </div>
  );
}
