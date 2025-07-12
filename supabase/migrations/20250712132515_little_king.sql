/*
  # Fix RLS policies for authentication

  1. Security Updates
    - Update church_users INSERT policy to allow user creation during signup
    - Add proper SELECT policy for church_users
    - Ensure policies work with auth.uid()

  2. Changes
    - Modified INSERT policy to allow users to create their own records
    - Updated SELECT policy to be more permissive for authenticated users
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can insert their own church user record" ON church_users;
DROP POLICY IF EXISTS "Users can read their own church user record" ON church_users;

-- Create proper INSERT policy that allows users to create their own records
CREATE POLICY "Allow authenticated users to insert their own church user record"
  ON church_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create proper SELECT policy that allows users to read their own records
CREATE POLICY "Allow authenticated users to read their own church user record"
  ON church_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Also allow reading church information for authenticated users
DROP POLICY IF EXISTS "Authenticated users can read churches" ON churches;
CREATE POLICY "Allow authenticated users to read churches"
  ON churches
  FOR SELECT
  TO authenticated
  USING (true);