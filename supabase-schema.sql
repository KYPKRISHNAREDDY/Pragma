-- My Social Twin Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('parent', 'teacher')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Children profiles table
CREATE TABLE children (
  child_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 18),
  photo_url TEXT NOT NULL,
  sensory_settings JSONB NOT NULL DEFAULT '{
    "soundTolerance": 5,
    "crowdComfort": 5,
    "preferredPace": "medium",
    "visualBrightness": 5
  }',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Characters table (family, friends, teachers)
CREATE TABLE characters (
  character_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(child_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story templates table
CREATE TABLE story_templates (
  template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('school', 'social', 'medical', 'routine', 'unexpected')),
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  frame_count INTEGER NOT NULL,
  required_characters JSONB NOT NULL DEFAULT '[]',
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories table
CREATE TABLE stories (
  story_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(child_id) ON DELETE CASCADE,
  template_id UUID REFERENCES story_templates(template_id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  frames JSONB NOT NULL,
  created_by UUID NOT NULL REFERENCES users(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_viewed_at TIMESTAMPTZ,
  is_favorite BOOLEAN DEFAULT FALSE,
  completion_count INTEGER DEFAULT 0
);

-- Progress tracking table
CREATE TABLE progress (
  progress_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(child_id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES stories(story_id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  choices_made JSONB NOT NULL DEFAULT '[]',
  time_spent INTEGER NOT NULL, -- in seconds
  completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00
);

-- Collaborations table (for sharing between parents and teachers)
CREATE TABLE collaborations (
  collaboration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(child_id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES users(user_id),
  role TEXT NOT NULL CHECK (role IN ('viewer', 'editor')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX idx_children_parent ON children(parent_id);
CREATE INDEX idx_characters_child ON characters(child_id);
CREATE INDEX idx_stories_child ON stories(child_id);
CREATE INDEX idx_stories_created_by ON stories(created_by);
CREATE INDEX idx_progress_child ON progress(child_id);
CREATE INDEX idx_progress_story ON progress(story_id);
CREATE INDEX idx_collaborations_child ON collaborations(child_id);
CREATE INDEX idx_collaborations_email ON collaborations(invited_email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for children table
CREATE POLICY "Parents can view their own children"
  ON children FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own children"
  ON children FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own children"
  ON children FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own children"
  ON children FOR DELETE
  USING (auth.uid() = parent_id);

-- RLS Policies for characters table
CREATE POLICY "Users can view characters for their children"
  ON characters FOR SELECT
  USING (
    child_id IN (
      SELECT child_id FROM children WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert characters for their children"
  ON characters FOR INSERT
  WITH CHECK (
    child_id IN (
      SELECT child_id FROM children WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update characters for their children"
  ON characters FOR UPDATE
  USING (
    child_id IN (
      SELECT child_id FROM children WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete characters for their children"
  ON characters FOR DELETE
  USING (
    child_id IN (
      SELECT child_id FROM children WHERE parent_id = auth.uid()
    )
  );

-- RLS Policies for stories table
CREATE POLICY "Users can view stories for their children"
  ON stories FOR SELECT
  USING (
    child_id IN (
      SELECT child_id FROM children WHERE parent_id = auth.uid()
    ) OR created_by = auth.uid()
  );

CREATE POLICY "Users can create stories"
  ON stories FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own stories"
  ON stories FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own stories"
  ON stories FOR DELETE
  USING (created_by = auth.uid());

-- RLS Policies for progress table
CREATE POLICY "Users can view progress for their children"
  ON progress FOR SELECT
  USING (
    child_id IN (
      SELECT child_id FROM children WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert progress for their children"
  ON progress FOR INSERT
  WITH CHECK (
    child_id IN (
      SELECT child_id FROM children WHERE parent_id = auth.uid()
    )
  );

-- RLS Policies for collaborations
CREATE POLICY "Users can view collaborations they created or were invited to"
  ON collaborations FOR SELECT
  USING (
    invited_by = auth.uid() OR
    invited_email = (SELECT email FROM users WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create collaborations for their children"
  ON collaborations FOR INSERT
  WITH CHECK (
    invited_by = auth.uid() AND
    child_id IN (
      SELECT child_id FROM children WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update collaborations they were invited to"
  ON collaborations FOR UPDATE
  USING (
    invited_email = (SELECT email FROM users WHERE user_id = auth.uid())
  );

-- RLS Policies for story templates (public read)
CREATE POLICY "Anyone can view story templates"
  ON story_templates FOR SELECT
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at for children table
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default story templates
INSERT INTO story_templates (name, category, description, difficulty, frame_count, required_characters) VALUES
('Morning Arrival at School', 'school', 'A story about arriving at school in the morning', 'easy', 6, '[{"role": "teacher", "description": "The classroom teacher"}]'),
('Birthday Party', 'social', 'Attending a friend''s birthday party', 'medium', 6, '[{"role": "friend", "description": "Birthday child"}, {"role": "parent", "description": "Parent or caregiver"}]'),
('Visit to the Dentist', 'medical', 'Going to the dentist for a checkup', 'medium', 6, '[{"role": "parent", "description": "Parent or caregiver"}, {"role": "other", "description": "Dentist"}]'),
('Bedtime Routine', 'routine', 'Getting ready for bed', 'easy', 5, '[{"role": "parent", "description": "Parent or caregiver"}]'),
('Fire Drill at School', 'unexpected', 'What happens during a fire drill', 'hard', 7, '[{"role": "teacher", "description": "The classroom teacher"}]'),
('Lunch in the Cafeteria', 'school', 'Eating lunch at school with friends', 'easy', 5, '[{"role": "friend", "description": "School friend"}]'),
('Going to the Playground', 'social', 'Playing at the playground with friends', 'easy', 6, '[{"role": "friend", "description": "Playground friend"}]'),
('Getting a Haircut', 'routine', 'Visit to the barber or hair salon', 'medium', 6, '[{"role": "parent", "description": "Parent or caregiver"}]');

-- Storage bucket for photos (run this in Supabase Storage UI or via API)
-- CREATE BUCKET children_photos;
-- CREATE BUCKET character_photos;
-- CREATE BUCKET story_backgrounds;
