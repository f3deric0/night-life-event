-- Night Life Event / Phase 1a: secure core schema.
-- REVIEW BEFORE APPLYING: designed for Supabase PostgreSQL, not applied by this PR.
-- No real identity, event or guest records. DDL only.
-- Auth identities are managed by Supabase Auth (auth.users).
-- SQL is executed as a trusted migration owner with DDL privileges.

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
  default_timezone text not null default 'Europe/Brussels',
  created_at timestamptz not null default now()
);

create table public.staff_profiles (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  login_username text not null unique check (
    login_username = lower(login_username)
    and login_username ~ '^[a-z0-9][a-z0-9_.-]{2,63}$'
  ),
  display_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.staff_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  auth_user_id uuid not null references public.staff_profiles(auth_user_id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'staff')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, auth_user_id),
  unique (id, organization_id)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
  title text not null check (length(btrim(title)) between 1 and 200),
  venue text not null default '',
  timezone text not null default 'Europe/Brussels',
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity integer check (capacity is null or capacity > 0),
  registration_deadline timestamptz,
  status text not null default 'draft' check (
    status in ('draft', 'open', 'closed', 'completed', 'cancelled')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at),
  unique (organization_id, slug),
  unique (id, organization_id)
);

create table public.staff_event_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  membership_id uuid not null,
  event_id uuid not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  foreign key (membership_id, organization_id)
    references public.staff_memberships(id, organization_id) on delete cascade,
  foreign key (event_id, organization_id)
    references public.events(id, organization_id) on delete cascade,
  unique (membership_id, event_id)
);

create table public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  event_id uuid not null,
  code_hash text not null unique check (code_hash ~ '^[0-9a-f]{64}$'),
  kind text not null check (kind in ('personal', 'shared')),
  max_redemptions integer not null check (max_redemptions > 0),
  redeemed_count integer not null default 0 check (redeemed_count >= 0),
  promoter_label text,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (redeemed_count <= max_redemptions),
  check (kind = 'shared' or max_redemptions = 1),
  foreign key (event_id, organization_id)
    references public.events(id, organization_id) on delete cascade,
  unique (id, event_id, organization_id)
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  first_name text not null check (length(btrim(first_name)) between 1 and 160),
  last_name text not null check (length(btrim(last_name)) between 1 and 160),
  normalized_email text not null check (
    normalized_email = lower(btrim(normalized_email))
    and normalized_email like '%@%'
    and length(normalized_email) <= 320
  ),
  created_at timestamptz not null default now(),
  unique (organization_id, normalized_email),
  unique (id, organization_id)
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  event_id uuid not null,
  guest_id uuid not null,
  invite_code_id uuid not null,
  email_verified_at timestamptz,
  rsvp_status text not null default 'unanswered'
    check (rsvp_status in ('unanswered', 'yes', 'no')),
  rsvp_at timestamptz,
  admission_status text not null default 'pending'
    check (admission_status in ('pending', 'admitted', 'waitlisted', 'cancelled', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (rsvp_status = 'unanswered' or email_verified_at is not null),
  check (admission_status <> 'admitted' or (rsvp_status = 'yes' and email_verified_at is not null)),
  foreign key (event_id, organization_id)
    references public.events(id, organization_id) on delete cascade,
  foreign key (guest_id, organization_id)
    references public.guests(id, organization_id) on delete cascade,
  foreign key (invite_code_id, event_id, organization_id)
    references public.invite_codes(id, event_id, organization_id),
  unique (event_id, guest_id),
  unique (id, event_id, organization_id)
);

create table public.code_claims (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null unique,
  code_id uuid not null,
  event_id uuid not null,
  organization_id uuid not null,
  state text not null default 'held' check (state in ('held','consumed','released')),
  held_until timestamptz,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  check (state <> 'held' or held_until is not null),
  check (state <> 'consumed' or consumed_at is not null),
  foreign key (registration_id, event_id, organization_id)
    references public.registrations(id, event_id, organization_id) on delete cascade,
  foreign key (code_id, event_id, organization_id)
    references public.invite_codes(id, event_id, organization_id)
);

create table public.guest_verification_tokens (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  purpose text not null default 'verify_email'
    check (purpose in ('verify_email', 'guest_access')),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.rsvp_history (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  previous_status text not null check (previous_status in ('unanswered','yes','no')),
  next_status text not null check (next_status in ('unanswered','yes','no')),
  changed_at timestamptz not null default now()
);

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  event_id uuid not null,
  registration_id uuid not null,
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  status text not null default 'issued'
    check (status in ('issued','queued','emailed','checked_in','revoked')),
  issued_at timestamptz not null default now(),
  emailed_at timestamptz,
  checked_in_at timestamptz,
  revoked_at timestamptz,
  rotation_number integer not null default 0 check (rotation_number >= 0),
  foreign key (registration_id, event_id, organization_id)
    references public.registrations(id, event_id, organization_id) on delete cascade,
  unique (id, event_id, registration_id, organization_id)
);

create unique index tickets_only_one_active_per_registration
  on public.tickets(registration_id)
  where status in ('issued', 'queued', 'emailed', 'checked_in');

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  event_id uuid not null,
  registration_id uuid not null,
  ticket_id uuid not null unique,
  staff_user_id uuid not null references public.staff_profiles(auth_user_id),
  method text not null check (method in ('qr','manual')),
  reason text,
  checked_in_at timestamptz not null default now(),
  foreign key (ticket_id, event_id, registration_id, organization_id)
    references public.tickets(id, event_id, registration_id, organization_id)
);

create table public.scan_attempts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  event_id uuid not null,
  registration_id uuid,
  ticket_id uuid,
  staff_user_id uuid not null references public.staff_profiles(auth_user_id),
  result text not null check (result in ('accepted','denied')),
  reason text,
  attempted_at timestamptz not null default now(),
  check ((ticket_id is null and registration_id is null) or
         (ticket_id is not null and registration_id is not null)),
  foreign key (event_id, organization_id)
    references public.events(id, organization_id) on delete cascade,
  foreign key (ticket_id, event_id, registration_id, organization_id)
    references public.tickets(id, event_id, registration_id, organization_id)
);

create table public.email_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  event_id uuid not null,
  registration_id uuid not null,
  ticket_id uuid references public.tickets(id),
  kind text not null check (kind in ('verify','ticket','operational')),
  status text not null default 'pending'
    check (status in ('pending','processing','sent','failed','cancelled')),
  scheduled_at timestamptz not null,
  idempotency_key text not null unique,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  provider_message_id text,
  last_error_code text,
  created_at timestamptz not null default now(),
  foreign key (registration_id, event_id, organization_id)
    references public.registrations(id, event_id, organization_id),
  foreign key (ticket_id, event_id, registration_id, organization_id)
    references public.tickets(id, event_id, registration_id, organization_id)
);

create table public.email_delivery_events (
  id uuid primary key default gen_random_uuid(),
  email_job_id uuid not null references public.email_jobs(id) on delete cascade,
  provider_event_id text not null unique,
  event_type text not null,
  received_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  event_id uuid references public.events(id),
  actor_user_id uuid references auth.users(id),
  actor_kind text not null check (actor_kind in ('system','staff','guest')),
  action text not null,
  resource_type text not null,
  resource_id uuid,
  details jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  foreign key (event_id, organization_id)
    references public.events(id, organization_id)
);

create index events_org_start_idx on public.events(organization_id, starts_at);
create index registrations_event_verified_idx on public.registrations(event_id, email_verified_at);
create index registrations_event_rsvp_idx on public.registrations(event_id, rsvp_status, admission_status);
create index code_claims_code_state_idx on public.code_claims(code_id, state, held_until);
create index tickets_event_status_idx on public.tickets(event_id, status);
create index checkins_event_time_idx on public.checkins(event_id, checked_in_at);
create index email_jobs_due_idx on public.email_jobs(status, scheduled_at);
create index staff_assignments_event_idx on public.staff_event_assignments(event_id, active);
create index audit_org_time_idx on public.audit_logs(organization_id, occurred_at);

-- No browser/client reads or writes are granted at this stage.
-- API handlers will use narrowly authorized server-side services.
-- Do not add public SELECT policies to 'make the frontend work'.
do $$
declare t text;
begin
  foreach t in array array[
    'organizations', 'staff_profiles', 'staff_memberships', 'staff_event_assignments',
    'events', 'invite_codes', 'guests', 'registrations', 'code_claims',
    'guest_verification_tokens', 'rsvp_history', 'tickets', 'checkins',
    'scan_attempts', 'email_jobs', 'email_delivery_events', 'audit_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from public, anon, authenticated', t);
  end loop;
end $$;

-- Explicit server-only service role grants. The key must NEVER reach a browser.
-- A service-role call bypasses RLS, so the Next.js API still MUST check
-- active organization/event memberships on every request.
grant select, insert, update, delete on all tables in schema public to service_role;

-- Deny clients and preserve server service access for future tables created
-- by this migration owner. Review grants whenever the owner role changes.
alter default privileges in schema public revoke all on tables from public, anon, authenticated;
alter default privileges in schema public
  grant select, insert, update, delete on tables to service_role;
