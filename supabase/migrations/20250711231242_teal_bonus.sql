/*
  # Create sermon_content table

  1. New Tables
    - `sermon_content`
      - `id` (uuid, primary key)
      - `sermon_id` (uuid, foreign key to sermons)
      - `full_blog_post` (text, optional)
      - `meta_tags` (text, optional)
      - `video_schema_json` (jsonb, optional)
      - `social_captions` (text, optional)
      - `discussion_questions` (text, optional)
      - `processing_status` (text, enum)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `sermon_content` table
    - Add policy for church members to manage their church's sermon content
*/

CREATE TABLE IF NOT EXISTS sermon_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sermon_id uuid NOT NULL REFERENCES sermons(id) ON DELETE CASCADE,
  full_blog_post text,
  meta_tags text,
  video_schema_json jsonb,
  social_captions text,
  discussion_questions text,
  processing_status text NOT NULL CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(sermon_id)
);

ALTER TABLE sermon_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Church members can manage their church sermon content"
  ON sermon_content
  FOR ALL
  TO authenticated
  USING (
    sermon_id IN (
      SELECT s.id FROM sermons s
      JOIN church_users cu ON s.church_id = cu.church_id
      WHERE cu.user_id = auth.uid()
    )
  )
  WITH CHECK (
    sermon_id IN (
      SELECT s.id FROM sermons s
      JOIN church_users cu ON s.church_id = cu.church_id
      WHERE cu.user_id = auth.uid()
    )
  );

-- Insert sample sermon content
INSERT INTO sermon_content (sermon_id, processing_status, full_blog_post, social_captions, discussion_questions)
SELECT 
  s.id,
  CASE 
    WHEN s.title = 'The Power of Faith' THEN 'completed'
    WHEN s.title = 'Walking in Love' THEN 'processing'
    WHEN s.title = 'Hope in Difficult Times' THEN 'failed'
    ELSE 'pending'
  END,
  CASE 
    WHEN s.title = 'The Power of Faith' THEN 'This powerful sermon explores the transformative nature of faith in our daily lives...'
    ELSE null
  END,
  CASE 
    WHEN s.title = 'The Power of Faith' THEN 'Discover the power of faith in your life! Join us for this inspiring message. #Faith #Church #Hope'
    ELSE null
  END,
  CASE 
    WHEN s.title = 'The Power of Faith' THEN '1. How has faith impacted your life? 2. What challenges test your faith? 3. How can we support each other in faith?'
    ELSE null
  END
FROM sermons s
ON CONFLICT (sermon_id) DO NOTHING;