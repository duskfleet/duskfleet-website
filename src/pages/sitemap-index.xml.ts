import type { APIRoute } from 'astro';

/* Sitemap index named in public/robots.txt; points at sitemap-0.xml. */
export const GET: APIRoute = ({ site }) => {
  const root = new URL(import.meta.env.BASE_URL.replace(/\/?$/, '/'), site);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${new URL('sitemap-0.xml', root).href}</loc></sitemap>
</sitemapindex>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
