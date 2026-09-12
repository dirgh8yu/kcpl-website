# Kapileshwor Cargo — public website V1

A new Next.js App Router, TypeScript and Tailwind website. No code or architecture from the older KCPL repository is used.

## Local preview

Node.js 22 or newer:

```sh
git clone --branch build/v1-public-website https://github.com/dirgh8yu/kcpl-website.git
cd kcpl-website
npm ci
npm run dev
```

Open http://localhost:3000. No hosting account or secrets are needed.

```sh
npm run lint
npm run typecheck
npm run build
npm run test:smoke
npm start
```

## Pages and content

Home, Services, Project Cargo, About, Network / Partners, Contact / Quote, and Privacy Notice. Public business copy lives in `content/`. Official primary/reversed logos and Gateway K SVG exports live in `public/brand/`. These came only from the Figma logo masters; no Figma layouts were reused.

The enquiry builder prepares an editable email draft and offers a clipboard fallback. It does not transmit enquiries to a backend and never claims they were submitted. Form controls remain disabled until hydration to prevent native form submissions exposing enquiry data in a URL. Direct email works without JavaScript.

## Review status

Production build, TypeScript and lint pass. HTTP checks found one H1 per page, working internal routes and fragment links, and noindex review metadata. Browser visual and interactive checks could not run in the authoring environment: its browser blocks localhost. Those checks remain required at 375px, tablet and desktop widths.

Photographs are provisional Unsplash references, centrally listed in `content/images.ts`. Downloading and visually verifying their final crops was blocked in the authoring environment. Five candidates are wired into layouts with truthful illustrative captions and a graceful load-error fallback. This is not the final approved photo selection. Before approving V1, inspect each referenced photograph for relevance, quality and branding, then replace weak images. Project cargo especially needs a verified heavy-equipment image. Do not present stock as a KCPL-owned vehicle, site or completed project.

## Before production

- Finish photography and rendered desktop/mobile review; verify the enquiry draft, copying, keyboard navigation and reduced-motion behavior in a browser.
- Confirm the enquiry mailbox and current business address. The mailbox appears in the company profile; the inconsistent office floor is intentionally omitted.
- Confirm any additional project details before adding results, dates, weights or third-party names. Current project references are company-reported logistics roles.
- Set `NEXT_PUBLIC_SITE_URL` to the confirmed canonical HTTPS origin. This enables canonical URLs and sitemap entries. Review builds default to localhost metadata and stay noindex.
- Set `SITE_INDEXABLE=true` only for the approved production build. Review builds disallow crawling.
- Confirm hosting-specific request logging and retention, and complete the Privacy Notice accordingly. Review again if adding a hosted form or analytics.
- Merge, deployment and DNS changes require the owner's separate approval. This repository contains no deployment workflow or production configuration.

No confidential operational correspondence or source research is included.
