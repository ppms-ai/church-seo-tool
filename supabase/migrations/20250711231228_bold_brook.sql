/*
  # Create church_users table

  1. New Tables
    - `church_users`
      - `id` (uuid, primary key)
      - `church_id` (uuid, foreign key to churches)
      - `user_id` (uuid, foreign key to auth.users)
      - `role` (text, enum: admin, editor, viewer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `church_users` table
    - Add policy for users to read their own church user record
*/

CREATE TABLE IF NOT EXISTS church_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id uuid NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'viewer',
  created_at timestamptz DEFAULT now(),
  UNIQUE(church_id, user_id)
);

ALTER TABLE church_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own church user record"
  ON church_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own church user record"
  ON church_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);