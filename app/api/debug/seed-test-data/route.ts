import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User, Video, Comment, UserInteraction, VideoWatch, Favorite } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { includeUserData = true } = body;

    let results: any = {
      message: 'Test data seeded successfully',
      seeded: {}
    };

    if (includeUserData) {
      // Ensure we have a test user
      let testUser = await User.findOne({ email: 'test@gigatalentos.com' });
      if (!testUser) {
        testUser = await User.create({
          name: 'Test User',
          email: 'test@gigatalentos.com',
          password: 'hashed_password_123',
          account_type: 'talent',
          user_type: 'talent',
          created_at: new Date()
        });
        results.seeded.user = 'Created new test user';
      } else {
        results.seeded.user = 'Test user already exists';
      }

      // Get some videos to interact with
      const videos = await Video.find({ youtube_id: { $exists: true } }).limit(5);
      
      if (videos.length > 0) {
        const video = videos[0];
        
        // Create some sample interactions
        const interactions = [
          {
            user_id: testUser._id,
            content_id: video._id,
            content_type: 'video',
            action: 'view',
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            context: {
              page: 'videos',
              source: 'browse'
            }
          },
          {
            user_id: testUser._id,
            content_id: video._id,
            content_type: 'video',
            action: 'like',
            timestamp: new Date(Date.now() - 82800000), // 23 hours ago
            context: {
              page: 'carousel'
            }
          },
          {
            user_id: testUser._id,
            content_id: video._id,
            content_type: 'video',
            action: 'favorite',
            timestamp: new Date(Date.now() - 7200000), // 2 hours ago
            context: {
              page: 'carousel'
            }
          }
        ];

        for (const interaction of interactions) {
          const existing = await UserInteraction.findOne({
            user_id: interaction.user_id,
            content_id: interaction.content_id,
            action: interaction.action
          });
          if (!existing) {
            await UserInteraction.create(interaction);
          }
        }
        results.seeded.interactions = `${interactions.length} interactions`;

        // Create a sample comment
        const existingComment = await Comment.findOne({
          user_id: testUser._id,
          video_id: video._id
        });
        if (!existingComment) {
          const comment = await Comment.create({
            user_id: testUser._id,
            video_id: video._id,
            content: 'Este vídeo é muito útil para empreendedores! Obrigado pelo conteúdo.',
            created_at: new Date(Date.now() - 3600000), // 1 hour ago
            likes: []
          });
          results.seeded.comment = 'Created sample comment';
        } else {
          results.seeded.comment = 'Sample comment already exists';
        }

        // Create a watch session
        const existingWatch = await VideoWatch.findOne({
          user_id: testUser._id,
          video_id: video._id
        });
        if (!existingWatch) {
          await VideoWatch.create({
            user_id: testUser._id,
            video_id: video._id,
            session_id: `session_${Date.now()}_test`,
            start_time: new Date(Date.now() - 1800000), // 30 minutes ago
            end_time: new Date(Date.now() - 600000), // 10 minutes ago
            total_watch_time: 1200, // 20 minutes
            completion_percentage: 85,
            last_position: 1200,
            paused_count: 3,
            device_type: 'desktop',
            source: 'carousel'
          });
          results.seeded.watch_session = 'Created watch session';
        } else {
          results.seeded.watch_session = 'Watch session already exists';
        }

        // Create a favorite
        const existingFavorite = await Favorite.findOne({
          user_id: testUser._id,
          video_id: video._id
        });
        if (!existingFavorite) {
          await Favorite.create({
            user_id: testUser._id,
            video_id: video._id,
            created_at: new Date(Date.now() - 7200000) // 2 hours ago
          });
          results.seeded.favorite = 'Created favorite';
        } else {
          results.seeded.favorite = 'Favorite already exists';
        }

        results.test_video = {
          id: video._id,
          title: video.title,
          youtube_id: video.youtube_id
        };
      } else {
        results.warning = 'No YouTube videos found to create test interactions';
      }
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('Error seeding test data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to seed test data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
