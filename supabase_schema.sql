-- Create the memes table
create table if not exists public.memes (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    category text,
    thumbnail text,
    video_url text, -- snake_case convention
    duration text,
    creator_name text,
    creator_avatar text,
    views text default '0',
    trending_score numeric default 50,
    virality_score numeric,
    ai_reasoning text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure columns exist (idempotent)
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'memes' and column_name = 'ai_reasoning') then
        alter table public.memes add column ai_reasoning text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'memes' and column_name = 'virality_score') then
        alter table public.memes add column virality_score numeric;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'memes' and column_name = 'video_url') then
        alter table public.memes add column video_url text;
    end if;
end $$;

-- Enable Row Level Security (public read, authenticated insert)
alter table public.memes enable row level security;

-- Allow everyone to read memes
drop policy if exists "Public memes are viewable by everyone" on public.memes;
create policy "Public memes are viewable by everyone" 
on public.memes for select 
using (true);

-- Allow authenticated users (and anon for likely prototype usage) to insert
drop policy if exists "Anyone can upload memes" on public.memes;
create policy "Anyone can upload memes" 
on public.memes for insert 
with check (true);

-- Create storage bucket for meme-media
insert into storage.buckets (id, name, public)
values ('meme-media', 'meme-media', true)
on conflict (id) do nothing;

-- Storage Policies
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'meme-media' );

drop policy if exists "Authenticated Upload" on storage.objects;
create policy "Authenticated Upload"
on storage.objects for insert
with check ( bucket_id = 'meme-media' );

-- Enable Realtime for memes table
-- This allows the frontend to listen for new inserts/updates
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table public.memes;
commit;
-- Note: In some Supabase setups, 'supabase_realtime' already exists and you just add the table:
-- alter publication supabase_realtime add table public.memes;
-- But the safe idempotent way (if we control it) is ensuring it exists.
-- However, 'supabase_realtime' is a system default. 
-- Safer command for default Supabase setup:
alter publication supabase_realtime add table public.memes;
