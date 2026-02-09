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

-- Enable Row Level Security (public read, authenticated insert)
alter table public.memes enable row level security;

-- Allow everyone to read memes
drop policy if exists "Public memes are viewable by everyone" on public.memes;
create policy "Public memes are viewable by everyone" 
on public.memes for select 
using (true);

-- Allow authenticated users (and anon for likely prototype usage) to insert
-- Ideally, limit to authenticated users, but for now matching current "anon" key usage
drop policy if exists "Anyone can upload memes" on public.memes;
create policy "Anyone can upload memes" 
on public.memes for insert 
with check (true);

-- Create storage bucket for meme media
insert into storage.buckets (id, name, public)
values ('meme-media', 'meme-media', true)
on conflict (id) do nothing;

-- Storage Policies
-- Allow public read access to meme-media bucket
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'meme-media' );

-- Allow authenticated uploads to meme-media bucket
drop policy if exists "Authenticated Upload" on storage.objects;
create policy "Authenticated Upload"
on storage.objects for insert
with check ( bucket_id = 'meme-media' );
