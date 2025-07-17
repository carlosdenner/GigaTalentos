import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  is_public: { type: Boolean, default: true },
  total_duration: { type: Number, default: 0 }, // in seconds
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Playlist || mongoose.model('Playlist', PlaylistSchema);