import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET() {
  const posts = await getAllPosts();

  const postUrls = posts.map((post) => {
    return `<url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.metadata.date).toISOString()}</lastmod>
  </url>`;
  });

  const urPostUrls = posts
    .filter((post) => post.hasUrdu)
    .map((post) => {
      return `<url>
    <loc>${SITE_URL}/blog/${post.slug}/ur</loc>
    <lastmod>${new Date(post.metadata.date).toISOString()}</lastmod>
  </url>`;
    });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${SITE_URL}/tags</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  ${postUrls.join("\n  ")}
  ${urPostUrls.join("\n  ")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
