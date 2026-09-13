# KCPL — UI/UX refinement and implementation plan

Date: 13 September 2026

Status: Design and delivery plan; not a claim that proposed changes are implemented.

Scope: Public website, freight-enquiry experience and existing protected enquiry desk.
Delivery: One design direction, incremental implementation, tested private previews.

## 1. The decision

Build an editorial freight website with the clarity of an operations desk: strong photography, disciplined typography, short useful copy and unmistakable actions.

KCPL should feel established and capable of coordinating both international freight and demanding Nepal-side delivery. Project cargo is the distinctive capability, not a claim about the company's largest business segment.

Modernity should come from responsive behaviour, fast interactions, useful cargo tools and careful visual detail—not decorative complexity.

Priority order:

1. Working navigation, forms and access controls.
2. Clear shipment and service information.
3. Typography, photography, layout and mobile usability.
4. Helpful interaction and restrained motion.
5. Additional tools only after the core experience is dependable.

Do not redesign the brand, start another website, introduce a new architecture or recreate work from the old KCPL repository.

## 2. Starting point and targeted improvements

This plan uses the existing brief, known implementation history and a bounded source review. It is not a new comprehensive browser audit or competitor study.

Already present:

- Seven public pages, official KCPL logo exports and the verified palette.
- Structured public content and illustrative stock-image references.
- Persistent enquiries, private attachments and an authorised staff desk.
- Search, status filters, follow-up history and duplicate-submission protection.
- Native navigation links introduced after reported button problems.
- A browser-compatible request identifier and regression test for the submission crash.

Preserve these capabilities. Do not spend implementation time rebuilding them.

| Source-observed issue or limitation | Design response | Priority |
| --- | --- | --- |
| Several captions, labels and footer details use 9–11px text | Establish readable text roles; remove unnecessary microcopy instead of shrinking it | P0 |
| Only a regular font weight is currently supplied | Use genuine licensed weights if obtainable in one pass; otherwise design deliberately with regular weight | P1 |
| Contact information precedes the entire form on mobile | Put a compact contact line above the form; move extended office information below it | P0 |
| Form feedback is mainly one status paragraph | Add field-linked errors, an error summary, pending feedback and a distinct receipt panel | P0 |
| Staff list and detail stack into a long mobile page | Introduce a deliberate list-to-detail mobile flow with a clear Back action | P1 |
| Disabled buttons share a waiting cursor regardless of reason | Distinguish loading, unavailable, pagination boundary and completed states | P0 |
| Stock image references remain provisional | Verify, optimise and store selected assets once; replace weaker images with stronger layout | P1 |
| Browser interaction coverage has been narrower than server-side checks | Make actual click/tap flows a release gate; a successful build alone is insufficient | P0 |

P0 means essential reliability/accessibility. P1 means the main visual and workflow refinement. P2 means a bounded extension after P0/P1.

## 3. Audience and primary journeys

| Visitor | Main question | Intended journey | Successful outcome |
| --- | --- | --- | --- |
| Importer/exporter | Can KCPL coordinate this shipment? | Home → relevant service → enquiry | Understands scope and submits an actionable brief |
| Project contractor | Can the cargo reach this site? | Project cargo → planning requirements → project enquiry | Provides piece details and site constraints |
| Overseas forwarder | Who handles the Nepal-side stages? | Network → local responsibilities → partner enquiry | Reaches the correct coordination conversation |
| Procurement reviewer | Is this an established, credible company? | About + services + contact | Finds identity, capability and contact details without inflated claims |
| Authorised staff | What needs attention and what happens next? | Enquiry desk → record → follow-up | Reviews, updates and hands over without losing work |

The public site persuades through evidence. The staff desk prioritises work. They share the brand, not the same page composition.

## 4. Visual system

### Colour and surfaces

- Canvas: `#F6F6F3` for the principal public background.
- Ink: `#101010` for text, the project-cargo feature and footer.
- Crimson: `#DC143C` for the primary action, selected states and occasional technical emphasis.
- White: form fields and selected working surfaces, not a container around every section.
- Consolidate the existing collection of near-identical grey backgrounds into one secondary surface and one border token.
- Reserve additional semantic colours for actual success/warning/error states. Include text or symbols; never rely on colour alone.
- Do not put small crimson text on black without checking contrast. Do not use large red background sections repeatedly.

### Typography

Keep Geist as the single primary family. Add genuine 500/600 weights only if a licensed local export is readily available; do not simulate bold or start a font search project.

| Role | Mobile starting point | Desktop starting point | Treatment |
| --- | --- | --- | --- |
| Homepage headline | 46–56px | 76–96px | 1.02–1.08 line height; deliberate line breaks |
| Internal page title | 38–46px | 56–72px | Smaller than homepage, no repeated oversized introductions |
| Section heading | 30–36px | 40–52px | Sentence case except the chosen hero treatment |
| Body | 16–18px | 17–18px | 1.5–1.65 line height; approximately 55–70 characters per line |
| Form labels and navigation | 14–16px | 14–16px | Clear hierarchy; labels remain visible |
| Secondary technical metadata | 12–13px | 12–13px | Sparing uppercase; tabular numerals where useful |

These are starting values, not rigid pixel locks. Implement scalable `rem`/`clamp()` tokens and test text enlargement. Ease the current very tight headline tracking where letters feel crowded; begin around `-0.035em` to `-0.045em` and judge the actual typeface.

### Grid and spacing

- Desktop: 12-column alignment, approximately 1280–1320px maximum content width, 24–32px gutters.
- Tablet: 8-column alignment with fewer simultaneous columns.
- Mobile: 4-column alignment, 20px outer gutters at 375px; reduce to 16px only on narrower screens.
- Use a small spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px.
- Public section spacing: generally 80–104px desktop and 48–64px mobile; do not leave large empty bands just to appear premium.
- Controls: 48–56px high, square or subtly rounded up to 4px. Panels may use up to 6px where useful. Avoid pills and repeated floating cards.
- Use borders and surface contrast before shadows. Reserve shadows for a genuine overlay such as the mobile menu.

The signature composition is an asymmetric headline/image opening, a ruled service index and one substantial dark project-cargo section.

## 5. Page-by-page design

### Home

1. Compact header: official primary logo, five navigation destinations and Request a quote. Aim for 76–84px desktop and 68–76px mobile without crushing the logo.
2. Hero: retain “FROM NEPAL. TO THE WORLD.” with “International freight, customs and project logistics coordinated from Nepal.” Keep Kathmandu visible. Use one excellent industrial image and two actions maximum.
3. Services: a typographic, numbered list with concise scope; no eight-card grid. Put project cargo in this index, then give it a much stronger section below.
4. Operating proposition: a short explanation of international coordination, customs and final delivery access. Remove repetitive claims already made in services.
5. Project cargo: black canvas, strong image, a clear headline and the three planning lenses—cargo, route, site. Link to the detailed page.
6. Network: distinguish Kathmandu base from partner-supported coverage. Use a restrained directory, not an animated world map.
7. Process: four concise stages—Define cargo, Agree scope, Coordinate movement, Arrange delivery.
8. Enquiry prompt and substantial footer. Do not repeat the same large CTA after every short section.

Mobile: headline and primary action before the hero image; one clear reading order. The service list and project feature should remain recognisable without desktop-scale spacing.

### Services

- Use a compact introduction and a wrapping anchor index. Preserve ordinary anchor navigation.
- Each service answers: what is coordinated, what information is needed and what scope must be confirmed.
- Alternate the information rhythm with typography and rules, not a new visual treatment for every service.
- Enquire about this service preselects the form while keeping the choice editable.
- Use a lightweight “What to send us” disclosure for useful supporting detail. Never collapse the primary explanation or CTA.
- Warehousing remains enquiry-based until facilities and capacity are verified.

### Project cargo — the strongest capability page

Opening: “When the route becomes part of the job.” Follow with a short description of weight, dimensions, route access and delivery-site planning.

Build three editorial chapters:

| Chapter | Information to explain | Helpful interaction |
| --- | --- | --- |
| The cargo | Individual weight, dimensions, sensitive equipment and handling requirements | Expand a concise piece-information checklist |
| The route | Road width, bridges, turns, restrictions and border coordination | Reveal a labelled planning consideration; never invent a route or clearance |
| The site | Access, receiving arrangements, unloading and positioning scope | Link directly to project-enquiry guidance |

Below these, show up to three concise company-reported project records. Each has Cargo, Constraint, KCPL role and Verified outcome when available. Omit the outcome field if it is not supported. Do not imply infrastructure construction or engineering certification.

Authentic project photography can later support an accessible image gallery. Until available, separate illustrative photography from named project records; never caption a stock image as a specific KCPL movement.

Finish with “Discuss a project movement” and the information needed to begin. No speculative load calculator, bridge-capacity assessment or lifting recommendation.

### About

- Concise identity: founded in 2013, Kathmandu base, founder Ramesh Kumar Mishra, freight/customs/project logistics.
- Present “Clear scope. Clear handovers. Practical execution.” as working principles, not unsupported certifications or guaranteed performance.
- One factual company-information block and one relevant photograph are enough.
- Avoid a staff directory, invented company timeline or anonymous testimonials.

### Network / partners

- Separate “KCPL base: Kathmandu” from “Operational coordination through counterparts”.
- Describe Nepal-side support, India gateways, China–Nepal coordination and overseas air/ocean handovers.
- Use four aligned geographic information groups with clear ownership labels.
- Prefer this directory to a map. Add a geographic illustration only if locations and its practical purpose are verified; no fictional shipping arcs.
- Offer a dedicated partner-enquiry choice within the existing contact flow, not another form system.

### Contact / request a quote

- Replace the oversized introduction with a concise heading and immediate form access.
- Desktop: form as the dominant column; contact and help in a narrow supporting column.
- Mobile: compact email/contact line, then form, then extended office information.
- Keep one page with three numbered sections: Shipment, Contact, Supporting details. Avoid a mandatory wizard that hides requirements or depends on fragile transitions.
- The detailed behaviour is specified in section 6.

### Privacy and shared footer

Use straightforward readable text. Describe actual storage, uploads, authentication and contact practices. Keep private-review notices distinct from production privacy copy.

The footer includes identity, Kathmandu location, public contact, service/navigation links and privacy. Add a small Staff access link only when the authorised sign-in flow is confirmed; it must not resemble a customer login or tracking portal.

## 6. Freight-enquiry UX

### Core fields and disclosure

Required: name, email, origin, destination, service and cargo description. Company and phone remain optional unless operations establishes a genuine requirement. Do not force invented weights or dimensions to proceed.

Keep cargo-ready date, package count, weight, dimensions, handling requirements and attachments available. Provide “Not yet known” guidance rather than treating uncertain information as zero.

Selecting project cargo reveals individual-piece and site-access guidance. Selecting partner enquiry changes the supporting questions toward Nepal-side responsibilities; it must not erase already-entered information.

Use native selects and date inputs where practical. Do not add paid address autocomplete, map APIs or account creation to a freight enquiry.

### Attachments

- Keep the current limit: three PDF/JPEG/PNG files, maximum 2 MB each, until storage policy changes.
- After selection, display filename, size, validation result and a clearly labelled Remove action for each file before submission.
- Put file restrictions beside the picker, before an error occurs.
- Provide a file-picker alternative to drag-and-drop; drag-and-drop is optional desktop enhancement.
- Do not claim virus scanning. Current files are not malware-scanned.
- Explain how to arrange transfer of larger technical drawings; do not increase limits merely for visual convenience.

### Submission state contract

| State | What the visitor sees | Required behaviour |
| --- | --- | --- |
| Loading interactive form | Brief “Loading enquiry form…” and visible direct-email option | Never leave controls silently disabled indefinitely |
| Ready | Send freight enquiry | Native validation plus readable field labels |
| Invalid | Specific field errors and a linked summary | Focus the summary/first error; preserve all entries |
| Sending | Sending your enquiry… | Prevent duplicates; announce progress; no invented percentage |
| Slow response | Still waiting for confirmation; do not submit a second enquiry | Preserve the idempotency key; allow a safe retry after a bounded timeout |
| Failed/unconfirmed | Receipt could not be confirmed; Retry and email fallback | Keep entries and file-selection state where possible; do not show success |
| Saved | Receipt reference and what happens next | Display only after durable backend confirmation; make reference easy to copy |
| Repeat of the same submission | The existing receipt | Do not create a second enquiry |

Do not automatically persist shipment details in browser storage. Maintain in-page state; offer an explicit copy/download summary if needed. Reset only on an intentional new-enquiry action or confirmed submission workflow.

The receipt must distinguish enquiry receipt from a booking, accepted quotation or transport commitment. Do not promise a response time. Do not claim a confirmation email was sent unless an actual email service confirms it.

## 7. Protected enquiry desk

Design a practical workspace, not a dashboard marketing page.

- Compact heading; search and status filter immediately available.
- Desktop: list/detail split, roughly 40/60. Route and company are primary; receipt and timestamp are secondary.
- Mobile: selecting a record opens a dedicated detail view. Back returns to the previous filters and list position. Avoid forcing staff to scroll through the whole list to reach the detail.
- Text status labels: New, Reviewing, Awaiting details, Quoted, Closed. No coloured dots without labels.
- Keep cargo information, files and follow-up visually separate. Put the next action near the information it changes.
- Show the last successful refresh time. Refresh must provide visible completion feedback even when no records changed.
- Warn about unsaved notes before changing records or leaving. Do not silently overwrite notes on a refresh or concurrent update.
- On a stale version, retain the note and offer Reload latest details before saving again.
- Use a distinct empty state for “No enquiries yet” versus “No matches”; provide Clear filters only when relevant.
- Files remain authorised downloads. No public object links, share-all controls or public customer-status lookup.
- On expired authentication, explain that sign-in is required; never let an HTML login response look like a successful save.

Do not add charts, revenue summaries, live shipment tracking, internal pricing tools or a second administration platform.

## 8. Modern effects — exact, restrained specifications

| Effect | Placement and trigger | Starting specification | Fallback / guardrail |
| --- | --- | --- | --- |
| Link/CTA response | Hover, keyboard focus and press | 140–180ms colour/border change; arrow translates at most 3px | No hover-only information; no movement with reduced motion |
| Editorial section entrance | First viewport entry | 220–320ms opacity/translate, maximum 10px; play once | Base HTML remains visible if scripts fail; skip for reduced motion |
| Industrial image emphasis | Desktop pointer hover | Optional 1.015× scale over 350ms inside a fixed crop | Never on touch; no parallax or layout shift |
| Header refinement | Scroll beyond the opening | Add a subtle divider; retain fixed header dimensions | No shrinking layout, disappearing nav or opaque glass effects |
| Planning disclosure | Project-cargo supporting detail | Native disclosure or existing accessible primitive; 160–220ms if supported | Keyboard-operable and instant without animation |
| Working-state feedback | Save, search and refresh | Small spinner only while pending; persistent text outcome | No confetti, fake progress, looping activity or success-only toast |

Implement essential controls first and add these effects last. Never animate the receipt reference, required form labels or staff records into unreadability.

Explicit exclusions: animated globes, particle backgrounds, cursor trails, magnetic buttons, scroll hijacking, autoplay hero video, 3D cargo models, perpetual marquees, gradient blobs and full-site page transitions.

## 9. Tools and feature priorities

Use the existing React/TypeScript, Next.js App Router, Tailwind and Sites-compatible runtime. Preserve the current package manager, lockfile, D1/R2 bindings and auth boundaries. Prefer CSS, native HTML, Web Crypto and IntersectionObserver over new packages. Reuse installed accessible primitives when they fit; do not add a second component system or animation framework.

| Feature | Decision | Dependency / boundary | Relative effort |
| --- | --- | --- | --- |
| Clear enquiry sections and field errors | P0, core release | Existing intake API; server validation remains authoritative | Medium |
| Receipt copy and readable shipment summary | P1, core release | Use real saved reference; no public record disclosure | Small |
| Attachment selection/removal feedback | P1, core release | Existing storage restrictions | Medium |
| Staff list/detail mobile view | P1, core release | Preserve filters and unsaved-note protection | Medium |
| Service-aware information checklist | P1, core release | Grounded public content; not customs/legal advice | Small |
| Repeated individual-piece entry | P2 | Requires validated structured payload and compatible storage before UI release | Medium |
| Inline cargo-volume helper | P2, only with piece entry | Quantity × L × W × H after explicit unit conversion; show cubic metres, not prices or chargeable weight | Small |
| Authentic project image gallery | P2, asset-dependent | Approved photographs, truthful captions, accessible controls | Medium |
| Automated receipt and staff-notification emails | Separate operational gate | Approved provider, recipient ownership, failure handling and privacy update | Medium |

For the volume helper, do not add unknown dimensions as zero. Keep piece count separate from number of identical packages; label the result an estimate based on supplied outer dimensions. Do not infer freight rates, road suitability or lifting safety.

Not in this refinement: AI chatbot, instant freight pricing, carrier tracking, customer accounts, payments, CRM migration, full CMS, automatic Drive publication or multilingual duplication without reviewed translations. These are separate products or integrations, not visual polish.

## 10. Photography and content controls

- Reuse existing official logo exports; do not redraw the Gateway K.
- Use one consolidated image pass during implementation. Shortlist 8–12 only if existing assets are insufficient; use approximately 6–10 strong final images across the site, not per page.
- Prioritise terminal scale, industrial equipment, freight handling and difficult-access contexts. Reject prominent competitor branding and staged corporate stock.
- For selected images, record source, usage basis, credit requirement, alt text, focal point and intended crop in the existing content structure.
- Store optimised assets locally where permitted. Reserve dimensions and provide a considered fallback for failures.
- The first authentic replacements should be a strong project-cargo wide shot, transformer movement detail, site-access context and a clean company/location photograph.
- Use only approved assets from the project archive; do not publish whole Drive folders or source documents.
- No invented customers, statistics, awards, offices, fleets, guarantees or project outcomes. Geography and stock captions must remain truthful.

## 11. Accessibility and responsive acceptance

Target WCAG 2.2 AA; do not claim conformance merely because an automated test passes. Verify keyboard access, visible and unobscured focus, semantic headings, accessible names, labelled errors, status announcements, colour contrast and reflow. Use at least 4.5:1 contrast for normal text and 3:1 for large text, with applicable control-contrast checks. Support 200% text enlargement and a 320 CSS-pixel reflow test. Use 44–48px touch targets as KCPL's design target, not as a statement of the AA minimum. Respect reduced motion. [Reference: W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Test at 375, 768, 1024, 1440 and 1920px; add 320px as a narrow-screen stress test. For each breakpoint inspect heading wraps, image crops, menu access, form controls, attachment names, long email addresses, reference wrapping and footer order.

Mobile menus must open and close by touch and keyboard, restore focus appropriately, remain within the viewport and not trap scrolling. Sticky elements must not cover validation messages, focused controls or the on-screen keyboard. Do not add a bottom CTA bar by default; use one only if testing demonstrates a need and it does not obstruct forms.

## 12. Performance and quality measurement

Adopt targets of LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the 75th percentile where field data becomes available. Lab checks are diagnostic, not proof of real-user performance. [Reference: web.dev Web Vitals](https://web.dev/articles/vitals)

Project delivery budgets, to be measured rather than assumed achieved:

- Public first-page compressed transfer target: approximately 1 MB or less, excluding deferred images.
- Hero image target: approximately 250–350 KB at its appropriate display size; use a smaller mobile candidate.
- Add no animation framework. Aim to add no more than 20 KB gzip of optional enhancement JavaScript across public pages.
- Reserve image dimensions, preload only the essential font/hero resource, and defer below-fold imagery.
- Keep staff-only code out of public page bundles where the framework allows.

Before analytics exists, use a short usability script: find a relevant service, prepare a project enquiry, recover from an error and review a record. Record task completion and confusion; do not invent conversion benchmarks. Add analytics only after a separate privacy and measurement decision, and never log enquiry text, emails or documents as event properties.

## 13. Efficient implementation sequence

Use one lead implementation pass. Do not create an agent for each page. If a specialist is genuinely needed and authorised, give one bounded review task rather than duplicating the build.

| Slice | Implement | Validate before saving/publishing | What remains usable if work stops |
| --- | --- | --- | --- |
| A — Foundation | Type/spacing tokens, contrast, control states, header/footer | Desktop/mobile nav, focus, text zoom, existing enquiry smoke flow | Entire current site with improved shared styling |
| B — Public presentation | Home, services, project cargo, About and Network using the same system | Representative mobile/desktop views, service links, image failures, factual copy | Fully navigable public site; existing intake preserved |
| C — Enquiry experience | Reordered layout, errors, files, receipt and fallback | Real browser submission using synthetic data; retry/duplicate/file/error cases | Complete enquiry workflow, not a half-built wizard |
| D — Staff refinement | Mobile detail flow, refresh feedback, clear states | Authorisation, filtering, selection, save, conflicts and downloads | Existing protected operations remain available |
| E — Final polish | Selected motion and final accessibility/performance pass | Reduced motion, keyboard, click/tap regression, production build | Review-ready refinement |

P2 tools are a later bounded slice, not a reason to delay A–E.

Efficiency rules:

1. Read this plan and the affected files only. Do not repeat company research, mailbox review or brand discovery.
2. Make one image pass and one typography decision. No parallel visual concepts.
3. Batch shared-component and CSS changes; inspect one representative public page and the enquiry form early.
4. Run fast relevant checks during a slice; run lint, typecheck and the production build at release checkpoints, not after every trivial edit.
5. Do one broad QA pass after the core slices, then retest the affected failures. Avoid open-ended polishing loops.
6. Reuse passing evidence when the relevant code did not change. Do not confuse backend tests with browser interaction tests.
7. Keep progress updates short: completed slice, current issue, next deliverable. No repeated planning reports.

## 14. Usage-limit and interruption protocol

Do not depend on detecting the last moment of an account usage limit. Exact remaining quota may not be visible. Save at meaningful checkpoints instead.

- Keep this Markdown plan as the durable source of decisions.
- During implementation, maintain one short checkpoint note: current slice, completed changes, tests actually run, known issues, branch/commit, private preview version and exact next action. Never record credentials or customer data.
- At each coherent slice, save the source in `build/v1-public-website`. Use a few meaningful commits; keep the review PR current without merging.
- When time/context/tool limits appear close, stop adding features and reserve the remaining capacity for verification and handoff. Approximately the final fifth of the planned work window is a planning allowance, not measured account telemetry.
- Publish completed, tested slices to the existing owner-private preview when implementation is authorised. Preserve its current audience and project identity.
- Never publish broken navigation, a nonfunctional form, unsafe permissions, a skeleton page or an unfinished schema migration simply to beat a limit.
- If the partial work cannot pass the essential checks, save it on the development branch with its incomplete status and retain the last known-good private preview. Report exactly what was saved and what was not published.
- A publish is complete only when the hosting service confirms success. If publishing is interrupted or fails, retain the saved version identifier and resume that operation; do not create duplicate projects or pretend the update is live.
- On continuation, read the checkpoint and inspect the branch difference once. Continue the next unfinished slice instead of researching or rebuilding from scratch.

For this planning task, publish/save the Markdown deliverable only. A plan does not justify changing runtime infrastructure or deploying a redesign. Public launch, DNS changes and merging to main still require explicit approval.

## 15. Release gate — no exceptions for visual polish

- [ ] Every public navigation and CTA destination works on click and keyboard activation.
- [ ] Mobile menu opens/closes, stays visible and returns focus correctly.
- [ ] Selecting a service reaches a usable enquiry form with the expected editable selection.
- [ ] Form works in the supported browser contexts; no unhandled browser-API assumptions.
- [ ] Invalid, pending, failed, successful and duplicate submissions produce truthful feedback.
- [ ] Attachments are checked before submission and on the server; downloads remain protected.
- [ ] Staff loading, empty, filtered, selected, saved, denied and conflict states are understandable.
- [ ] Direct URL loading, refresh, back navigation and a stale open tab are tested.
- [ ] Typography, images and controls work at the agreed breakpoints and with reduced motion.
- [ ] No stock photograph, company claim or project example implies unsupported ownership or responsibility.
- [ ] Typecheck, lint, production build and relevant regression tests pass.
- [ ] Browser-only tests use the supported preview; do not claim to have tested the deployed UI when only server responses were checked.
- [ ] If deployed-browser verification is unavailable, state that limitation and obtain owner verification before calling the issue fully resolved.
- [ ] The private release is confirmed, the plan/checkpoint is saved, and the public production website is untouched.

## 16. Completion standard

The finished experience should let a procurement reviewer understand KCPL quickly, let a shipper submit a useful enquiry without confusion, and let authorised staff act on it without losing information.

Success is a coherent, credible and dependable KCPL website. “Best in Nepal” is the quality ambition—not a marketing claim to print on the page.
