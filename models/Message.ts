import mongoose from 'mongoose';

// Clear existing model to ensure schema updates are applied
if (mongoose.models.Message) {
  delete mongoose.models.Message;
}

const MessageSchema = new mongoose.Schema({
  remetente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destinatario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assunto: { type: String, required: true },
  mensagem: { type: String, required: true },
  tipo: { 
    type: String, 
    enum: ['general', 'mentorship_request', 'mentorship_response', 'participation_request', 'project_update'],
    default: 'general'
  },
  metadata: {
    projeto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Projeto' },
    tipo_solicitacao: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  },
  data_envio: { type: Date, default: Date.now },
  lida: { type: Boolean, default: false },
  
  // Legacy fields for backward compatibility with existing seed data
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String },
  created_at: { type: Date },
  read: { type: Boolean },
  sender_type: { type: String, enum: ['mentor', 'talent', 'fan'] }
});

// Pre-save middleware to handle legacy field conversion
MessageSchema.pre('save', function(next) {
  // Convert legacy fields to new structure if they exist
  if (this.sender_id && !this.remetente) {
    this.remetente = this.sender_id;
  }
  if (this.receiver_id && !this.destinatario) {
    this.destinatario = this.receiver_id;
  }
  if (this.content && !this.mensagem) {
    this.mensagem = this.content;
    this.assunto = 'Mensagem'; // Default subject for legacy messages
  }
  if (this.created_at && !this.data_envio) {
    this.data_envio = this.created_at;
  }
  if (typeof this.read !== 'undefined' && this.read !== null && typeof this.lida === 'undefined') {
    this.lida = Boolean(this.read);
  }
  
  next();
});

export default mongoose.model('Message', MessageSchema);