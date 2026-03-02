import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
  older: Post | null;
  newer: Post | null;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

function calculateReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
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

    const { data: metadata, content } = matter(enContent);
    const hasUrdu = fs.existsSync(urMdxPath);
    const readingTime = calculateReadingTime(content);

    // Strip date prefix: YYYY-MM-DD-slug
    const nameMatch = folder.match(/^\d{4}-\d{2}-\d{2}-(.*)$/);
    const slug = nameMatch ? nameMatch[1] : folder;

    return {
      slug,
      folder,
      metadata: metadata as PostMetadata,
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
  const older = index < allPosts.length - 1 ? allPosts[index + 1] : null;
  const newer = index > 0 ? allPosts[index - 1] : null;

  return {
    ...post,
    older,
    newer,
  };
}
