import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  sender_type: { type: String, required: true, enum: ['sponsor', 'talent', 'user'] }
});

// Add validation middleware
MessageSchema.pre('save', async function(next) {
  if (this.sender_type !== 'sponsor') {
    const error = new Error('Only sponsors can send messages');
    next(error);
  }
  next();
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);