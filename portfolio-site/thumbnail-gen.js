import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, "public/staticImages/fullRes/");
const thumbsDir = path.join(__dirname, "public/staticImages/thumbnails/");
const outFile = path.join(__dirname, "public/staticImages/gallery.json");

// upewnij się, że katalog miniaturek istnieje
if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });

// znajdź wszystkie zdjęcia w katalogu
const files = fs
  .readdirSync(imagesDir)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

const gallery = [];

for (const filename of files) {
  const inputPath = path.join(imagesDir, filename);
  const outputPath = path.join(thumbsDir, filename);

  // odczytaj metadane oryginału
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const aspectRatio = metadata.width / metadata.height;

  // wygeneruj miniaturkę o szerokości 400px
  await image.resize({ width: 400 }).toFile(outputPath);

  gallery.push({
    filename,
    full: `public/staticImages/fullRes/${filename}`,
    thumb: `public/staticImages/thumbnails/${filename}`,
    width: metadata.width,
    height: metadata.height,
    aspectRatio,
    format: metadata.format,
  });
}

fs.writeFileSync(outFile, JSON.stringify(gallery, null, 2));
console.log(
  `✅ Wygenerowano miniaturki i zapisano ${gallery.length} wpisów do gallery.json`,
);
