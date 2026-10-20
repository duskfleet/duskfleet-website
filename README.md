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

## Analytics and cookie consent

`src/components/CookieBanner.astro` implements the DS-04 consent banner (duskfleet/duskfleet#128).
The choice is stored in `localStorage` under `duskfleet-consent` (`accepted` | `rejected`) and
exposed as `window.duskfleetConsent` (`get()`, `set(value)`, event `duskfleet:consent`).
GA4 (`gaId` in `src/data/site.ts`) loads only after Accept; with Reject or no choice, no analytics
script loads and no analytics cookie is set. An empty `gaId` disables analytics entirely.

## Structure

```
src/
  data/site.ts        links, nav, demo table rows, FAQ copy
  styles/tokens.css   Figma variables (colors, fonts, radii) + reset
  styles/global.css   shared primitives: .container .section .panel .btn .pill .table
  layouts/Base.astro  <head>, meta/OG, fonts
  components/         one component per landing section, plus CookieBanner
  assets/icons/       SVGs exported from Figma (logo mark, feature icons)
  pages/index.astro   composes the sections in Figma order
```

## Deploy

`.github/workflows/deploy.yml` builds on every push to `main` and publishes to GitHub Pages.
`SITE` and `BASE` are taken from the Pages settings of the repo, so the same workflow works for
a custom domain (base `/`) and for a project page (base `/<repo>`).

Enable it once in the repo: Settings → Pages → Source: **GitHub Actions**.

### Custom domain

The site is served at **https://duskfleet.com**. `public/CNAME` carries the domain, so every deploy
keeps it set in the Pages settings. DNS at the registrar:

```
A      @     185.199.108.153
A      @     185.199.109.153
A      @     185.199.110.153
A      @     185.199.111.153
CNAME  www   duskfleet.github.io
```

Once the DNS check in Settings → Pages passes, turn on **Enforce HTTPS**.
