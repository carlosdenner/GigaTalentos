import mongoose from 'mongoose';

// Clear the model if it exists to force recreation with new schema
if (mongoose.models.VideoWatch) {
  delete mongoose.models.VideoWatch;
}

const VideoWatchSchema = new mongoose.Schema({
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session_id: { type: String, required: true }, // To track individual viewing sessions
  
  // Watch progress and behavior
  watch_duration: { type: Number, default: 0 }, // in seconds
  total_duration: { type: Number }, // video total duration in seconds
  completion_percentage: { type: Number, default: 0 }, // 0-100
  watch_quality: { type: String, enum: ['poor', 'average', 'good', 'excellent'], default: 'average' },
  
  // Engagement metrics
  paused_count: { type: Number, default: 0 },
  skipped_forward: { type: Number, default: 0 }, // seconds skipped forward
  skipped_backward: { type: Number, default: 0 }, // seconds skipped backward
  replay_count: { type: Number, default: 0 },
  speed_changes: [{ 
    from_speed: { type: Number },
    to_speed: { type: Number },
    timestamp: { type: Number } // seconds into video
  }],
  
  // Learning assessment
  quiz_attempts: { type: Number, default: 0 },
  quiz_score: { type: Number }, // percentage
  notes_taken: { type: Number, default: 0 },
  bookmarks: [{ 
    timestamp: { type: Number }, // seconds into video
    note: { type: String }
  }],
  
  // Context and source
  source: { type: String, enum: ['search', 'recommendation', 'category', 'direct', 'carousel'], default: 'direct' },
  previous_video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  next_video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  
  // Timing
  started_at: { type: Date, default: Date.now },
  completed_at: { type: Date },
  last_position: { type: Number, default: 0 }, // last watched position in seconds
  
  // Device and context
  device_type: { type: String, enum: ['desktop', 'tablet', 'mobile'], default: 'desktop' },
  user_agent: { type: String },
  ip_address: { type: String },
  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Indexes for performance and analytics
VideoWatchSchema.index({ video_id: 1, user_id: 1 });
VideoWatchSchema.index({ user_id: 1, started_at: -1 });
VideoWatchSchema.index({ session_id: 1 });
VideoWatchSchema.index({ source: 1 });
VideoWatchSchema.index({ completion_percentage: 1 });

export default mongoose.model('VideoWatch', VideoWatchSchema);
