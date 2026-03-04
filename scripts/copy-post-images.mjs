import fs from "fs";
import path from "path";

const postsDir = path.join(process.cwd(), "content/posts");
const outDir = path.join(process.cwd(), "public/posts");

for (const folder of fs.readdirSync(postsDir)) {
  const folderPath = path.join(postsDir, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;

  for (const file of fs.readdirSync(folderPath)) {
    if (!/\.(jpe?g|png|webp|svg)$/i.test(file)) continue;
    const dest = path.join(outDir, folder);
    fs.mkdirSync(dest, { recursive: true });
    fs.copyFileSync(path.join(folderPath, file), path.join(dest, file));
  }
}
console.log("Post images copied to public/posts/");
