-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Daily entries table
create table public.daily_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  image_url text,
  -- AI analysis fields
  whiteheads integer default 0,
  blackheads integer default 0,
  papules integer default 0,
  pustules integer default 0,
  nodules_or_cysts integer default 0,
  inflammation_level integer default 1 check (inflammation_level between 1 and 10),
  oiliness_level integer default 1 check (oiliness_level between 1 and 10),
  dryness_level integer default 1 check (dryness_level between 1 and 10),
  hyperpigmentation_level integer default 1 check (hyperpigmentation_level between 1 and 10),
  scarring_visible boolean default false,
  overall_severity_score integer default 1 check (overall_severity_score between 1 and 10),
  confidence_score float default 0 check (confidence_score between 0 and 1),
  -- Lifestyle fields
  sleep_hours float check (sleep_hours between 0 and 24),
  stress_level integer check (stress_level between 1 and 10),
  water_intake_liters float check (water_intake_liters >= 0),
  exercise_done boolean default false,
  dairy_consumed boolean default false,
  sugar_level integer check (sugar_level between 1 and 5),
  routine_notes text,
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  constraint unique_user_date unique (user_id, date)
);

-- Index for fast user lookups
create index idx_daily_entries_user_id on public.daily_entries(user_id);
create index idx_daily_entries_user_date on public.daily_entries(user_id, date desc);

-- Row Level Security
alter table public.daily_entries enable row level security;

-- Policy: users can only see their own entries
create policy "Users can view own entries"
  on public.daily_entries for select
  using (auth.uid() = user_id);

-- Policy: users can insert their own entries
create policy "Users can insert own entries"
  on public.daily_entries for insert
  with check (auth.uid() = user_id);

-- Policy: users can update their own entries
create policy "Users can update own entries"
  on public.daily_entries for update
  using (auth.uid() = user_id);

-- Policy: users can delete their own entries
create policy "Users can delete own entries"
  on public.daily_entries for delete
  using (auth.uid() = user_id);

-- Updated at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.daily_entries
  for each row execute function update_updated_at();

-- Storage bucket for images (run in Supabase dashboard SQL or via API)
-- insert into storage.buckets (id, name, public) values ('skin-images', 'skin-images', false);

-- Storage RLS policies
-- create policy "Users can upload own images"
--   on storage.objects for insert
--   with check (bucket_id = 'skin-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- create policy "Users can view own images"
--   on storage.objects for select
--   using (bucket_id = 'skin-images' and auth.uid()::text = (storage.foldername(name))[1]);
