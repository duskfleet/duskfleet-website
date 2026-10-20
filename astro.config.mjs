// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages: set SITE / BASE in the deploy workflow when the repo is not an
// org/user page (e.g. BASE=/duskfleet-website). Locally both default to "/".
export default defineConfig({
  site: process.env.SITE ?? 'https://duskfleet.com',
  base: process.env.BASE ?? '/',
  trailingSlash: 'ignore',
  build: { assets: 'assets' },
});
