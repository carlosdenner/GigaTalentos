import mongoose from 'mongoose';

// Clear existing model to ensure schema updates are applied
if (mongoose.models.Message) {
  delete mongoose.models.Message;
}

const MessageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  sender_type: { type: String, required: true, enum: ['mentor', 'talent', 'fan'] }
});

// Note: Business logic for message permissions should be handled in API routes
// This model allows storage of all message types for comprehensive demo/testing

export default mongoose.model('Message', MessageSchema);