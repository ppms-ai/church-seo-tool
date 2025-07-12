/*
  # Create sermons table

  1. New Tables
    - `sermons`
      - `id` (uuid, primary key)
      - `church_id` (uuid, foreign key to churches)
      - `title` (text)
      - `speaker_name` (text)
      - `sermon_date` (date)
      - `youtube_url` (text)
      - `series_name` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `sermons` table
    - Add policy for church members to manage their church's sermons
*/

CREATE TABLE IF NOT EXISTS sermons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id uuid NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  title text NOT NULL,
  speaker_name text NOT NULL,
  sermon_date date NOT NULL,
  youtube_url text NOT NULL,
  series_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Church members can manage their church sermons"
  ON sermons
  FOR ALL
  TO authenticated
  USING (
    church_id IN (
      SELECT church_id FROM church_users WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    church_id IN (
      SELECT church_id FROM church_users WHERE user_id = auth.uid()
    )
  );

-- Insert sample sermons
INSERT INTO sermons (church_id, title, speaker_name, sermon_date, youtube_url, series_name) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'The Power of Faith', 'Pastor John Smith', '2024-01-07', 'https://youtube.com/watch?v=example1', 'Faith Series'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Walking in Love', 'Pastor John Smith', '2024-01-14', 'https://youtube.com/watch?v=example2', 'Faith Series'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Hope in Difficult Times', 'Guest Speaker Mary Johnson', '2024-01-21', 'https://youtube.com/watch?v=example3', 'Hope Series'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Building Community', 'Pastor John Smith', '2024-01-28', 'https://youtube.com/watch?v=example4', null),
  ('550e8400-e29b-41d4-a716-446655440002', 'Grace and Mercy', 'Pastor David Wilson', '2024-01-07', 'https://youtube.com/watch?v=example5', 'Grace Series'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Living with Purpose', 'Pastor David Wilson', '2024-01-14', 'https://youtube.com/watch?v=example6', null)
ON CONFLICT DO NOTHING;