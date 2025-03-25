import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String },
  account_type: { type: String, enum: ['fan', 'sponsor', 'talent'], required: true },
  created_at: { type: Date, default: Date.now },
  password: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);