# Project Guidelines

## Build, lint, and test

Run commands from `portfolio-app`:

```bash
npm install
npm run dev
npm run lint
npm run build
npm start
```

- `npm run build` is the production verification command. It type-checks the app, generates the static routes, and writes the export to `portfolio-app/out`.
- There is no configured test runner or `test` script, so there is currently no single-test command. Do not add a test command unless a test framework is introduced.
- The GitHub Pages workflow uses Node.js 20, installs from `portfolio-app/package-lock.json`, builds from `portfolio-app`, and deploys `portfolio-app/out` after pushes to `main`.

## Architecture

- `portfolio-app` is the deployable application; the repository-root HTML files are standalone design prototypes and are not part of the Next.js build.
- The app uses the Next.js App Router with routes for the overview (`src/app/page.tsx`), projects (`src/app/projects/page.tsx`), the write-up archive (`src/app/writeups/page.tsx`), and generated write-up detail pages (`src/app/writeups/[slug]/page.tsx`).
- `next.config.mjs` sets `output: "export"` and `trailingSlash: true`; pages must therefore be statically renderable. Write-up detail routes come from `generateStaticParams()` in `[slug]/page.tsx`.
- Shared site chrome is in `src/components/Header.tsx` and `src/components/Footer.tsx`; `src/app/layout.tsx` supplies fonts, metadata, the header/footer, and the common content container.
- Site identity and contact details are centralized in `src/config/siteConfig.ts`. Project and article content are typed data in `src/data/projects.ts` and `src/data/writeups.ts`, which are consumed by the route components.
- Images and other public assets belong under `public/` and are referenced with root-relative URLs such as `/images/avatar.png`. Static image optimization is disabled for the GitHub Pages export.
- Styling is Tailwind CSS with shared theme tokens in `src/app/globals.css`; use the existing design tokens and utility patterns rather than introducing a separate styling system.

## Repository conventions

- Keep content changes in the data/config files: update `siteConfig.ts` for profile details, `projects.ts` for projects, and `writeups.ts` for articles. Avoid duplicating those values in page components.
- Project categories are the literal union `"cybersecurity" | "blockchain"` and determine which section renders a project. Preserve the `Project` shape and keep optional `demoUrl` omitted when there is no demo.
- Each write-up `slug` is a stable, lowercase, hyphen-separated URL identifier. The slug is used both by the archive link and `generateStaticParams`; changing a published slug changes its URL.
- Write-up bodies are trusted HTML stored in `contentHtml` template strings and rendered with `dangerouslySetInnerHTML`. Preserve valid HTML, escape backticks inside template strings, and use only trusted content.
- Use the existing `@/*` TypeScript import alias for `src/*`. Keep route components server-renderable by default; add `"use client"` only where browser state or event handlers are required, as in the write-up tag filter and theme switcher.
- Use `next/link` for internal navigation and the existing external-link pattern (`target="_blank"` with `rel="noopener noreferrer"`) for outbound links.
- Email configuration stores only the address in `siteConfig.socials.email`; components add the `mailto:` prefix.
- After content or layout changes, run `npm run build` from `portfolio-app` before publishing. Deployment occurs automatically from `main` through `.github/workflows/nextjs.yml`.

See [`guide.md`](../guide.md) for the detailed workflow for editing profile information, projects, write-ups, assets, and publishing.
