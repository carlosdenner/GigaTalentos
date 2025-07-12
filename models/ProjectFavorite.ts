import mongoose from 'mongoose';

// Clear the model if it exists to force recreation with new schema
if (mongoose.models.ProjectFavorite) {
  delete mongoose.models.ProjectFavorite;
}

const ProjectFavoriteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projeto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Projeto', required: true },
  created_at: { type: Date, default: Date.now },
});

// Compound index to ensure unique favorites
ProjectFavoriteSchema.index({ user_id: 1, projeto_id: 1 }, { unique: true });

export default mongoose.model('ProjectFavorite', ProjectFavoriteSchema);
