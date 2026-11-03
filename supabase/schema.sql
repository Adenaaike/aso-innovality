-- Admin access
create table public.admins (user_id uuid primary key references auth.users on delete cascade);
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, slug text not null unique, sort_order int default 0
);
insert into public.categories (name, slug, sort_order) values
 ('Brand Identity','brand-identity',1), ('Logo Design','logo-design',2),
 ('Graphic Design','graphic-design',3), ('Campaigns & Posters','campaigns-posters',4),
 ('Social Media Design','social-media',5), ('Photography','photography',6),
 ('Packaging','packaging',7), ('Experimental Design','experimental',8);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title text not null, client text, year int,
  category_id uuid references public.categories on delete set null,
  overview text, challenge text, concept text, process text,
  deliverables text[] not null default '{}',
  cover_url text, featured boolean not null default false,
  published boolean not null default false, sort_order int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  url text not null, alt text not null default '',
  kind text not null default 'full' check (kind in ('full','mockup','detail','before','after')),
  sort_order int not null default 0
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title text not null, excerpt text, body text,
  category text, cover_url text, featured boolean not null default false,
  published_at timestamptz, created_at timestamptz not null default now()
);

create table public.site_settings (key text primary key, value jsonb not null);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null, email text not null, company text,
  project_type text not null, budget text, description text not null,
  status text not null default 'new', created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.articles enable row level security;
alter table public.site_settings enable row level security;
alter table public.enquiries enable row level security;

create policy "self read admin" on public.admins for select using (user_id = auth.uid());

create policy "read categories" on public.categories for select using (true);
create policy "read projects" on public.projects for select using (published or public.is_admin());
create policy "read images" on public.project_images for select using (
  exists (select 1 from public.projects p where p.id = project_id and (p.published or public.is_admin())));
create policy "read articles" on public.articles for select using (
  (published_at is not null and published_at <= now()) or public.is_admin());
create policy "read settings" on public.site_settings for select using (true);

create policy "admin categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "admin images" on public.project_images for all using (public.is_admin()) with check (public.is_admin());
create policy "admin articles" on public.articles for all using (public.is_admin()) with check (public.is_admin());
create policy "admin settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admin read enquiries" on public.enquiries for select using (public.is_admin());
create policy "admin update enquiries" on public.enquiries for update using (public.is_admin());

insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;
create policy "admin upload" on storage.objects for insert with check (bucket_id = 'portfolio' and public.is_admin());
create policy "admin modify" on storage.objects for update using (bucket_id = 'portfolio' and public.is_admin());
create policy "admin delete" on storage.objects for delete using (bucket_id = 'portfolio' and public.is_admin());