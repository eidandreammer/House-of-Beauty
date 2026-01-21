-- Enable RLS on all tables
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
