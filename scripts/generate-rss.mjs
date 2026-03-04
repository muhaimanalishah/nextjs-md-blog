import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content/posts");
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

const folders = fs.readdirSync(postsDir)
  .filter(f => fs.statSync(path.join(postsDir, f)).isDirectory());

const posts = folders.map(folder => {
  const enPath = path.join(postsDir, folder, "en.mdx");
  if (!fs.existsSync(enPath)) return null;
  const { data } = matter(fs.readFileSync(enPath, "utf8"));
  const slug = folder.match(/^\d{4}-\d{2}-\d{2}-(.*)$/)?.[1] ?? folder;
  return { slug, metadata: data };
}).filter(Boolean).sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));

const items = posts.slice(0, 10).map(p => `
  <item>
    <title><![CDATA[${p.metadata.title}]]></title>
    <description><![CDATA[${p.metadata.excerpt}]]></description>
    <link>${SITE_URL}/blog/${p.slug}</link>
    <pubDate>${new Date(p.metadata.date).toUTCString()}</pubDate>
    ${p.metadata.tags.map(t => `<category>${t}</category>`).join("\n    ")}
  </item>`).join("");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>My Blog</title>
    <description>Tech, Development, and Personal Thoughts</description>
    <link>${SITE_URL}</link>
    <language>en</language>
    ${items}
  </channel>
</rss>`;

fs.writeFileSync(path.join(process.cwd(), "public/feed.xml"), xml);
console.log("RSS feed written to public/feed.xml");