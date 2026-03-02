import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("<rss version='2.0'></rss>", {
    headers: { "Content-Type": "application/xml" },
  });
}
