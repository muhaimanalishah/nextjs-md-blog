import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { folder: string; file: string } },
) {
  const { folder, file } = await params;
  const imagePath = path.join(process.cwd(), "content/posts", folder, file);

  if (!fs.existsSync(imagePath)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(imagePath);
  const extension = path.extname(file).toLowerCase();

  let contentType = "image/jpeg";
  if (extension === ".png") contentType = "image/png";
  if (extension === ".webp") contentType = "image/webp";
  if (extension === ".svg") contentType = "image/svg+xml";

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
