import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

// *** here provide the size of the thumbnails ***
const thumbSize = 800;
// ***********************************************

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, "public/staticImages/fullRes/");
const thumbsDir = path.join(__dirname, "public/staticImages/thumbnails/");
const outFile = path.join(__dirname, "public/staticImages/gallery.json");

// checks if thumbs dir exists. If not, create it
if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });

const files = fs
  .readdirSync(imagesDir)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

const gallery = [];

for (const filename of files) {
  const inputPath = path.join(imagesDir, filename);
  const outputPath = path.join(thumbsDir, filename);

  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const aspectRatio = metadata.width / metadata.height;

  await image.resize({ width: thumbSize }).toFile(outputPath);

  gallery.push({
    filename,
    full: `/staticImages/fullRes/${filename}`,
    thumb: `/staticImages/thumbnails/${filename}`,
    width: metadata.width,
    height: metadata.height,
    aspectRatio,
    format: metadata.format,
  });
}

fs.writeFileSync(outFile, JSON.stringify(gallery, null, 2));
console.log(
  `✅ Wygenerowano miniaturki o szerokości ${thumbSize}px i zapisano ${gallery.length} wpisów do gallery.json`,
);
