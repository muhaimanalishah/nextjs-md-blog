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
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.metadata.title,
    description: post.metadata.excerpt,
  };
}

import { TableOfContents } from "@/components/TableOfContents";

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Dynamically import the MDX content
  const Content = dynamic(
    () => import(`@/content/posts/${post.folder}/en.mdx`),
  );

  return (
    <div className="container relative max-w-5xl py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="max-w-3xl flex-1">
          <div className="flex flex-col gap-4 mb-8">
            <LangToggle hasUrdu={post.hasUrdu} />
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              {post.metadata.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <time dateTime={post.metadata.date}>
                {new Date(post.metadata.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <Content />
          </div>

          <PostNavigation older={post.older} newer={post.newer} />
        </article>

        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-28">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </div>
  );
}
