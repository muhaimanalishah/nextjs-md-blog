import { getPostBySlug, getAllPosts, getRelatedPosts, getPostContent } from "@/lib/posts";
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
  return {
    title: post.metadata.title,
    description: post.metadata.excerpt,
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
    <div className="container relative py-8 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PostHeader post={post} />
      <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">
        <article className="flex-1 min-w-0">
          <div className="prose prose-zinc dark:prose-invert prose-lg md:prose-xl max-w-none font-serif leading-relaxed">
            <MDXRemote
              source={content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeHighlight, rehypeSlug],
                },
              }}
            />
          </div>
          <ShareButtons title={post.metadata.title} slug={post.slug} />
          <RelatedPosts posts={related} />
        </article>
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-28 space-y-8">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </div>
  );
}