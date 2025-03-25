import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  created_at: { type: Date, default: Date.now },
});

// Add compound index to prevent multiple subscriptions from same user
SubscriptionSchema.index({ user_id: 1, channel_id: 1 }, { unique: true });

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);