import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true }, // Short code for easy reference
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Add a pre-save middleware to update the updated_at field
CategorySchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);