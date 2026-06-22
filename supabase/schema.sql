-- supabase/schema.sql
-- Run this in Supabase Dashboard → SQL Editor → New query → Run

-- ==================== TABLES ====================

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  tagline text,
  short_description text,
  full_description text,
  origin text,
  emoji text,
  accent_color text,
  images jsonb not null default '[]'::jsonb,
  specs jsonb not null default '[]'::jsonb,
  varieties jsonb not null default '[]'::jsonb,
  grades jsonb not null default '[]'::jsonb,
  packaging jsonb not null default '[]'::jsonb,
  certifications jsonb not null default '[]'::jsonb,
  use_cases jsonb not null default '[]'::jsonb,
  related_slugs jsonb not null default '[]'::jsonb,
  availability text,
  moq text,
  moq_unit text check (moq_unit in ('Kg', 'MT', 'Container Load', 'Custom')),
  display_order integer not null default 999,
  is_published boolean not null default true,
  is_future boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text,
  country text not null,
  product_required text not null,
  quantity text,
  email text not null,
  whatsapp text,
  message text,
  source text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create table news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  cover_image_url text,
  body text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  description text,
  display_order integer not null default 999,
  created_at timestamptz not null default now()
);

create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text,
  category text,
  display_order integer not null default 999,
  created_at timestamptz not null default now()
);

-- ==================== INDEXES ====================

create index products_slug_idx on products (slug);
create index products_category_idx on products (category);
create index products_display_order_idx on products (display_order);
create index leads_status_idx on leads (status);
create index leads_created_at_idx on leads (created_at desc);
create index news_slug_idx on news (slug);
create index news_published_idx on news (is_published, published_at desc);

-- ==================== UPDATED_AT TRIGGER ====================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();

create trigger news_updated_at before update on news
  for each row execute function update_updated_at();

-- ==================== RLS ====================

alter table products enable row level security;
alter table leads enable row level security;
alter table news enable row level security;
alter table certifications enable row level security;
alter table gallery_images enable row level security;

-- products: public can read published, non-future products
create policy "Public read published products"
  on products for select
  using (is_published = true and is_future = false);

-- news: public can read published posts
create policy "Public read published news"
  on news for select
  using (is_published = true);

-- certifications: public read all
create policy "Public read certifications"
  on certifications for select
  using (true);

-- gallery_images: public read all
create policy "Public read gallery"
  on gallery_images for select
  using (true);

-- leads: no public read (service role only via admin client)

-- ==================== STORAGE BUCKETS ====================

insert into storage.buckets (id, name, public) values
  ('product-images', 'product-images', true),
  ('certification-logos', 'certification-logos', true),
  ('gallery', 'gallery', true),
  ('news-covers', 'news-covers', true)
on conflict (id) do nothing;

-- Storage policies: authenticated users can upload/update/delete
create policy "Authenticated can upload product-images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

create policy "Authenticated can update product-images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images');

create policy "Authenticated can delete product-images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');

create policy "Authenticated can upload certification-logos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'certification-logos');

create policy "Authenticated can update certification-logos"
  on storage.objects for update to authenticated
  using (bucket_id = 'certification-logos');

create policy "Authenticated can delete certification-logos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'certification-logos');

create policy "Authenticated can upload gallery"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery');

create policy "Authenticated can update gallery"
  on storage.objects for update to authenticated
  using (bucket_id = 'gallery');

create policy "Authenticated can delete gallery"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery');

create policy "Authenticated can upload news-covers"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'news-covers');

create policy "Authenticated can update news-covers"
  on storage.objects for update to authenticated
  using (bucket_id = 'news-covers');

create policy "Authenticated can delete news-covers"
  on storage.objects for delete to authenticated
  using (bucket_id = 'news-covers');
