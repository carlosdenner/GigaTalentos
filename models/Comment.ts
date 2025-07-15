import mongoose from 'mongoose';

// Clear the model if it exists to force recreation with new schema
if (mongoose.models.Comment) {
  delete mongoose.models.Comment;
}

const CommentSchema = new mongoose.Schema({
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 2000 },
  parent_comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // For replies
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reported: { type: Boolean, default: false },
  moderated: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

CommentSchema.index({ video_id: 1, created_at: -1 });
CommentSchema.index({ user_id: 1 });
CommentSchema.index({ parent_comment_id: 1 });

export default mongoose.model('Comment', CommentSchema);
