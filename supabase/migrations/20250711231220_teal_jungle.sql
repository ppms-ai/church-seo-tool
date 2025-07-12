/*
  # Create churches table

  1. New Tables
    - `churches`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `contact_email` (text)
      - `notion_page_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `churches` table
    - Add policy for authenticated users to read churches
*/

CREATE TABLE IF NOT EXISTS churches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  contact_email text NOT NULL,
  notion_page_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE churches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read churches"
  ON churches
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample churches
INSERT INTO churches (id, name, slug, contact_email, notion_page_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Grace Community Church', 'grace-community', 'admin@gracecommunity.org', 'https://notion.so/businessautomationhub/22d2e250c21080c684d9c10e61723da?v=22d2e250c21081d9b7f800'),
  ('550e8400-e29b-41d4-a716-446655440002', 'First Baptist Church', 'first-baptist', 'pastor@firstbaptist.org', 'https://notion.so/businessautomationhub/22d2e250c21080c684d9c10e61723da?v=22d2e250c21081d9b7f800'),
  ('550e8400-e29b-41d4-a716-446655440003', 'New Life Fellowship', 'new-life', 'info@newlife.org', null)
ON CONFLICT (id) DO NOTHING;