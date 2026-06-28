import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SOURCE = path.join(root, "scripts", "source-logo.png");
const PUBLIC_DIR = path.join(root, "public");
const BACKGROUND = "#0a0a0a";

async function withBackground(size) {
  return sharp(SOURCE)
    .resize(size, size, { fit: "contain", background: BACKGROUND })
    .flatten({ background: BACKGROUND })
    .png()
    .toBuffer();
}

// Modern ICO format allows embedding a PNG directly as the single image entry.
function pngToIco(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // width (0 means 256)
  entry.writeUInt8(size === 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // color palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // image data size
  entry.writeUInt32LE(header.length + entry.length, 12); // offset

  return Buffer.concat([header, entry, pngBuffer]);
}

async function main() {
  const png16 = await withBackground(16);
  const png32 = await withBackground(32);
  const png180 = await withBackground(180);

  await writeFile(path.join(PUBLIC_DIR, "favicon-16x16.png"), png16);
  await writeFile(path.join(PUBLIC_DIR, "favicon-32x32.png"), png32);
  await writeFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"), png180);
  await writeFile(path.join(PUBLIC_DIR, "favicon.ico"), pngToIco(png32, 32));

  console.log("Favicon files generated in public/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
