import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("<urlset></urlset>", {
    headers: { "Content-Type": "application/xml" },
  });
}
