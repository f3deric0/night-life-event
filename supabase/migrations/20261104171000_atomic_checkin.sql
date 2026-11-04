-- Phase 1b: single-use check-in RPC; not deployed to Supabase by this PR.
-- Only server-held service_role credentials can execute this function.
-- The HTTP handler MUST authenticate staff and derive p_staff_user_id from a
-- trusted Supabase Auth session; never accept a caller-supplied staff UUID.
-- Row-level locking + checkins.ticket_id UNIQUE serialize concurrent devices.

create or replace function public.check_in_ticket(
  p_event_id uuid,
  p_token_hash text,
  p_staff_user_id uuid,
  p_method text default 'qr',
  p_reason text default null
)
returns table (
  status text,
  denial_reason text,
  checkin_id uuid,
  checked_in_at timestamptz
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_organization_id uuid;
  v_authorized boolean := false;
  v_ticket record;
  v_checkin_id uuid;
  v_checked_in_at timestamptz;
begin
  -- Never accept a manual admission without a reason; no offline acceptance.
  if p_event_id is null or p_staff_user_id is null
     or p_token_hash !~ '^[0-9a-f]{64}$'
     or p_method not in ('qr', 'manual')
     or (p_method = 'manual' and nullif(btrim(coalesce(p_reason, '')), '') is null) then
    return query select 'denied'::text, 'invalid_ticket'::text, null::uuid, null::timestamptz;
    return;
  end if;

  select e.organization_id into v_organization_id
  from public.events e
  where e.id = p_event_id and e.status = 'open';

  if not found then
    return query select 'denied'::text, 'event_not_open'::text, null::uuid, null::timestamptz;
    return;
  end if;

  select exists (
    select 1
    from public.staff_memberships sm
    join public.staff_profiles sp on sp.auth_user_id = sm.auth_user_id
    where sm.organization_id = v_organization_id
      and sm.auth_user_id = p_staff_user_id
      and sm.active and sp.active
      and (
        sm.role in ('owner', 'admin')
        or exists (
          select 1
          from public.staff_event_assignments sa
          where sa.membership_id = sm.id
            and sa.event_id = p_event_id
            and sa.active
        )
      )
  ) into v_authorized;

  if not v_authorized then
    return query select 'denied'::text, 'unauthorized'::text, null::uuid, null::timestamptz;
    return;
  end if;

  -- Lock this ticket row until transaction commits. A simultaneous second
  -- scanner waits and re-reads the final status, then receives duplicate.
  select
    t.id as ticket_id,
    t.registration_id,
    t.status as ticket_status,
    r.email_verified_at,
    r.rsvp_status,
    r.admission_status
  into v_ticket
  from public.tickets t
  join public.registrations r
    on r.id = t.registration_id
   and r.event_id = t.event_id
   and r.organization_id = t.organization_id
  where t.event_id = p_event_id
    and t.organization_id = v_organization_id
    and t.token_hash = p_token_hash
  for update of t;

  if not found then
    insert into public.scan_attempts
      (organization_id, event_id, staff_user_id, result, reason)
    values (v_organization_id, p_event_id, p_staff_user_id, 'denied', 'invalid_ticket');
    return query select 'denied'::text, 'invalid_ticket'::text, null::uuid, null::timestamptz;
    return;
  end if;

  if v_ticket.ticket_status = 'checked_in' then
    insert into public.scan_attempts
      (organization_id, event_id, ticket_id, registration_id, staff_user_id, result, reason)
    values (v_organization_id, p_event_id, v_ticket.ticket_id, v_ticket.registration_id, p_staff_user_id, 'denied', 'already_checked_in');
    return query select 'denied'::text, 'already_checked_in'::text, null::uuid, null::timestamptz;
    return;
  end if;

  if v_ticket.ticket_status = 'revoked' then
    insert into public.scan_attempts
      (organization_id, event_id, ticket_id, registration_id, staff_user_id, result, reason)
    values (v_organization_id, p_event_id, v_ticket.ticket_id, v_ticket.registration_id, p_staff_user_id, 'denied', 'revoked_ticket');
    return query select 'denied'::text, 'revoked_ticket'::text, null::uuid, null::timestamptz;
    return;
  end if;

  if v_ticket.ticket_status not in ('issued', 'emailed')
     or v_ticket.email_verified_at is null
     or v_ticket.rsvp_status <> 'yes'
     or v_ticket.admission_status <> 'admitted' then
    insert into public.scan_attempts
      (organization_id, event_id, ticket_id, registration_id, staff_user_id, result, reason)
    values (v_organization_id, p_event_id, v_ticket.ticket_id, v_ticket.registration_id, p_staff_user_id, 'denied', 'ineligible_registration');
    return query select 'denied'::text, 'ineligible_registration'::text, null::uuid, null::timestamptz;
    return;
  end if;

  insert into public.checkins
    (organization_id, event_id, registration_id, ticket_id, staff_user_id, method, reason)
  values
    (v_organization_id, p_event_id, v_ticket.registration_id, v_ticket.ticket_id,
     p_staff_user_id, p_method, p_reason)
  on conflict (ticket_id) do nothing
  returning id, public.checkins.checked_in_at into v_checkin_id, v_checked_in_at;

  if v_checkin_id is null then
    return query select 'denied'::text, 'already_checked_in'::text, null::uuid, null::timestamptz;
    return;
  end if;

  update public.tickets t
  set status = 'checked_in', checked_in_at = v_checked_in_at
  where t.id = v_ticket.ticket_id;

  insert into public.scan_attempts
    (organization_id, event_id, ticket_id, registration_id, staff_user_id, result)
  values (v_organization_id, p_event_id, v_ticket.ticket_id, v_ticket.registration_id,
          p_staff_user_id, 'accepted');

  return query select 'accepted'::text, null::text, v_checkin_id, v_checked_in_at;
end
$$;

-- Supabase Data API exposes functions in public only to granted roles.
-- This runs as the caller (not SECURITY DEFINER) and requires a secret
-- server-side role. Never grant to anon/authenticated.
revoke all on function public.check_in_ticket(uuid,text,uuid,text,text)
from public, anon, authenticated;
grant execute on function public.check_in_ticket(uuid,text,uuid,text,text)
to service_role;
