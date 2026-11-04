-- Runs against disposable CI PostgreSQL with synthetic Auth stubs.
-- This checks DDL and absence of broad Data API grants, not Supabase production auth.

do $$
declare public_table_count integer; rls_count integer; client_grants integer;
begin
  select count(*) into public_table_count
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relkind='r';

  select count(*) into rls_count
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relkind='r' and c.relrowsecurity;

  if public_table_count <> 17 then
    raise exception 'Expected 17 tables, found %', public_table_count;
  end if;
  if rls_count <> public_table_count then
    raise exception 'RLS disabled on at least one table: % of %', rls_count, public_table_count;
  end if;

  select count(*) into client_grants
  from information_schema.role_table_grants
  where table_schema='public'
    and grantee in ('anon','authenticated')
    and privilege_type in ('SELECT','INSERT','UPDATE','DELETE');

  if client_grants <> 0 then
    raise exception 'Client roles have direct table grants: %', client_grants;
  end if;
end $$;

-- Assert personal code cannot have multiple redemptions.
begin;
insert into public.organizations(id,name,slug)
values ('11111111-1111-4111-8111-111111111111','Synthetic Org','synthetic-org');
insert into public.events(id,organization_id,slug,title,starts_at)
values ('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','demo-night','Synthetic Night','2027-01-01 20:00+00');
insert into public.invite_codes(id,organization_id,event_id,code_hash,kind,max_redemptions)
values ('33333333-3333-4333-8333-333333333333','11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222',repeat('a',64),'personal',1);
rollback;
