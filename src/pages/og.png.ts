import type { APIRoute } from 'astro';
import sharp from 'sharp';
import ogSvg from '../assets/og.svg?raw';

/*
 * Open Graph / Twitter card image, 1200x630.
 * Source: Figma OG/1200x630 (197:20), exported as SVG with outlined text,
 * rasterised to PNG at build time. sharp is Astro's own image service
 * dependency, so no package is added for this.
 */
export const GET: APIRoute = async () => {
  const png = await sharp(Buffer.from(ogSvg)).resize(1200, 630).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
