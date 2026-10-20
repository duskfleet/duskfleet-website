# duskfleet-website

Landing page for [DuskFleet](https://github.com/duskfleet/duskfleet), built from the Figma
design (`DuskFleet` file, frame **Landing**).

Static site on [Astro](https://astro.build): no client-side JavaScript, self-hosted fonts
(Outfit, IBM Plex Sans, IBM Plex Mono via Fontsource), design tokens as CSS custom properties.

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/
npm run check      # astro check (types + templates)
```

## Structure

```
src/
  data/site.ts        links, nav, demo table rows, FAQ copy
  styles/tokens.css   Figma variables (colors, fonts, radii) + reset
  styles/global.css   shared primitives: .container .section .panel .btn .pill .table
  layouts/Base.astro  <head>, meta/OG, fonts
  components/         one component per landing section
  assets/icons/       SVGs exported from Figma (logo mark, feature icons)
  pages/index.astro   composes the sections in Figma order
```

## Deploy

`.github/workflows/deploy.yml` builds on every push to `main` and publishes to GitHub Pages.
`SITE` and `BASE` are taken from the Pages settings of the repo, so the same workflow works for
an org page (`duskfleet.github.io`, base `/`) and for a project page (base `/<repo>`).

Enable it once in the repo: Settings → Pages → Source: **GitHub Actions**.
