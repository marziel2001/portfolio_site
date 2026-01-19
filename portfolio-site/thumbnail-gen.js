import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const thumbSize = 800;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fullRoot = path.join(__dirname, "public/staticImages/fullRes/");
const thumbRoot = path.join(__dirname, "public/staticImages/thumbnails/");
const outFile = path.join(__dirname, "public/staticImages/gallery.json");

const categories = fs
  .readdirSync(fullRoot)
  .filter((name) => fs.lstatSync(path.join(fullRoot, name)).isDirectory());

const gallery = [];

for (const category of categories) {
  const fullDir = path.join(fullRoot, category);
  const thumbsDir = path.join(thumbRoot, category);

  if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });

  const files = fs
    .readdirSync(fullDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  for (const filename of files) {
    const inputPath = path.join(fullDir, filename);
    const outputThumb = path.join(thumbsDir, filename);

    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const aspectRatio = metadata.width / metadata.height;

    const lqipBuffer = await image.resize({ width: 20 }).toBuffer();
    const lqip = `data:image/${metadata.format};base64,${lqipBuffer.toString(
      "base64"
    )}`;

    await image.resize({ width: thumbSize }).toFile(outputThumb);

    gallery.push({
      filename,
      category,
      full: `/staticImages/fullRes/${category}/${filename}`,
      thumb: `/staticImages/thumbnails/${category}/${filename}`,
      lqip,
      width: metadata.width,
      height: metadata.height,
      aspectRatio,
      format: metadata.format,
    });
  }
}

fs.writeFileSync(outFile, JSON.stringify(gallery, null, 2));

console.log(`ok: ${gallery.length}`);
