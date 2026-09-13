# Kapileshwor Cargo public website

Development/review build. The Sites review URL is publicly accessible with KCPL approval. Do not merge to main or change KCPL's production domain without separate approval.

## Runtime

Next.js App Router / TypeScript / Tailwind, with the Sites-supported Vinext build adapter for Cloudflare Workers. Existing KCPL public pages and brand assets are retained. D1 stores enquiries, attachment metadata, follow-up history and short-lived abuse counters; R2 stores private attachment bytes. No customer data belongs in Git.

Use the declared pnpm version and lockfile. Build with the Sites build helper or `npm run build`; run `npx tsc --noEmit` and `npm run lint`. Generate schema-only migrations with `npm run db:generate`. Applied migrations are immutable.

## Configuration

Configure runtime values in Sites, never in committed files:

- SITE_ORIGIN: exact HTTPS origin, without a trailing slash.
- STAFF_EMAILS: comma-separated authorised staff accounts; empty denies all access.
- RATE_LIMIT_SECRET: a cryptographically random secret for short-lived network hashes.
- NEXT_PUBLIC_SITE_URL: canonical review/production origin.
- SITE_INDEXABLE: false during review.

The hosting manifest keeps logical DB and BUCKET bindings only. Sites owns their provisioning. Hosted authentication depends on dispatch-verified ChatGPT identity headers. Do not run this server directly on an untrusted public ingress that accepts caller-supplied identity headers. Any hosting migration requires a verified authentication adapter.

## Enquiry workflow

/contact submits validated multipart data. Receipt references are returned only after database storage succeeds. UUID idempotency keys prevent duplicate saves on identical retries. Three attachments maximum, each 2 MB, PDF/JPEG/PNG signatures only. Download endpoints require staff authorisation and force download; files are not malware-scanned. Intake limits are ten attempts per network per hour, plus bounded bodies, a honeypot and same-origin checks. This is baseline abuse protection, not a substitute for production monitoring.

/staff provides search, status filters, pagination, cargo details, private documents, notes and status history. Optimistic versions reject stale edits. No automated messages, carrier tracking, booking confirmations or price calculations are claimed.

## Verification

After a build, apply generated migrations to the local Worker database using the starter's documented Wrangler command. `node tests/run-worker.mjs` starts a loopback-only Worker and exercises intake, duplicate prevention, authentication, documents, concurrent edits, limits and public page smoke checks. It uses synthetic local data only. Never run mutation tests against production.

## Before real customer use

Confirm staff access, enquiry ownership and follow-up procedure; configure a verified transactional email provider if notifications are required; establish retention/deletion and recovery procedures; review attachment scanning and public abuse controls; complete authenticated hosted workflow review. Use demonstration data in the review site. KCPL's existing production website, DNS and GitHub main remain unchanged.
