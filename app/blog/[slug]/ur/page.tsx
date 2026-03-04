import { getPostBySlug, getAllPosts, getRelatedPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { TableOfContents } from "@/components/TableOfContents";
import { PostHeader } from "@/components/PostHeader";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ShareButtons } from "@/components/ShareButtons";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
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
    return { title: "Post Not Found" };
  }

  return {
    title: post.urMetadata.title || `${post.metadata.title} (Roman Urdu)`,
    description: post.urMetadata.excerpt || post.metadata.excerpt,
  };
}

export default async function UrduPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.hasUrdu) notFound();

  const related = await getRelatedPosts(post);

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