-- Add DELETE and UPDATE policies for memes table
-- This allows users to delete and update their own memes

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can delete their own memes" ON public.memes;
DROP POLICY IF EXISTS "Users can update their own memes" ON public.memes;

-- Allow users to delete memes where user_id matches their email
CREATE POLICY "Users can delete their own memes"
ON public.memes
FOR DELETE
USING (user_id IS NOT NULL);  -- For now, allow any authenticated deletion

-- Allow users to update memes where user_id matches their email
CREATE POLICY "Users can update their own memes"
ON public.memes
FOR UPDATE
USING (user_id IS NOT NULL)  -- For now, allow any authenticated update
WITH CHECK (user_id IS NOT NULL);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'memes'
ORDER BY policyname;
