import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

/*
 * /favicon.ico fallback for clients that request it directly instead of
 * reading the <link rel="icon"> tags (older Safari, feed readers, link
 * previewers). Rendered at build time from public/favicon.svg, the same
 * source as the preferred SVG icon, so the two never drift apart.
 *
 * The file is a standard ICO container holding PNG-compressed layers at
 * 16, 32 and 48 px (PNG-in-ICO, read by every browser and by Windows since
 * Vista). sharp is Astro's own image service dependency, as in og.png.ts.
 * The SVG is read from disk because Vite does not import from public/;
 * astro build runs from the project root.
 */
const SIZES = [16, 32, 48];

export const GET: APIRoute = async () => {
  const svg = await readFile(join(process.cwd(), 'public', 'favicon.svg'));
  const layers = await Promise.all(
    SIZES.map((size) => sharp(svg, { density: 72 * (size / 36) * 4 }).resize(size, size).png().toBuffer()),
  );

  const headerSize = 6;
  const entrySize = 16;
  const header = Buffer.alloc(headerSize + entrySize * layers.length);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(layers.length, 4);

  let offset = header.length;
  layers.forEach((png, i) => {
    const at = headerSize + entrySize * i;
    const size = SIZES[i];
    header.writeUInt8(size, at); // width (0 would mean 256)
    header.writeUInt8(size, at + 1); // height
    header.writeUInt8(0, at + 2); // palette colours: none
    header.writeUInt8(0, at + 3); // reserved
    header.writeUInt16LE(1, at + 4); // colour planes
    header.writeUInt16LE(32, at + 6); // bits per pixel
    header.writeUInt32LE(png.length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += png.length;
  });

  const ico = Buffer.concat([header, ...layers]);
  return new Response(new Uint8Array(ico), {
    headers: { 'Content-Type': 'image/x-icon' },
  });
};
