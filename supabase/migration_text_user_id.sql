-- Migration: Change user_id columns from UUID to TEXT
-- Run this ONCE to migrate your existing database

-- 1. Drop existing tables (WARNING: This will delete all data!)
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;

-- 2. Recreate tables with TEXT user_id
-- Likes Table
CREATE TABLE public.likes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL,
    meme_id uuid REFERENCES public.memes NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, meme_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view likes" ON public.likes;
DROP POLICY IF EXISTS "Anyone can toggle likes" ON public.likes;
DROP POLICY IF EXISTS "Anyone can unlike" ON public.likes;

CREATE POLICY "Everyone can view likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Anyone can toggle likes" ON public.likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can unlike" ON public.likes FOR DELETE USING (true);

-- Subscriptions Table
CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    subscriber_id text NOT NULL,
    publisher_id text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(subscriber_id, publisher_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscriptions;
DROP POLICY IF EXISTS "Anyone can unsubscribe" ON public.subscriptions;

CREATE POLICY "Everyone can view subscriptions" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "Anyone can subscribe" ON public.subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can unsubscribe" ON public.subscriptions FOR DELETE USING (true);

-- Notifications Table
CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL,
    type text NOT NULL,
    content text NOT NULL,
    related_id uuid,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    actor_avatar text,
    metadata jsonb
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view notifications" ON public.notifications;
DROP POLICY IF EXISTS "Anyone can insert notifications" ON public.notifications;

CREATE POLICY "Anyone can view notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Anyone can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- 3. Add tables to Realtime
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
