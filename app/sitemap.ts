export const dynamic = "force-static";
import { getAllPosts } from "@/lib/posts";
import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.date),
  }));

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/tags` },
    { url: `${SITE_URL}/about` },
    ...postEntries,
  ];
}
