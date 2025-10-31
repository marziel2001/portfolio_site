// photoMetaGen.js
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, "public/staticImages/");
const outFile = path.join(__dirname, "public/staticImages/gallery.json");

if (!fs.existsSync(imagesDir)) {
    console.error("Images directory does not exist:", imagesDir);
    process.exit(1);
}

const files = fs
    .readdirSync(imagesDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

const gallery = [];

for (const filename of files) {
    const filePath = path.join(imagesDir, filename);

    try {
        const meta = await sharp(filePath).metadata();
        const { width, height, format } = meta;

        gallery.push({
            filename,
            url: `public/staticImages/${filename}`,
            width,
            height,
            aspectRatio: width / height,
            format,
        });

        console.log(`OK: ${filename} → ${width}x${height}`);
    } catch (err) {
        console.warn(`❌ Error reading file ${filename}:`, err.message);
    }
}

fs.writeFileSync(outFile, JSON.stringify(gallery, null, 2));
console.log(`✅ gallery.json generated (${gallery.length} entries).`);
