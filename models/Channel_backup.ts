import mongoose from 'mongoose';

// Clear the model if it exists to force recreation with new schema
if (mongoose.models.Channel) {
  delete mongoose.models.Channel;
}

const ChannelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  subscribers: { type: Number, default: 0 },
  avatar: { type: String },
  cover_image: { type: String },
  category: { type: String }, // Store category name as string
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verified: { type: Boolean, default: false },
  demo: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model('Channel', ChannelSchema);