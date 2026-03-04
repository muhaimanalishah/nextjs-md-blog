import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content/posts");
const outDir = path.join(process.cwd(), "public/api");
const PAGE_SIZE = 10;

const folders = fs.readdirSync(postsDir)
  .filter(f => fs.statSync(path.join(postsDir, f)).isDirectory());

const posts = folders.map(folder => {
  const enPath = path.join(postsDir, folder, "en.mdx");
  if (!fs.existsSync(enPath)) return null;
  const raw = fs.readFileSync(enPath, "utf8");
  const { data: metadata, content } = matter(raw);
  const hasUrdu = fs.existsSync(path.join(postsDir, folder, "ur.mdx"));

  let urMetadata = {};
  if (hasUrdu) {
    const urRaw = fs.readFileSync(path.join(postsDir, folder, "ur.mdx"), "utf8");
    const { data } = matter(urRaw);
    urMetadata = { title: data.title, excerpt: data.excerpt };
  }

  const words = content.split(/\s+/).filter(Boolean).length;
  const slug = folder.match(/^\d{4}-\d{2}-\d{2}-(.*)$/)?.[1] ?? folder;
  return {
    slug, folder, metadata, urMetadata,
    hasUrdu, readingTime: Math.max(1, Math.ceil(words / 200))
  };
}).filter(Boolean).sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));

fs.mkdirSync(outDir, { recursive: true });

function writePages(subset, prefix) {
  const totalPages = Math.ceil(subset.length / PAGE_SIZE) || 1;
  for (let page = 1; page <= totalPages; page++) {
    const start = (page - 1) * PAGE_SIZE;
    const slice = subset.slice(start, start + PAGE_SIZE);
    fs.writeFileSync(
      path.join(outDir, `${prefix}-${page}.json`),
      JSON.stringify({ posts: slice, hasMore: page < totalPages })
    );
  }
}

// Global pages
writePages(posts, "posts");

// Per-tag pages
const tags = [...new Set(posts.flatMap(p => p.metadata.tags))];
for (const tag of tags) {
  const tagged = posts.filter(p => p.metadata.tags.includes(tag));
  writePages(tagged, `posts-${tag}`);
}

console.log(`Generated global + ${tags.length} tag-specific JSON feeds`);