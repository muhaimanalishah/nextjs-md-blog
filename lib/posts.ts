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
  urReadingTime?: number;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

function calculateReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export const getAllPosts = cache(async (): Promise<Post[]> => {
  if (!fs.existsSync(postsDirectory)) return [];

  const entries = await fs.promises.readdir(postsDirectory, {
    withFileTypes: true,
  });
  const folders = entries
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const postPromises = folders.map(async (folder) => {
    const enMdxPath = path.join(postsDirectory, folder, "en.mdx");
    const urMdxPath = path.join(postsDirectory, folder, "ur.mdx");

    const hasEn = fs.existsSync(enMdxPath);
    const hasUrdu = fs.existsSync(urMdxPath);

    let contentToParse = "";
    if (hasEn) {
      contentToParse = await fs.promises.readFile(enMdxPath, "utf8");
    } else if (hasUrdu) {
      contentToParse = await fs.promises.readFile(urMdxPath, "utf8");
    }

    if (!contentToParse) return null;

    const { data: metadata, content: enContentStr } = matter(contentToParse);
    const readingTime = calculateReadingTime(enContentStr);

    let urMetadata: UrduMetadata = {};
    let urReadingTime: number | undefined;

    if (hasUrdu) {
      const urContent = await fs.promises.readFile(urMdxPath, "utf8");
      const { data, content: urContentStr } = matter(urContent);
      urMetadata = {
        title: data.title,
        excerpt: data.excerpt,
      };
      urReadingTime = calculateReadingTime(urContentStr);
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
      urReadingTime,
    };
  });

  const posts = await Promise.all(postPromises);
  const validPosts = posts.filter((p) => p !== null) as Post[];

  return validPosts.sort(
    (a, b) =>
      new Date(b.metadata.date || 0).getTime() -
      new Date(a.metadata.date || 0).getTime()
  );
});

export async function getPostContent(
  folder: string,
  lang: "en" | "ur" = "en"
): Promise<string> {
  const filePath = path.join(postsDirectory, folder, `${lang}.mdx`);
  if (!fs.existsSync(filePath)) return "";
  const raw = await fs.promises.readFile(filePath, "utf8");
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
        : new Date(b.post.metadata.date || 0).getTime() -
          new Date(a.post.metadata.date || 0).getTime()
    )
    .slice(0, count)
    .map(({ post }) => post);
}
