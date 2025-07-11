import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String },
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  video_url: { type: String, required: true },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
  demo: { type: Boolean, default: false },
  tags: [{ type: String }],
  duration: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);