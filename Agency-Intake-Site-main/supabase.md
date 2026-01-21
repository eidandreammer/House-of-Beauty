Prompt: Implement Supabase backend (Edge Functions, JSONB schema, Auth + RLS, Captcha) for Intake

Act as: Senior full-stack engineer.
Repo: Current Next.js project.
Goal: Ship secure, production-ready intake storage and authentication using Supabase with Edge Functions, JSONB, RLS, and captcha. Use my existing multi-step intake UI.

0) Dependencies & env

Fix package name and add libs:

npm uninstall @supabse/supabase-js || true
npm i @supabase/supabase-js zod
# for Turnstile server verify:
npm i undici


Add env (fill with real values later):

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # server only
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=              # server only

1) Database schema (SQL migration)

Create supabase/migrations/000_init_intake.sql with:

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Orgs (a client can have many intakes)
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  website text,
  phone text,
  address text,
  domain text,
  created_at timestamptz default now()
);

-- Profiles: extra info for logged-in users (auth handled by Supabase)
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Optional trigger to auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user();

-- Organization membership (who can view/edit a client org)
create table public.org_members (
  org_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'client', -- 'client' or 'staff'
  primary key (org_id, user_id),
  created_at timestamptz default now()
);

-- Intakes (your form submissions)
create table public.intakes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,

  -- From screenshots:
  -- Business Info
  business_name text not null,
  industry text not null,
  address text not null,
  phone text not null,
  domain text,

  -- Goals & Pages
  goals text[] not null,                     -- ['Calls','Bookings','Orders','Lead Form']
  pages text[] not null,                     -- ['Home','Services','Blog','Products','About','Contact','Menu']

  -- Color & Branding (JSONB keeps flexibility)
  color jsonb not null,                      -- {selected:"#hex", mode:"Complementary|Analogous|Split|Triad|Tetrad|Monochrome|Monochrome Tints", palette:[#...]}
  typography jsonb not null,                 -- {headings:"Inter", body:"Inter", style:"Modern Sans", colorMode:"Auto|Light|Dark"}

  -- Template choice + inspiration
  templates text[] not null,                 -- e.g., ['Template A','Template B'] at least one
  inspiration_urls text[] default '{}',      -- up to 2 webflow links

  -- Additional features
  features text[] default '{}',              -- ['Booking','Gift Cards','Gallery','FAQ','Hours','Chat','Menu Catalog','Testimonials','Blog','Map','Contact Form','Analytics']

  -- Admin & plan
  timeline text,                             -- e.g., '3-4 weeks'
  plan text,                                 -- 'Basic'|'Standard'|'Premium'

  status text default 'new',
  created_at timestamptz default now()
);

-- Optional assets store (if uploading files)
create table public.intake_assets (
  id bigserial primary key,
  intake_id uuid not null references public.intakes(id) on delete cascade,
  kind text not null,          -- 'logo'|'brand_guide'|'gallery'
  path text not null,          -- storage path
  created_at timestamptz default now()
);

-- Helpful indexes for JSONB/arrays
create index on public.intakes using gin (goals);
create index on public.intakes using gin (pages);
create index on public.intakes using gin ((color));
create index on public.intakes using gin ((typography));


Enable RLS and policies (supabase/migrations/001_rls.sql):

alter table public.organizations enable row level security;
alter table public.org_members   enable row level security;
alter table public.profiles      enable row level security;
alter table public.intakes       enable row level security;
alter table public.intake_assets enable row level security;

-- Staff helper: any user with org_members.role='staff' has elevated org access
-- Profiles: users can read/update own profile
create policy "profiles_self_select" on public.profiles for select
  to authenticated using (user_id = auth.uid());
create policy "profiles_self_update" on public.profiles for update
  to authenticated using (user_id = auth.uid());

-- Organizations: staff can select/insert/update/delete; clients see only their orgs
create policy "orgs_staff_all" on public.organizations for all
  to authenticated using (
    exists (select 1 from public.org_members m
            where m.user_id = auth.uid() and m.role = 'staff'
           ));
create policy "orgs_client_select" on public.organizations for select
  to authenticated using (
    exists (select 1 from public.org_members m
            where m.user_id = auth.uid() and m.org_id = id
           ));

-- Org members: user can see their own membership rows; staff can see all
create policy "members_staff_select" on public.org_members for select
  to authenticated using (exists (
    select 1 from public.org_members m
    where m.user_id = auth.uid() and m.role = 'staff'
  ));
create policy "members_self_select" on public.org_members for select
  to authenticated using (user_id = auth.uid());

-- Intakes:
-- Read: staff read all; clients read rows for orgs they belong to
create policy "intakes_staff_read" on public.intakes for select
  to authenticated using (exists (
    select 1 from public.org_members m
    where m.user_id = auth.uid() and m.role = 'staff'
  ));
create policy "intakes_client_read" on public.intakes for select
  to authenticated using (exists (
    select 1 from public.org_members m
    where m.user_id = auth.uid() and m.org_id = org_id
  ));

-- Insert: normally via Edge Function with service role. Allow staff inserts from app.
create policy "intakes_staff_insert" on public.intakes for insert
  to authenticated with check (exists (
    select 1 from public.org_members m
    where m.user_id = auth.uid() and m.role = 'staff'
  ));

-- Update: staff only
create policy "intakes_staff_update" on public.intakes for update
  to authenticated using (exists (
    select 1 from public.org_members m
    where m.user_id = auth.uid() and m.role = 'staff'
  ));

-- Intake assets mirror intake access
create policy "assets_staff_read" on public.intake_assets for select
  to authenticated using (exists (
    select 1 from public.org_members m
    where m.user_id = auth.uid() and m.role = 'staff'
  ));
create policy "assets_client_read" on public.intake_assets for select
  to authenticated using (exists (
    select 1 from public.intakes i
    join public.org_members m on m.org_id = i.org_id
    where i.id = intake_id and m.user_id = auth.uid()
  ));


Note: We rely on Supabase Auth’s built-in auth.users table—no extra user table is needed. Use profiles for app-specific fields.

2) Edge Functions

Create two functions under supabase/functions:

a) intake-submit (secure intake + captcha + Zod)

supabase/functions/intake-submit/index.ts:

// Deno Edge Function
// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const Intake = z.object({
  // Business Info (from screenshots)
  business_name: z.string().min(2),
  industry: z.string().min(2),
  address: z.string().min(3),
  phone: z.string().min(7),
  domain: z.string().url().optional(),

  // Goals & Pages
  goals: z.array(z.enum(["Calls","Bookings","Orders","Lead Form"])).min(1),
  pages: z.array(z.enum(["Home","Services","Blog","Products","About","Contact","Menu"])).min(1),

  // Color & Typography
  color: z.object({
    selected: z.string(), // hex
    mode: z.enum(["Complementary","Analogous","Split","Triad","Tetrad","Monochrome","Monochrome Tints"]),
    palette: z.array(z.string())
  }),
  typography: z.object({
    headings: z.string(),
    body: z.string(),
    style: z.string().optional(),
    colorMode: z.string().optional()
  }),

  // Templates & Inspiration
  templates: z.array(z.enum(["Template A","Template B"])).min(1),
  inspiration_urls: z.array(z.string().url()).max(2).optional().default([]),

  // Features
  features: z.array(z.enum([
    "Booking","Gift Cards","Gallery","FAQ","Hours","Chat",
    "Menu Catalog","Testimonials","Blog","Map","Contact Form","Analytics"
  ])).optional().default([]),

  // Admin
  timeline: z.string().optional(),
  plan: z.string().optional(),

  // Org wrapper
  organization: z.object({
    name: z.string().min(2),
    website: z.string().url().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    domain: z.string().optional()
  }),

  // Captcha
  turnstileToken: z.string()
});

async function verifyTurnstile(token: string, ip?: string) {
  const body = new URLSearchParams({
    secret: Deno.env.get("TURNSTILE_SECRET_KEY")!,
    response: token
  });
  if (ip) body.set("remoteip", ip);
  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body
  }).then(r => r.json());
  return resp?.success === true;
}

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  try {
    const json = await req.json();
    const parsed = Intake.parse(json);

    const ok = await verifyTurnstile(parsed.turnstileToken, req.headers.get("CF-Connecting-IP") ?? undefined);
    if (!ok) return new Response(JSON.stringify({ error: "captcha_failed" }), { status: 400 });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Upsert org by name
    const { data: org } = await supabase
      .from("organizations")
      .insert({
        name: parsed.organization.name,
        industry: parsed.industry,
        website: parsed.organization.website ?? parsed.domain,
        phone: parsed.phone,
        address: parsed.address,
        domain: parsed.domain
      })
      .select().single();

    const { data: intake, error } = await supabase
      .from("intakes")
      .insert({
        org_id: org.id,
        business_name: parsed.business_name,
        industry: parsed.industry,
        address: parsed.address,
        phone: parsed.phone,
        domain: parsed.domain,
        goals: parsed.goals,
        pages: parsed.pages,
        color: parsed.color,
        typography: parsed.typography,
        templates: parsed.templates,
        inspiration_urls: parsed.inspiration_urls,
        features: parsed.features,
        timeline: parsed.timeline,
        plan: parsed.plan
      })
      .select().single();

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, intakeId: intake.id }), {
      status: 201, headers: { "content-type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 400 });
  }
});

b) auth-gate (captcha-gated sign-up/sign-in)

supabase/functions/auth-gate/index.ts:

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const { email, password, mode = "signin", turnstileToken } = await req.json();

  // Verify captcha
  const ok = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: Deno.env.get("TURNSTILE_SECRET_KEY")!,
      response: turnstileToken
    })
  }).then(r => r.json()).then(j => j.success === true);
  if (!ok) return new Response(JSON.stringify({ error: "captcha_failed" }), { status: 400 });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  if (mode === "signup") {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,                 // or email_confirm: false + invite flow
      email_confirm: true
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    return new Response(JSON.stringify({ ok: true, userId: data.user?.id }), { status: 201 });
  } else {
    // For classic sign-in, you normally use client SDK.
    // This gate simply green-lights after captcha.
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
});


Deploy functions (Cursor: add supabase/config.toml if missing) and ensure env for functions: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TURNSTILE_SECRET_KEY.

3) Wire the client
Intake submit (call Edge Function)

Update the intake submit handler to POST to:

POST ${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/intake-submit
Headers: { "Content-Type": "application/json", "Authorization": "Bearer " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY }
Body: the full intake JSON + turnstileToken

Sign-in / Sign-up with captcha

On /signin and /signup pages, add a Turnstile widget.

On submit, first POST to /functions/v1/auth-gate with { email, password, mode, turnstileToken }.

If ok:true and mode==='signin', proceed with supabase.auth.signInWithPassword({ email, password }).

If mode==='signup', you already created the user via admin—show confirmation or sign them in.

Client snippet (React):

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function handleSignin(email:string, password:string, turnstileToken:string){
  const gate = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/auth-gate`, {
    method:"POST",
    headers:{ "content-type":"application/json", "authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
    body: JSON.stringify({ email, password, mode:"signin", turnstileToken })
  }).then(r=>r.json());
  if(!gate.ok) throw new Error("Captcha failed");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if(error) throw error;
}


(Using hCaptcha instead? Replace the verification URL with https://hcaptcha.com/siteverify and env keys HCAPTCHA_SECRET / sitekey.)

4) Zod types shared with UI

Create lib/intake.schema.ts to align UI + Edge Function:

import { z } from "zod";
export const IntakeSchema = z.object({
  business_name: z.string().min(2),
  industry: z.string().min(2),
  address: z.string().min(3),
  phone: z.string().min(7),
  domain: z.string().url().optional(),

  goals: z.array(z.enum(["Calls","Bookings","Orders","Lead Form"])).min(1),
  pages: z.array(z.enum(["Home","Services","Blog","Products","About","Contact","Menu"])).min(1),

  color: z.object({
    selected: z.string(),
    mode: z.enum(["Complementary","Analogous","Split","Triad","Tetrad","Monochrome","Monochrome Tints"]),
    palette: z.array(z.string())
  }),
  typography: z.object({
    headings: z.string(),
    body: z.string(),
    style: z.string().optional(),
    colorMode: z.string().optional()
  }),

  templates: z.array(z.enum(["Template A","Template B"])).min(1),
  inspiration_urls: z.array(z.string().url()).max(2).optional(),

  features: z.array(z.enum([
    "Booking","Gift Cards","Gallery","FAQ","Hours","Chat",
    "Menu Catalog","Testimonials","Blog","Map","Contact Form","Analytics"
  ])).optional(),

  timeline: z.string().optional(),
  plan: z.string().optional(),

  organization: z.object({
    name: z.string().min(2),
    website: z.string().url().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    domain: z.string().optional()
  }),

  turnstileToken: z.string()
});
export type IntakePayload = z.infer<typeof IntakeSchema>;

5) Answering design questions in code

Do we need a user table for accounts?
No. Supabase Auth manages auth.users. Use profiles for extra fields.

JSONB usage: color, typography store flexible design tokens while staying queryable.

RLS: Enabled across tables; clients read their own org/intakes; staff can read all. Inserts come from staff or the service-role Edge Function.

No SSN/PHI: We are not collecting these; no special column encryption required now.

6) Deliverables

✅ SQL migrations for schema + RLS (supabase/migrations/...sql)

✅ supabase/functions/intake-submit (captcha + validation + DB insert)

✅ supabase/functions/auth-gate (captcha-gated sign-up/sign-in flow)

✅ lib/intake.schema.ts (shared Zod)

✅ Client wiring for intake submit & auth with captcha

✅ README updates: env vars, deploy steps (supabase functions deploy ...)

Return a summary of files changed and how to run locally (npx supabase start) and deploy.

Intake fields captured from screenshots (for reference)

Business Info:

Business Name (required)

Industry (required)

Address (required)

Phone (required)

Domain (optional)

Goals & Pages:

Goals: Calls, Bookings, Orders, Lead Form (check any)

Pages: Home, Services, Blog, Products, About, Contact, Menu (check any)

Color & Branding:

Selected Color (hex)

Harmony Mode: Complementary / Analogous / Split / Triad / Tetrad / Monochrome / Monochrome Tints

Generated Palette (array of hex)

Color Mode (Auto/Light/Dark)

Typography: Headings font, Body font (e.g., Inter)

Template Choice & Inspiration:

Template A and/or Template B (choose ≥1)

Inspiration URLs (up to 2 Webflow links)

Additional Features:

Booking, Gift Cards, Gallery, FAQ, Hours, Chat, Menu Catalog, Testimonials, Blog, Map, Contact Form, Analytics

Admin:

Timeline (e.g., “3–4 weeks”)

Plan (Basic / Standard / Premium)