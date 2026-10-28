# duskfleet-website

Public landing page of [DuskFleet](https://github.com/duskfleet/duskfleet), served at
duskfleet.com from GitHub Pages. Static [Astro 5](https://astro.build) site: no framework
islands, no client-side JavaScript beyond the inline consent / GA4 loader, self-hosted fonts,
design tokens as CSS custom properties. The design source of truth is the `DuskFleet` Figma
file (key `bvAOGygh7yzjmTRLj7gFIp`): frame **Landing** (`25:2`) and the components an issue
names. Product code lives in the `duskfleet/duskfleet` repository, not here.

## Commands

```bash
npm install
npm run dev          # http://localhost:4321
npm run check        # astro check: types + templates
npm run build        # static output in dist/ (SITE / BASE come from the deploy workflow)
npm run preview      # serve dist/
npm run check:public # no home paths, user or host names, no symlinks in versioned files
```

Every pull request must pass the `checks` job (`.github/workflows/checks.yml`: check:public,
astro check, build); a ruleset on `main` blocks the merge otherwise. Merges are squash merges.
Pushing `main` deploys (`deploy.yml`).

## Layout

```
src/
  data/site.ts        links, nav, GA4 measurement id (gaId), demo rows, FAQ copy
  styles/tokens.css   Figma variables (colours, fonts, radii, spacing) + reset
  styles/global.css   shared primitives: .container .section .panel .btn .pill .table
  layouts/Base.astro  <head>, meta/OG, JSON-LD (home only, `jsonLd` prop), fonts, consent state + GA4 loader
  components/         one component per landing section, plus CookieBanner
  assets/icons/       SVGs exported from Figma
  pages/              index.astro (sections in Figma order), privacy.astro, 404.astro (noindex),
                      og.png.ts, sitemap-index.xml.ts + sitemap-0.xml.ts (every page, trailing slash)
public/               CNAME, favicon.svg, robots.txt (names the sitemap index)
scripts/              check-public.mjs, pr-worktree.sh (worktree under .claude/worktrees/),
                      issue-plan.mjs (JSON snapshot of the issue flow for the planner agent)
```

## Rules

- **Tokens, never literals.** Colours, spacing, radii and fonts come from the custom properties
  in `src/styles/tokens.css`; add a token only when Figma has a variable with no equivalent, and
  name it after the Figma variable. No hard-coded hex values in components.
- **Keep it static.** No UI framework, no component library, no new runtime dependency without
  a reason stated in the PR. Client JavaScript only for behaviour that cannot be CSS (today:
  consent and the GA4 loader). Fonts are Fontsource packages imported in `Base.astro`.
- **Consent first.** GA4 loads only after an explicit Accept (`window.duskfleetConsent`,
  `localStorage` key `duskfleet-consent`); Reject or no choice loads nothing and sets no
  analytics cookie. An empty `gaId` disables analytics. Never add a third-party script that
  bypasses this.
- **Accessibility.** WCAG 2.1 AA: 4.5:1 for text, 3:1 for borders and focus rings; DOM order
  equals visual order; every interactive element reachable with Tab and shows the shared
  `:focus-visible` ring; `prefers-reduced-motion` respected.
- **Implement the frame.** When an issue names Figma nodes, build what the frame shows at
  1280 px and 390 px and state every deviation in the PR body. A design that does not exist in
  Figma is not invented here: it is requested as an `area: design` issue in
  `duskfleet/duskfleet` (the designer agent works both products in the same file).
- **This repo is public.** No usernames, home paths, machine-specific values, private notes or
  secrets in versioned files, commits, issues or PR text (`npm run check:public` enforces the
  paths). `.claude/` (local agents, skills, worktrees, scratch files) is git-ignored.

## Issue and PR flow

Issues and PRs carry their state as `flow:` labels, the same state machine as
`duskfleet/duskfleet`: an issue goes `flow: ready` → `flow: in-progress`; its PR goes
`flow: needs-review` → `flow: in-review` → `flow: changes-requested` | `flow: ready-to-merge`;
`flow: needs-human` parks anything that needs a decision. Branches are `site/<issue>-<slug>`,
one issue per PR, the PR body says `Closes #<issue>`. Labels move through `gh api`
(`gh issue edit` / `gh pr edit` fail on the current gh). A human merges `flow: ready-to-merge`.
Implementation issues for approved designs are opened by the design promoter of
`duskfleet/duskfleet`, with the Figma links and the acceptance criteria.
