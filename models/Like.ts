import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  created_at: { type: Date, default: Date.now },
});

// Add compound index to prevent multiple likes from same user
LikeSchema.index({ user_id: 1, video_id: 1 }, { unique: true });

export default mongoose.models.Like || mongoose.model('Like', LikeSchema);