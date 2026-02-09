-- Create a table for memes
create table if not exists memes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text,
  thumbnail text, -- URL to storage
  video_url text, -- URL to storage
  duration text,
  creator_name text, -- De-normalized for speed
  creator_avatar text,
  views numeric default 0,
  trending_score numeric default 0,
  user_id text, -- ID from NextAuth
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table memes enable row level security;

-- Policies for Memes
create policy "Memes are public." on memes for select using (true);
create policy "Anyone can upload memes." on memes for insert with check (true);
create policy "Users can delete their own memes." on memes for delete using (auth.uid()::text = user_id); -- Note: requires Auth sync or Service Role for NextAuth

-- Storage Bucket
insert into storage.buckets (id, name, public) values ('meme-media', 'meme-media', true)
on conflict (id) do nothing; -- Prevent error if exists

-- Storage Policies
create policy "Media is public" on storage.objects for select using ( bucket_id = 'meme-media' );
create policy "Anyone can upload media" on storage.objects for insert with check ( bucket_id = 'meme-media' );
