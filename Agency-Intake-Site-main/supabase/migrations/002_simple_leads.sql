create table if not exists public.leads (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	company text not null,
	role text not null check (role in ('Owner','Manager','Employee','Investor','Other')),
	email text not null,
	urgency text not null check (urgency in ('Soon','No Rush')),
	created_at timestamptz default now()
);

alter table public.leads enable row level security;

create policy if not exists "leads_staff_read" on public.leads for select
	to authenticated using (
		exists (select 1 from public.org_members m where m.user_id = auth.uid() and m.role = 'staff')
	);

create policy if not exists "leads_staff_insert" on public.leads for insert
	to authenticated with check (
		exists (select 1 from public.org_members m where m.user_id = auth.uid() and m.role = 'staff')
	);


