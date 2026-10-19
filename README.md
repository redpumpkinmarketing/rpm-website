# Red Pumpkin Marketing website

Editable Astro website for Red Pumpkin Marketing, built around **The Uncommon P**.

## Status

QA completed on 20 October 2026. This repository handoff does not publish the website or configure hosting. Pages retain `noindex, nofollow` until a separately approved launch.

- 12 homepage sections, 7 service pages and 4 case studies.
- Shared arch visuals, responsive navigation, GSAP/Lenis motion and reduced-motion support.
- Three-step enquiry form with validation; sending remains disabled until a real provider is configured.
- 20 built pages including the 404 page, design foundation and unpublished article template.
- Local mobile Lighthouse scores: **95–99 Performance / 100 Accessibility** across all 17 main pages.

Read the [final QA report](docs/qa/redesign-report.md), [score table](docs/qa/lighthouse-scores.md), and [test results](docs/qa/test-suite-report.json). QA summaries and selected before/after screenshots are under `docs/qa/`. The complete 100-view screenshot archive and individual Lighthouse HTML reports remain in the local workspace.

## Development

Use Node.js **24 LTS** (minimum 22.19) and npm.

```sh
npm ci
npm run dev
```

Build and validate:

```sh
npm run check
npm run build
npm test
npm run preview -- --port 4322
```

The built static site is generated in `dist/`. It is intentionally not committed; rebuild it from the lockfile. Do not publish the whole repository as a web root.

The additional browser QA scripts were run using Playwright and Edge on the original Windows workstation. Their runtime/browser paths must be adapted on another machine. Lighthouse is an external QA tool, not a website dependency. These scripts and their recorded results are included for reference; the normal install/build/static checks use the committed package manifest and lockfile.

## Source map

- `src/data/pages.json`: supplied content master data; internal production instructions are filtered from rendering.
- `src/data/presentation.ts`: visitor-facing copy cleanup and presentation rules.
- `src/data/site.ts`: services, projects and contact/form/social settings.
- `src/components/`, `src/layouts/`, `src/pages/`: reusable components and page layouts.
- `src/styles/`, `src/scripts/`: visual system and progressive interaction enhancements.
- `public/`: approved production logo and favicon assets.
- `licenses/`: font license records.
- `docs/qa/`: verification summaries and selected screenshots.

Private approval documents, original asset archives, local dependencies, generated build output and old handoff ZIPs are not included.

## Before launch

Supply approved client screenshots/logos, founder/team photos, and any genuine approved testimonials. Set the real WhatsApp number, email, city, form endpoint and social URLs in `src/data/site.ts`. Web3Forms also needs its public access key. Never put private service credentials in frontend source.

Test real form delivery after configuration. Replace marked media placeholders, review metadata/domain settings, remove review-only routes from the launch output if desired, and approve indexing and deployment separately. No client results, testimonials or operational details have been invented.
