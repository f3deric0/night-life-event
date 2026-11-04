-- Synthetic regression scenario for atomic ticket redemption.
-- This runs against disposable CI PostgreSQL after the core migration.
begin;
insert into auth.users(id) values ('77777777-7777-4777-8777-777777777777');
insert into public.staff_profiles(auth_user_id, login_username, display_name)
values ('77777777-7777-4777-8777-777777777777', 'synthetic.staff', 'Synthetic Staff');
insert into public.organizations(id,name,slug)
values ('11111111-1111-4111-8111-111111111111','Synthetic Org','synthetic-org');
insert into public.events(id,organization_id,slug,title,starts_at,status)
values ('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','demo-night','Synthetic Night','2027-01-01 20:00+00','open');
insert into public.staff_memberships(id,organization_id,auth_user_id,role)
values ('66666666-6666-4666-8666-666666666666','11111111-1111-4111-8111-111111111111','77777777-7777-4777-8777-777777777777','staff');
insert into public.staff_event_assignments
  (organization_id,membership_id,event_id)
values ('11111111-1111-4111-8111-111111111111','66666666-6666-4666-8666-666666666666','22222222-2222-4222-8222-222222222222');
insert into public.invite_codes(id,organization_id,event_id,code_hash,kind,max_redemptions)
values ('33333333-3333-4333-8333-333333333333','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222',repeat('a',64),'personal',1);
insert into public.guests(id,organization_id,first_name,last_name,normalized_email)
values ('44444444-4444-4444-8444-444444444444','11111111-1111-4111-8111-111111111111','Synthetic','Guest','synthetic@example.test');
insert into public.registrations
  (id,organization_id,event_id,guest_id,invite_code_id,email_verified_at,rsvp_status,admission_status)
values ('55555555-5555-4555-8555-555555555555','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','44444444-4444-4444-8444-444444444444','33333333-3333-4333-8333-333333333333',now(),'yes','admitted');
insert into public.tickets
  (id,organization_id,event_id,registration_id,token_hash,status)
values ('88888888-8888-4888-8888-888888888888','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','55555555-5555-4555-8555-555555555555',repeat('b',64),'emailed');

do $$
declare first_status text; second_status text; invalid_status text; check_count integer;
begin
  select status into first_status
  from public.check_in_ticket('22222222-2222-4222-8222-222222222222',repeat('b',64),'77777777-7777-4777-8777-777777777777','qr',null);
  select status into second_status
  from public.check_in_ticket('22222222-2222-4222-8222-222222222222',repeat('b',64),'77777777-7777-4777-8777-777777777777','qr',null);
  select status into invalid_status
  from public.check_in_ticket('22222222-2222-4222-8222-222222222222',repeat('c',64),'77777777-7777-4777-8777-777777777777','qr',null);

  select count(*) into check_count from public.checkins
  where ticket_id='88888888-8888-4888-8888-888888888888';

  if first_status <> 'accepted' or second_status <> 'denied'
     or invalid_status <> 'denied' or check_count <> 1 then
    raise exception 'Unexpected check-in results: %, %, %, count=%',
      first_status, second_status, invalid_status, check_count;
  end if;
end $$;
rollback;
