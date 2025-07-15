import mongoose from 'mongoose';

// Clear the model if it exists to force recreation with new schema
if (mongoose.models.UserInteraction) {
  delete mongoose.models.UserInteraction;
}

const UserInteractionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can reference Video, Comment, etc.
  content_type: { type: String, required: true, enum: ['video', 'comment', 'channel', 'playlist', 'category'] },
  
  // Interaction types
  action: { 
    type: String, 
    required: true, 
    enum: [
      'view', 'like', 'dislike', 'favorite', 'unfavorite', 
      'share', 'comment', 'reply', 'subscribe', 'unsubscribe',
      'bookmark', 'unbookmark', 'download', 'report',
      'rate', 'review', 'follow', 'unfollow'
    ]
  },
  
  // Contextual data
  context: {
    page: { type: String }, // where the interaction happened
    position: { type: Number }, // position in list/carousel
    search_query: { type: String },
    referrer: { type: String },
    session_id: { type: String }
  },
  
  // Interaction metadata
  metadata: {
    rating: { type: Number, min: 1, max: 5 }, // for rating actions
    duration: { type: Number }, // how long they spent before action
    scroll_depth: { type: Number }, // percentage of page scrolled
    click_coordinates: {
      x: { type: Number },
      y: { type: Number }
    }
  },
  
  // Temporal data
  timestamp: { type: Date, default: Date.now },
  timezone: { type: String },
  
  // Device and technical context
  device_info: {
    type: { type: String, enum: ['desktop', 'tablet', 'mobile'] },
    os: { type: String },
    browser: { type: String },
    screen_resolution: { type: String },
    viewport_size: { type: String }
  },
  
  // For A/B testing and recommendations
  experiment_variant: { type: String },
  recommendation_source: { type: String }, // algorithm that recommended this content
  recommendation_score: { type: Number }, // confidence score of recommendation
  
  created_at: { type: Date, default: Date.now }
});

// Indexes for analytics and performance
UserInteractionSchema.index({ user_id: 1, timestamp: -1 });
UserInteractionSchema.index({ content_id: 1, content_type: 1 });
UserInteractionSchema.index({ action: 1, timestamp: -1 });
UserInteractionSchema.index({ 'context.session_id': 1 });
UserInteractionSchema.index({ recommendation_source: 1 });

export default mongoose.model('UserInteraction', UserInteractionSchema);
