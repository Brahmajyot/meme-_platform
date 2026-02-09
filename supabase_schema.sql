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
do $$
begin
  alter publication supabase_realtime add table public.memes;
exception when duplicate_object then null;
end $$;

-- Likes Table
create table if not exists public.likes (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    meme_id uuid references public.memes not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, meme_id)
);

alter table public.likes enable row level security;

create policy "Everyone can view likes" on public.likes for select using (true);
create policy "Authenticated users can toggle likes" on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike" on public.likes for delete using (auth.uid() = user_id);

-- Subscriptions Table
create table if not exists public.subscriptions (
    id uuid default gen_random_uuid() primary key,
    subscriber_id uuid references auth.users not null,
    publisher_id uuid references auth.users not null, -- The user being subscribed to (creator)
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(subscriber_id, publisher_id)
);

alter table public.subscriptions enable row level security;

create policy "Everyone can view subscriptions" on public.subscriptions for select using (true);
create policy "Authenticated users can subscribe" on public.subscriptions for insert with check (auth.uid() = subscriber_id);
create policy "Users can unsubscribe" on public.subscriptions for delete using (auth.uid() = subscriber_id);

-- Notifications Table
create table if not exists public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null, -- Recipient
    type text not null, -- 'like', 'subscribe', 'upload'
    content text not null,
    related_id uuid, -- meme_id or user_id
    is_read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    actor_avatar text,
    metadata jsonb
);

alter table public.notifications enable row level security;

create policy "Users can view their own notifications" on public.notifications for select using (auth.uid() = user_id);
-- Allow system/triggers to insert (or authenticated users triggering actions)
create policy "Anyone can insert notifications" on public.notifications for insert with check (true); 
-- In a real app, you might restrict insert to triggers only, but for client-side prototype logic, this is fine.

-- Add new tables to Realtime (Idempotent)
do $$
begin
  begin
    alter publication supabase_realtime add table public.memes;
  exception when duplicate_object then null;
  end;
  
  begin
    alter publication supabase_realtime add table public.likes;
  exception when duplicate_object then null;
  end;
  
  begin
    alter publication supabase_realtime add table public.subscriptions;
  exception when duplicate_object then null;
  end;
  
  begin
    alter publication supabase_realtime add table public.notifications;
  exception when duplicate_object then null;
  end;
end $$;
