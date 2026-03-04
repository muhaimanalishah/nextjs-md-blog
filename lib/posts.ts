import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

export interface PostMetadata {
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  cover?: string;
  author: string;
}

export interface UrduMetadata {
  title?: string;
  excerpt?: string;
}

export interface Post {
  slug: string;
  folder: string;
  metadata: PostMetadata;
  urMetadata: UrduMetadata;
  hasUrdu: boolean;
  readingTime: number;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

function calculateReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export const getAllPosts = cache(async (): Promise<Post[]> => {
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

    let urMetadata: UrduMetadata = {};
    if (hasUrdu) {
      const urContent = fs.readFileSync(urMdxPath, "utf8");
      const { data } = matter(urContent);
      urMetadata = {
        title: data.title,
        excerpt: data.excerpt,
      };
    }

    const nameMatch = folder.match(/^\d{4}-\d{2}-\d{2}-(.*)$/);
    const slug = nameMatch ? nameMatch[1] : folder;

    return {
      slug,
      folder,
      metadata: metadata as PostMetadata,
      urMetadata,
      hasUrdu,
      readingTime,
    };
  });

  return posts.sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );
});

export async function getPostContent(
  folder: string,
  lang: "en" | "ur" = "en"
): Promise<string> {
  const filePath = path.join(postsDirectory, folder, `${lang}.mdx`);
  if (!fs.existsSync(filePath)) return "";
  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);
  return content;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const allPosts = await getAllPosts();
  return allPosts.find((p) => p.slug === slug) ?? null;
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.metadata.tags.includes(tag));
}

export async function getRelatedPosts(post: Post, count = 3): Promise<Post[]> {
  const allPosts = await getAllPosts();

  return allPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score: p.metadata.tags.filter((t) => post.metadata.tags.includes(t))
        .length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) =>
      b.score !== a.score
        ? b.score - a.score
        : new Date(b.post.metadata.date).getTime() -
          new Date(a.post.metadata.date).getTime()
    )
    .slice(0, count)
    .map(({ post }) => post);
}
