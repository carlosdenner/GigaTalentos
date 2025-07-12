import mongoose from 'mongoose';

// Clear the model if it exists to force recreation with new schema
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String },
  account_type: { type: String, enum: ['fan', 'mentor', 'talent'], required: true },
  user_type: { type: String, enum: ['fan', 'mentor', 'talent'] }, // Para compatibilidade
  bio: { type: String },
  location: { type: String },
  skills: [{ type: String }],
  experience: { type: String },
  portfolio: { type: String },
  categories: [{ type: String }],
  verified: { type: Boolean, default: false },
  projects_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  password: { type: String, required: true },
});

export default mongoose.model('User', UserSchema);