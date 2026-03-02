import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, getPostsByTag } from "@/lib/posts";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const tag = searchParams.get("tag");

    let posts = [];

    if (tag) {
      posts = await getPostsByTag(tag);
    } else {
      posts = await getAllPosts();
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedPosts = posts.slice(startIndex, endIndex);
    const hasMore = endIndex < posts.length;

    return NextResponse.json({
      posts: paginatedPosts,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
