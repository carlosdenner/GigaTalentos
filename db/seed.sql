INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
('d42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'fan@example.com', '$2a$10$GJAWXSjFFPrLp/7.T3x/f.4Z6Uxy8V4a4RUYveW9Bkh9p/jNHLQ.K', NOW(), NOW(), NOW()),
('1f5a5c88-123c-4eb0-94c7-ed32c6218b49', 'talent@example.com', '$2a$10$GJAWXSjFFPrLp/7.T3x/f.4Z6Uxy8V4a4RUYveW9Bkh9p/jNHLQ.K', NOW(), NOW(), NOW()),
('985ba5b6-63ae-4b09-9ba1-38e10e21080c', 'sponsor@example.com', '$2a$10$GJAWXSjFFPrLp/7.T3x/f.4Z6Uxy8V4a4RUYveW9Bkh9p/jNHLQ.K', NOW(), NOW(), NOW());

INSERT INTO users (id, email, name, avatar, account_type, created_at, updated_at) 
VALUES
('d42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'fan@example.com', 'Fan User', '/placeholder.svg?height=100&width=100&text=FU', 'fan', NOW(), NOW()),
('1f5a5c88-123c-4eb0-94c7-ed32c6218b49', 'talent@example.com', 'Talent User', '/placeholder.svg?height=100&width=100&text=TU', 'talent', NOW(), NOW()),
('985ba5b6-63ae-4b09-9ba1-38e10e21080c', 'sponsor@example.com', 'Sponsor User', '/placeholder.svg?height=100&width=100&text=SU', 'sponsor', NOW(), NOW());

INSERT INTO categories (id, name, description, thumbnail)
VALUES 
('c001', 'Singing', 'Vocal performances and singing talents', '/placeholder.svg?height=200&width=350&text=Singing'),
('c002', 'Dancing', 'Dance performances and choreography', '/placeholder.svg?height=200&width=350&text=Dancing'),
('c003', 'Comedy', 'Stand-up comedy, sketches, and humorous performances', '/placeholder.svg?height=200&width=350&text=Comedy'),
('c004', 'Art', 'Visual arts, drawing, painting, and digital art', '/placeholder.svg?height=200&width=350&text=Art'),
('c005', 'Acting', 'Dramatic performances and acting talents', '/placeholder.svg?height=200&width=350&text=Acting'),
('c006', 'Music Production', 'Beat making, music composition, and production', '/placeholder.svg?height=200&width=350&text=Music+Production');

INSERT INTO channels (id, name, description, subscribers, avatar, cover_image, category, created_at, updated_at, user_id)
VALUES
('ch001', 'Bruce Melodie', 'Rwandan R&B and Afrobeats artist', 125000, '/placeholder.svg?height=100&width=100&text=BM', '/placeholder.svg?height=300&width=1200&text=Bruce+Melodie+Cover', 'Singing', NOW(), NOW(), '1f5a5c88-123c-4eb0-94c7-ed32c6218b49'),
('ch002', 'Saju Engine', 'Dancehall and Afrobeats artist from Rwanda', 85000, '/placeholder.svg?height=100&width=100&text=SE', '/placeholder.svg?height=300&width=1200&text=Saju+Engine+Cover', 'Singing', NOW(), NOW(), '1f5a5c88-123c-4eb0-94c7-ed32c6218b49'),
('ch003', 'Izo Man', 'Comedian and entertainer from Rwanda', 98000, '/placeholder.svg?height=100&width=100&text=IM', '/placeholder.svg?height=300&width=1200&text=Izo+Man+Cover', 'Comedy', NOW(), NOW(), '1f5a5c88-123c-4eb0-94c7-ed32c6218b49'),
('ch004', 'Sherrie Silver', 'Rwandan-British choreographer and dancer', 110000, '/placeholder.svg?height=100&width=100&text=SS', '/placeholder.svg?height=300&width=1200&text=Sherrie+Silver+Cover', 'Dancing', NOW(), NOW(), '1f5a5c88-123c-4eb0-94c7-ed32c6218b49'),
('ch005', 'Meddy', 'Rwandan-American R&B singer', 150000, '/placeholder.svg?height=100&width=100&text=ME', '/placeholder.svg?height=300&width=1200&text=Meddy+Cover', 'Singing', NOW(), NOW(), '1f5a5c88-123c-4eb0-94c7-ed32c6218b49'),
('ch006', 'Clarisse Karasira', 'Traditional Rwandan vocalist', 75000, '/placeholder.svg?height=100&width=100&text=CK', '/placeholder.svg?height=300&width=1200&text=Clarisse+Karasira+Cover', 'Singing', NOW(), NOW(), '1f5a5c88-123c-4eb0-94c7-ed32c6218b49');

INSERT INTO videos (id, title, description, channel_id, views, likes, thumbnail, duration, video_url, created_at, updated_at)
VALUES
('v001', 'Katerina - Official Video', 'Bruce Melodie\'s hit single Katerina', 'ch001', 1250000, 45000, '/placeholder.svg?height=200&width=350&text=Katerina', '3:42', 'https://www.youtube.com/embed/FDcRHfhWZvA', NOW(), NOW()),
('v002', 'Saa Moya - Official Video', 'Bruce Melodie\'s song Saa Moya', 'ch001', 980000, 32000, '/placeholder.svg?height=200&width=350&text=Saa+Moya', '4:15', 'https://www.youtube.com/embed/xvQoxkKIpbw', NOW(), NOW()),
('v003', 'Ikinya - Official Video', 'Bruce Melodie\'s newest hit Ikinya', 'ch001', 750000, 28000, '/placeholder.svg?height=200&width=350&text=Ikinya', '3:53', 'https://www.youtube.com/embed/5Ym1YA0F3S0', NOW(), NOW()),
('v004', 'Ihogoza - Official Video', 'Saju Engine\'s popular song Ihogoza', 'ch002', 890000, 35000, '/placeholder.svg?height=200&width=350&text=Ihogoza', '4:02', 'https://www.youtube.com/embed/Nt2xC8bm3mU', NOW(), NOW()),
('v005', 'Inkoni - Official Video', 'Saju Engine\'s hit Inkoni', 'ch002', 720000, 27000, '/placeholder.svg?height=200&width=350&text=Inkoni', '3:47', 'https://www.youtube.com/embed/8Uojy2vfawQ', NOW(), NOW()),
('v006', 'Best Comedy Sketches Compilation', 'Funny moments with Izo Man', 'ch003', 950000, 42000, '/placeholder.svg?height=200&width=350&text=Comedy+Sketches', '15:23', 'https://www.youtube.com/embed/R0dZDDl9zvM', NOW(), NOW()),
('v007', 'Stand-up Comedy Special', 'Izo Man\'s latest stand-up comedy show', 'ch003', 820000, 38000, '/placeholder.svg?height=200&width=350&text=Stand-up+Comedy', '25:45', 'https://www.youtube.com/embed/K5e9x6-a_do', NOW(), NOW()),
('v008', 'African Dance Choreography', 'Amazing choreography by Sherrie Silver', 'ch004', 1100000, 55000, '/placeholder.svg?height=200&width=350&text=Dance+Choreography', '5:12', 'https://www.youtube.com/embed/lkANUHGpWvw', NOW(), NOW()),
('v009', 'Dance Tutorial - Beginners', 'Learn to dance with Sherrie Silver', 'ch004', 980000, 45000, '/placeholder.svg?height=200&width=350&text=Dance+Tutorial', '12:34', 'https://www.youtube.com/embed/HJX5vqdnGkA', NOW(), NOW()),
('v010', 'Slowly - Official Video', 'Meddy\'s hit song Slowly', 'ch005', 1850000, 82000, '/placeholder.svg?height=200&width=350&text=Slowly', '4:27', 'https://www.youtube.com/embed/QwzRCUoGGZ8', NOW(), NOW()),
('v011', 'Holy Spirit - Official Video', 'Meddy\'s inspirational song Holy Spirit', 'ch005', 1250000, 63000, '/placeholder.svg?height=200&width=350&text=Holy+Spirit', '4:05', 'https://www.youtube.com/embed/UiW0s21yCQw', NOW(), NOW()),
('v012', 'Intsinzi - Traditional Rwandan Song', 'Beautiful traditional performance', 'ch006', 750000, 35000, '/placeholder.svg?height=200&width=350&text=Intsinzi', '5:30', 'https://www.youtube.com/embed/jzw4_-ns-94', NOW(), NOW()),
('v013', 'Rwandan Cultural Performance', 'Clarisse Karasira showcasing Rwandan culture', 'ch006', 620000, 28000, '/placeholder.svg?height=200&width=350&text=Cultural+Performance', '8:15', 'https://www.youtube.com/embed/Q8UrUxI0pLk', NOW(), NOW());

INSERT INTO favorites (id, user_id, video_id, created_at)
VALUES
(uuid_generate_v4(), 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'v001', NOW()),
(uuid_generate_v4(), 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'v006', NOW()),
(uuid_generate_v4(), 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'v008', NOW()),
(uuid_generate_v4(), 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'v010', NOW());

INSERT INTO playlists (id, name, user_id, created_at, updated_at)
VALUES
('pl001', 'My Favorite Songs', 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', NOW(), NOW()),
('pl002', 'Dancing Inspiration', 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', NOW(), NOW());

INSERT INTO playlist_videos (id, playlist_id, video_id, created_at)
VALUES
(uuid_generate_v4(), 'pl001', 'v001', NOW()),
(uuid_generate_v4(), 'pl001', 'v002', NOW()),
(uuid_generate_v4(), 'pl001', 'v010', NOW()),
(uuid_generate_v4(), 'pl001', 'v011', NOW()),
(uuid_generate_v4(), 'pl002', 'v008', NOW()),
(uuid_generate_v4(), 'pl002', 'v009', NOW());

INSERT INTO subscriptions (id, user_id, channel_id, created_at)
VALUES
(uuid_generate_v4(), 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'ch001', NOW()),
(uuid_generate_v4(), 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'ch003', NOW()),
(uuid_generate_v4(), 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'ch004', NOW()),
(uuid_generate_v4(), 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'ch005', NOW());

INSERT INTO comments (id, content, user_id, video_id, created_at, updated_at)
VALUES
(uuid_generate_v4(), 'Amazing performance! Love this song!', 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'v001', NOW(), NOW()),
(uuid_generate_v4(), 'This dance is incredible, I want to learn it!', 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'v008', NOW(), NOW()),
(uuid_generate_v4(), 'So funny! Can\'t stop laughing 😂', 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'v006', NOW(), NOW()),
(uuid_generate_v4(), 'Beautiful voice, this song touches my soul', 'd42c3ebf-1580-4320-a1a0-30d46b94d6e2', 'v010', NOW(), NOW());

