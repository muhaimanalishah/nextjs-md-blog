import { z } from "zod/v4";

export const PostMetadataSchema = z.object({
  title: z.string().min(1, "title cannot be empty"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  tags: z.array(z.string()).min(1, "at least one tag required"),
  excerpt: z.string().min(1, "excerpt cannot be empty"),
  cover: z.string().optional(),
  author: z.string().min(1, "author cannot be empty"),
});

export const UrduMetadataSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
});

export type PostMetadata = z.infer<typeof PostMetadataSchema>;
export type UrduMetadata = z.infer<typeof UrduMetadataSchema>;
