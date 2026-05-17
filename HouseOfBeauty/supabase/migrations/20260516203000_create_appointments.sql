create extension if not exists btree_gist;
create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type type_record
    join pg_namespace namespace_record
      on namespace_record.oid = type_record.typnamespace
    where namespace_record.nspname = 'public'
      and type_record.typname = 'appointment_status'
  ) then
    create type public.appointment_status as enum (
      'confirmed',
      'cancelled',
      'completed',
      'no_show'
    );
  end if;
end
$$;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  phone text not null,
  service_name text not null,
  duration_minutes integer not null,
  status public.appointment_status not null default 'confirmed',
  start_time timestamptz not null,
  end_time timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_customer_name_length_check
    check (char_length(btrim(customer_name)) between 2 and 120),
  constraint appointments_email_length_check
    check (char_length(btrim(email)) between 5 and 320),
  constraint appointments_phone_length_check
    check (char_length(btrim(phone)) between 7 and 25),
  constraint appointments_service_name_length_check
    check (char_length(btrim(service_name)) between 2 and 160),
  constraint appointments_duration_minutes_check
    check (duration_minutes between 15 and 720),
  constraint appointments_end_after_start_check
    check (end_time > start_time),
  constraint appointments_end_matches_duration_check
    check (end_time = start_time + make_interval(mins => duration_minutes))
);

create index if not exists appointments_status_start_time_idx
  on public.appointments (status, start_time);

create or replace function public.set_appointments_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_overlapping_confirmed_appointments()
returns trigger
language plpgsql
as $$
begin
  if new.status <> 'confirmed' then
    return new;
  end if;

  if exists (
    select 1
    from public.appointments existing_appointment
    where existing_appointment.id <> coalesce(
      new.id,
      '00000000-0000-0000-0000-000000000000'::uuid
    )
      and existing_appointment.status = 'confirmed'
      and tstzrange(
        existing_appointment.start_time,
        existing_appointment.end_time,
        '[)'
      ) && tstzrange(new.start_time, new.end_time, '[)')
  ) then
    raise exception using
      errcode = '23P01',
      message = 'Appointment overlaps an existing confirmed appointment. Please choose another time.';
  end if;

  return new;
end;
$$;

drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at
before update on public.appointments
for each row
execute function public.set_appointments_updated_at();

drop trigger if exists appointments_prevent_overlapping_confirmed on public.appointments;
create trigger appointments_prevent_overlapping_confirmed
before insert or update of start_time, end_time, status on public.appointments
for each row
execute function public.prevent_overlapping_confirmed_appointments();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'appointments_no_confirmed_overlap'
  ) then
    alter table public.appointments
      add constraint appointments_no_confirmed_overlap
      exclude using gist (
        tstzrange(start_time, end_time, '[)') with &&
      )
      where (status = 'confirmed');
  end if;
end
$$;

alter table public.appointments enable row level security;
alter table public.appointments replica identity full;

comment on table public.appointments is
  'Single-resource salon appointments. Add a staff_id/resource_id column to the exclusion constraint if parallel stylists should be bookable.';

do $$
begin
  alter publication supabase_realtime add table public.appointments;
exception
  when duplicate_object then
    null;
end
$$;
