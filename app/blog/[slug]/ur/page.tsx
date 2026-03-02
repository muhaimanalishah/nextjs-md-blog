import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Metadata } from "next";

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
    title: `${post.metadata.title} (Roman Urdu)`,
    description: post.metadata.excerpt,
  };
}

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
    <article className="container max-w-3xl py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {post.metadata.title}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span className="font-medium text-primary">Roman Urdu</span>
          <span>•</span>
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
    </article>
  );
}
