import {
  getPostBySlug,
  getAllPosts,
  getRelatedPosts,
  getPostContent,
} from "@/lib/posts";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Metadata } from "next";
import { TableOfContents } from "@/components/TableOfContents";
import { PostHeader } from "@/components/PostHeader";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ShareButtons } from "@/components/ShareButtons";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { PreWithCopy } from "@/components/PreWithCopy";
import { Callout } from "@/components/Callout";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}


export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const coverUrl = post.metadata.cover
    ? `${SITE_URL}/posts/${post.folder}/${post.metadata.cover.replace(/^\.\//, "")}`
    : `${SITE_URL}/opengraph-image.png`;

  return {
    title: post.metadata.title,
    description: post.metadata.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title: post.metadata.title,
      description: post.metadata.excerpt,
      url: `${SITE_URL}/blog/${slug}`,
      publishedTime: post.metadata.date,
      authors: [post.metadata.author],
      tags: post.metadata.tags,
      images: [{ url: coverUrl, width: 1200, height: 630, alt: post.metadata.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metadata.title,
      description: post.metadata.excerpt,
      images: [coverUrl],
      creator: "@muhaiman_as",
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [content, related] = await Promise.all([
    getPostContent(post.folder, "en"),
    getRelatedPosts(post),
  ]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 relative container py-8 duration-1000 md:py-16">
      <PostHeader post={post} />
      <div className="mx-auto flex max-w-6xl flex-col gap-16 lg:flex-row">
        <article className="min-w-0 flex-1">
          <div className="prose prose-zinc dark:prose-invert prose-lg md:prose-xl max-w-none font-serif leading-relaxed">
            <MDXRemote
              source={content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeHighlight, rehypeSlug],
                },
              }}
              components={{
                pre: (props) => <PreWithCopy {...props} />,
                Callout,
              }}
            />
          </div>
          <ShareButtons title={post.metadata.title} slug={post.slug} />
          <RelatedPosts posts={related} />
        </article>
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28 space-y-8">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </div>
  );
}
