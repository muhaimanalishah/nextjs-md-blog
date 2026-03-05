import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import {
  type PostMetadata,
  type UrduMetadata,
  PostMetadataSchema,
  UrduMetadataSchema,
} from "./post.validate";

/**
 * Represents a blog post with its metadata and content information.
 */
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

/**
 * Calculates the estimated reading time for a given text based on word count.
 */
function calculateReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Retrieves all blog posts from the content directory, sorted by date descending.
 */
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

    let metadata: PostMetadata;
    let enContentStr: string;

    try {
      const parsed = matter(contentToParse);
      metadata = PostMetadataSchema.parse(parsed.data);
      enContentStr = parsed.content;
    } catch (err) {
      console.error(`[posts] Skipping "${folder}" — invalid frontmatter:`, err);
      return null;
    }

    const readingTime = calculateReadingTime(enContentStr);

    let urMetadata: UrduMetadata = {};
    let urReadingTime: number | undefined;

    if (hasUrdu) {
      const urContent = await fs.promises.readFile(urMdxPath, "utf8");
      const { data, content: urContentStr } = matter(urContent);
      try {
        urMetadata = UrduMetadataSchema.parse(data);
      } catch (err) {
        console.error(`[posts] Invalid Urdu frontmatter in "${folder}":`, err);
        urMetadata = {};
      }
      urReadingTime = calculateReadingTime(urContentStr);
    }

    const nameMatch = folder.match(/^\d{4}-\d{2}-\d{2}-(.*)$/);
    const slug = nameMatch ? nameMatch[1] : folder;

    return {
      slug,
      folder,
      metadata,
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
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );
});

/**
 * Retrieves the raw MDX content for a specific post and language.
 */
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

/**
 * Finds a post by its URL slug.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const allPosts = await getAllPosts();
  return allPosts.find((p) => p.slug === slug) ?? null;
}

/**
 * Retrieves all posts that contain a specific tag.
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.metadata.tags.includes(tag));
}

/**
 * Finds posts related to the given post based on shared tags.
 */
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
