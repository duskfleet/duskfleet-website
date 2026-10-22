import type { APIRoute } from 'astro';

/*
 * Sitemap of every page in src/pages, generated at build time.
 * Same file names and format as @astrojs/sitemap (sitemap-index.xml ->
 * sitemap-0.xml), without adding the package: the site has a handful of
 * static pages, so a glob over src/pages is all the integration would do.
 * Every URL ends with a slash, matching how GitHub Pages serves them.
 */
const pages = Object.keys(import.meta.glob('./**/*.astro'))
  .map((file) => file.replace(/^\.\//, '').replace(/\.astro$/, ''))
  .filter((name) => name !== '404' && !name.split('/').some((part) => part.startsWith('_') || part.startsWith('[')))
  .map((name) => (name === 'index' ? '' : `${name.replace(/\/index$/, '')}/`))
  .sort();

export const GET: APIRoute = ({ site }) => {
  const root = new URL(import.meta.env.BASE_URL.replace(/\/?$/, '/'), site);
  const urls = pages.map((path) => `  <url><loc>${new URL(path, root).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
