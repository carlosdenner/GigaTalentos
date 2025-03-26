import mongoose from 'mongoose';

const ChannelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  subscribers: { type: Number, default: 0 },
  avatar: { type: String },
  cover_image: { type: String },
  category: { type: mongoose.Schema.ObjectId, ref: 'Category' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Channel || mongoose.model('Channel', ChannelSchema);