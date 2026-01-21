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
  templates text[] not null,                 -- e.g., ['Style A','Style B'] at least one
  inspiration_urls text[] default '{}',      -- up to 2 inspiration websites

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
