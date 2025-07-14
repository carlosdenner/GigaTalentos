import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String },
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }, // Manter por compatibilidade temporária
  projeto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Projeto' }, // Novo campo
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  video_url: { type: String, required: true },
  category: { type: String, required: true }, // Category name for display
  category_code: { type: String }, // Category code for reliable association
  featured: { type: Boolean, default: false },
  demo: { type: Boolean, default: false },
  tags: [{ type: String }],
  duration: { type: String },
  
  // YouTube-specific fields
  youtube_id: { type: String, unique: true, sparse: true }, // YouTube video ID
  youtube_views: { type: Number, default: 0 }, // Real YouTube view count
  youtube_likes: { type: Number, default: 0 }, // Real YouTube like count
  youtube_comments: { type: Number, default: 0 }, // Real YouTube comment count
  youtube_published_at: { type: Date }, // Original YouTube publish date
  youtube_channel_title: { type: String }, // Original YouTube channel name
  youtube_last_updated: { type: Date }, // When metrics were last fetched
  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Indexes - don't duplicate youtube_id since it's already unique
VideoSchema.index({ category: 1, featured: -1, youtube_views: -1 });
VideoSchema.index({ youtube_views: -1 }); // For sorting by popularity

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);