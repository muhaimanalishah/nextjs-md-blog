import Rss from "rss";
import { getAllPosts } from "./posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

export async function generateRssFeed() {
  const posts = await getAllPosts();

  const feed = new Rss({
    title: "My Blog",
    description: "Tech, Development, and Personal Thoughts",
    feed_url: `${SITE_URL}/feed.xml`,
    site_url: SITE_URL,
    language: "en",
  });

  // Take the 10 most recent posts
  posts.slice(0, 10).forEach((post) => {
    feed.item({
      title: post.metadata.title,
      description: post.metadata.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      date: post.metadata.date,
      categories: post.metadata.tags,
    });
  });

  return feed.xml({ indent: true });
}
