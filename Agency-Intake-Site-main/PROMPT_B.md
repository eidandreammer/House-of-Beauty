MASTER PROMPT B — Generate a client site from an intake JSON (paste into Cursor)

Role: Code-gen agent.
Input: JSON at https://{my-domain}/api/intake/{projectId} with fields:
business, goals, pages, color{brand,mode,palette[]}, fonts{headings,body}, templates[], features[], content{tagline?, about?}, assets{logoUrl?}.
Tasks:

Scaffold Next.js + Tailwind + TS project.

Create lib/tokens.ts from JSON; inject tokens into Tailwind + CSS variables.

Choose Template A (one-pager) or Template B (multi-page) based on templates[0] or inferred layout from pages.

Generate pages (Home/About/Services/Contact [+ optional: Blog, Menu, Products, FAQ]) with accessible Header/Nav, Hero, CTA band, Features, Gallery/Testimonials, Map/Hours/Booking as needed.

Wire features per flags (booking links, catalog/menu section, testimonials data, contact form with validation + spam honeypot).

Add schema.org for the business type (default LocalBusiness, override by industry), OG/Twitter tags, robots/sitemap.

Add analytics events for primary CTAs (calls, bookings, orders, lead form).

Provide README.md with how to edit content/tokens, commands, and deploy steps (Vercel).

Run lint/test/build; output production build artifacts.

Deliverables: Full repo tree, generated code files, commands to run, and a summary of applied tokens (brand hex + harmony palette, fonts, spacing/radius).