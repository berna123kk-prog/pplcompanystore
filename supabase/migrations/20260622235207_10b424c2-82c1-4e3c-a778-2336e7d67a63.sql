-- 1. Roles
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

create policy "Admins can read all roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 2. Product size overrides
create table public.product_size_overrides (
  product_slug text primary key,
  sold_out_sizes text[] not null default '{}',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

grant select on public.product_size_overrides to anon, authenticated;
grant all on public.product_size_overrides to service_role;
grant insert, update, delete on public.product_size_overrides to authenticated;

alter table public.product_size_overrides enable row level security;

create policy "Anyone can read size overrides"
  on public.product_size_overrides for select
  to anon, authenticated
  using (true);

create policy "Admins can insert size overrides"
  on public.product_size_overrides for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update size overrides"
  on public.product_size_overrides for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete size overrides"
  on public.product_size_overrides for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger product_size_overrides_updated_at
  before update on public.product_size_overrides
  for each row execute function public.update_updated_at_column();

-- 3. Claim first admin (idempotent)
create or replace function public.claim_first_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_exists boolean;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;
  select exists(select 1 from public.user_roles where role = 'admin') into v_exists;
  if v_exists then
    return false;
  end if;
  insert into public.user_roles (user_id, role) values (v_uid, 'admin')
    on conflict do nothing;
  return true;
end;
$$;

grant execute on function public.claim_first_admin() to authenticated;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, anon;