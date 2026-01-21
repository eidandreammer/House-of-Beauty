MASTER PROMPT A — Build my agency site + intake (paste into Cursor)

Role: You are a senior full-stack engineer + UX designer.
Goal: Build a beautiful, performant, accessible marketing site for my small-business web design service, with a production-ready intake system that captures style preferences (including a Canva-style color wheel), feature needs, and up to two inspiration template links.

Visual direction: Use edenwebsite.web.app as visual inspiration (overall polish, modern sans typography, generous white space, soft shadows, balanced color accents). Do not copy code. Elevate aesthetics with clean grid, tasteful motion, and crisp mobile layout.

Stack & infra

Next.js (App Router) + React + Tailwind CSS

Zod for schema validation, React Hook Form for forms

Supabase (or Airtable) for storing intake submissions + file URLs

TypeScript everywhere; ESLint + Prettier

Deploy: Vercel (include CI config), environment variables for secrets

Pages & IA

Home, Work, How It Works, Pricing, FAQs, Contact

Start a Project (Intake) — embedded multi-step form

Reusable components: Header (sticky), Mobile Drawer, Hero, Feature Grid, Testimonials, Before/After gallery, Footer

SEO: metadata, OG/Twitter, sitemap, robots.txt

Schema.org LocalBusiness

Intake form (multi-step)

Business basics: name, industry, address, phone, domain, socials

Goals & scope: conversions (calls, bookings, orders, lead form), desired pages (Home/About/Services/Contact/Blog/Menu/Products)

Style reference: up to 2 “site I like” URLs + “what you like” textarea

Color & branding: live color wheel + harmony selector (complementary/analogous/split/triad/tetrad/mono/mono-tints). Live palette preview with hex tokens; copy-to-clipboard. Implement with react-colorful (or iro.js) + culori for harmony math.

Typography: choose vibe (modern, classic serif, geometric sans, playful) + Google Fonts (two families)

Template choice: let user select Template A or Template B (your house templates) and/or paste up to 2 Webflow template URLs for inspiration (structure only, no code copying)

Features: booking, menu/catalog, gift cards, testimonials, gallery, blog, FAQ, map, hours, contact form, chat, analytics

Assets: logo, brand guide, images, copy (or “write it for me”)

Admin & budget: timeline, plan (basic/standard/premium), preferred launch window

Validation schema (Zod)

Implement the schema exactly as provided in my notes (business, goals, pages, referenceUrls≤2, color{brand,mode,palette[]}, fonts{headings,body}, templates≤2, features[], assets.logoUrl?, content.tagline?, content.about?).

Design tokens + theming

Create lib/tokens.ts that converts intake → { colors, radius, spacing, fonts }; wire into Tailwind config and CSS variables. Persist tokens per submission.

Template previews

Ship Template A (conversion-focused one-pager) and Template B (editorial multi-page). Show thumbnails, live previews, and selection controls in the intake.

Motion & micro-interactions

GPU-accelerated transforms/opacity; 160–220ms; easing cubic-bezier(.2,.8,.2,1)

Tap/hover states with subtle elevation/scale; focus-visible rings

Respect prefers-reduced-motion

Accessibility & performance

Semantic landmarks, keyboardable menus, label/aria for form inputs

Lighthouse targets: Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95

CLS ≤ 0.05; LCP ≤ 2.5s on mid-range mobile; lazy images + srcset

Analytics & CRM

Capture events for CTA clicks and form progress; send conversion pings

Optional webhook to notify me on new submission (email/Slack)

Code I expect back

Full Next.js repo with pages, components, app/api/intake route (POST stores JSON + asset URLs to Supabase/Airtable; GET returns sanitized submission)

components/ColorWheel.tsx using react-colorful + culori to compute harmonies; palette chips push chosen hex into tokens

components/TemplatePicker.tsx supporting 2 house templates and up to 2 Webflow URLs as inspiration

lib/zod.ts, lib/tokens.ts, lib/seo.ts, lib/schema.ts (LocalBusiness JSON-LD)

README.md with env setup, scripts, and deployment steps

Minimal unit tests for helpers + Playwright smoke test for the intake flow

Absolute rules

No copying code from Canva, Adobe, or Webflow. Implement original UI/logic.

Strong mobile-first layout.

Ship with sensible demo content I can replace.

Return: repository tree, key files inline, setup commands, and a short “How to customize” section.

