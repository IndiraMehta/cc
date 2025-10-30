
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'participant',
  profile_pic text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  host_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  eligibility text NOT NULL,
  max_participants integer NOT NULL DEFAULT 100,
  rounds jsonb DEFAULT '[]'::jsonb,
  judging_criteria text,
  prizes text,
  judges jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'upcoming',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Hosts can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

-- Create event_participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_name text,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view event participants"
  ON event_participants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join events"
  ON event_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES event_participants(id) ON DELETE CASCADE,
  github_link text NOT NULL,
  ppt_url text,
  demo_link text,
  description text NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view submissions for events they're part of"
  ON submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM event_participants ep
      WHERE ep.event_id = submissions.event_id
      AND ep.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = submissions.event_id
      AND (e.host_id = auth.uid() OR e.judges @> to_jsonb(auth.uid()::text))
    )
  );

CREATE POLICY "Participants can insert submissions"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM event_participants ep
      WHERE ep.id = team_id AND ep.user_id = auth.uid()
    )
  );

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  judge_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 10),
  feedback text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(submission_id, judge_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Judges and hosts can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    auth.uid() = judge_id
    OR EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = reviews.event_id AND e.host_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM submissions s
      JOIN event_participants ep ON s.team_id = ep.id
      WHERE s.id = reviews.submission_id AND ep.user_id = auth.uid()
    )
  );

CREATE POLICY "Judges can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = judge_id
    AND EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = event_id AND e.judges @> to_jsonb(auth.uid()::text)
    )
  );

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_type text NOT NULL DEFAULT 'direct',
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create chat_members table (must be created before chat policies that reference it)
CREATE TABLE IF NOT EXISTS chat_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(chat_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS and add policies for chats
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view chats they're members of"
  ON chats FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_members cm
      WHERE cm.chat_id = chats.id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chats"
  ON chats FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Enable RLS and add policies for chat_members
ALTER TABLE chat_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view chat members for their chats"
  ON chat_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_members cm
      WHERE cm.chat_id = chat_members.chat_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add themselves to chats"
  ON chat_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and add policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their chats"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_members cm
      WHERE cm.chat_id = messages.chat_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their chats"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM chat_members cm
      WHERE cm.chat_id = messages.chat_id AND cm.user_id = auth.uid()
    )
  );