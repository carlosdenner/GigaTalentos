CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar TEXT,
  account_type TEXT NOT NULL CHECK (account_type IN ('talent', 'sponsor', 'fan')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  subscribers INTEGER DEFAULT 0,
  avatar TEXT,
  cover_image TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  thumbnail TEXT,
  duration TEXT,
  video_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE playlist_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, video_id)
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, channel_id)
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users are viewable by everyone" ON users
FOR SELECT USING (true);

CREATE POLICY "Users can update their own data" ON users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Categories are viewable by everyone" ON categories
FOR SELECT USING (true);

CREATE POLICY "Admin can insert categories" ON categories
FOR INSERT WITH CHECK (auth.uid() IN (
  SELECT id FROM users WHERE account_type = 'sponsor'
));

CREATE POLICY "Admin can update categories" ON categories
FOR UPDATE USING (auth.uid() IN (
  SELECT id FROM users WHERE account_type = 'sponsor'
));

CREATE POLICY "Admin can delete categories" ON categories
FOR DELETE USING (auth.uid() IN (
  SELECT id FROM users WHERE account_type = 'sponsor'
));

CREATE POLICY "Channels are viewable by everyone" ON channels
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own channels" ON channels
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own channels" ON channels
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own channels" ON channels
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Videos are viewable by everyone" ON videos
FOR SELECT USING (true);

CREATE POLICY "Users can insert videos to their channels" ON videos
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM channels WHERE id = channel_id
  )
);

CREATE POLICY "Users can update videos in their channels" ON videos
FOR UPDATE USING (
  auth.uid() IN (
    SELECT user_id FROM channels WHERE id = channel_id
  )
);

CREATE POLICY "Users can delete videos in their channels" ON videos
FOR DELETE USING (
  auth.uid() IN (
    SELECT user_id FROM channels WHERE id = channel_id
  )
);

CREATE POLICY "Users can view their own favorites" ON favorites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own playlists" ON playlists
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own playlists" ON playlists
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" ON playlists
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" ON playlists
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own playlist videos" ON playlist_videos
FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM playlists WHERE id = playlist_id
  )
);

CREATE POLICY "Users can insert videos to their playlists" ON playlist_videos
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM playlists WHERE id = playlist_id
  )
);

CREATE POLICY "Users can delete videos from their playlists" ON playlist_videos
FOR DELETE USING (
  auth.uid() IN (
    SELECT user_id FROM playlists WHERE id = playlist_id
  )
);

CREATE POLICY "Comments are viewable by everyone" ON comments
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscriptions" ON subscriptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" ON subscriptions
FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_channels_updated_at
BEFORE UPDATE ON channels
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON videos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
BEFORE UPDATE ON playlists
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

