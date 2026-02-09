-- Migration: Update existing memes with user_id based on creator_name
-- This fixes memes uploaded before the user_id field was added

-- Update memes where creator_name is 'Noapi' to set user_id to your email
UPDATE memes
SET user_id = 'noapi@gmail.com'
WHERE creator_name = 'Noapi'
  AND user_id IS NULL;

-- Verify the update
SELECT id, title, creator_name, user_id, created_at
FROM memes
WHERE creator_name = 'Noapi'
ORDER BY created_at DESC;
