import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  created_at: { type: Date, default: Date.now },
});

// Compound index to ensure unique favorites
FavoriteSchema.index({ user_id: 1, video_id: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);