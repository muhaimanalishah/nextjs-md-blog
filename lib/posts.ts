import fs from "fs";
import path from "path";

export interface PostMetadata {
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  cover?: string;
}

export interface Post {
  slug: string;
  folder: string;
  metadata: PostMetadata;
  hasUrdu: boolean;
  readingTime: number;
}

export interface SinglePost extends Post {
  prev: Post | null;
  next: Post | null;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

function parseMetadata(content: string): PostMetadata {
  const titleMatch = content.match(/title:\s*["'](.*?)["']/);
  const dateMatch = content.match(/date:\s*["'](.*?)["']/);
  const excerptMatch = content.match(/excerpt:\s*["'](.*?)["']/);
  const coverMatch = content.match(/cover:\s*["'](.*?)["']/);

  const tagsMatch = content.match(/tags:\s*\[(.*?)\]/);
  const tags = tagsMatch
    ? tagsMatch[1]
        .split(",")
        .map((t) => t.replace(/["'\s]/g, ""))
        .filter(Boolean)
    : [];

  return {
    title: titleMatch?.[1] || "",
    date: dateMatch?.[1] || "",
    excerpt: excerptMatch?.[1] || "",
    tags,
    cover: coverMatch?.[1],
  };
}

function calculateReadingTime(text: string): number {
  // Strip metadata block and calculate words
  const content = text.replace(/export const metadata = \{[\s\S]*?\}/, "");
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDirectory)) return [];

  const folders = fs.readdirSync(postsDirectory).filter((file) => {
    return fs.statSync(path.join(postsDirectory, file)).isDirectory();
  });

  const posts: Post[] = folders.map((folder) => {
    const enMdxPath = path.join(postsDirectory, folder, "en.mdx");
    const urMdxPath = path.join(postsDirectory, folder, "ur.mdx");

    let enContent = "";
    if (fs.existsSync(enMdxPath)) {
      enContent = fs.readFileSync(enMdxPath, "utf8");
    }

    const metadata = parseMetadata(enContent);
    const hasUrdu = fs.existsSync(urMdxPath);
    const readingTime = calculateReadingTime(enContent);

    // Strip date prefix: YYYY-MM-DD-slug
    const nameMatch = folder.match(/^\d{4}-\d{2}-\d{2}-(.*)$/);
    const slug = nameMatch ? nameMatch[1] : folder;

    return {
      slug,
      folder,
      metadata,
      hasUrdu,
      readingTime,
    };
  });

  // Sort by date descending
  return posts.sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime(),
  );
}

export async function getPostBySlug(slug: string): Promise<SinglePost | null> {
  const allPosts = await getAllPosts();
  const index = allPosts.findIndex((p) => p.slug === slug);

  if (index === -1) return null;

  const post = allPosts[index];

  // Previous post is index + 1 (older), Next post is index - 1 (newer)
  // because the list is sorted descending
  const prev = index < allPosts.length - 1 ? allPosts[index + 1] : null;
  const next = index > 0 ? allPosts[index - 1] : null;

  return {
    ...post,
    prev,
    next,
  };
}
