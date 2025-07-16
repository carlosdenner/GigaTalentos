import mongoose from 'mongoose';

// Clear the model if it exists to force recreation with new schema
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String },
  account_type: { type: String, enum: ['fan', 'mentor', 'talent', 'admin'], required: true },
  user_type: { type: String, enum: ['fan', 'mentor', 'talent', 'admin'] }, // Para compatibilidade
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
  
  // Social features
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Recommendation system fields
  preferences: {
    categories: [{ type: String }],
    topics: [{ type: String }],
    contentTypes: [{ type: String }]
  },
  interactionHistory: [{
    contentId: { type: String, required: true },
    contentType: { type: String, required: true },
    action: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
  }]
});

export default mongoose.model('User', UserSchema);