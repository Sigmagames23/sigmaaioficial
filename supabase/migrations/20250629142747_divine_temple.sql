/*
  # Disable Email Confirmation

  1. Configuration Changes
    - Disable email confirmation requirement
    - Allow users to sign up without email verification
    - Enable auto-confirm for new users

  2. Security
    - Users can login immediately after signup
    - No email verification required
*/

-- This migration disables email confirmation in Supabase
-- Note: This should be configured in the Supabase Dashboard under Authentication > Settings

-- Update auth settings to disable email confirmation
-- This needs to be done in the Supabase Dashboard:
-- 1. Go to Authentication > Settings
-- 2. Turn OFF "Enable email confirmations"
-- 3. Turn ON "Enable auto-confirm users"

-- For reference, these are the settings that should be configured:
-- enable_confirmations = false
-- enable_signup = true
-- enable_auto_confirm = true