import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Playlist || mongoose.model('Playlist', PlaylistSchema);