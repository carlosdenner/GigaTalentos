import mongoose from 'mongoose';

// Clear the model if it exists to force recreation with new schema
if (mongoose.models.ParticipationRequest) {
  delete mongoose.models.ParticipationRequest;
}

const ParticipationRequestSchema = new mongoose.Schema({
  projeto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Projeto', required: true },
  solicitante_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Talent que solicita
  lider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Líder do projeto
  mensagem: { type: String }, // Mensagem do solicitante
  status: { 
    type: String, 
    enum: ['pendente', 'aprovado', 'rejeitado'], 
    default: 'pendente' 
  },
  habilidades_oferecidas: [{ type: String }], // Habilidades que o talent oferece
  area_interesse: { type: String }, // Área de interesse no projeto
  experiencia_relevante: { type: String }, // Experiência relevante
  criado_em: { type: Date, default: Date.now },
  respondido_em: { type: Date },
  resposta_lider: { type: String }, // Resposta do líder (motivo da aprovação/rejeição)
});

// Compound index to ensure unique requests per user per project
ParticipationRequestSchema.index({ projeto_id: 1, solicitante_id: 1 }, { unique: true });

export default mongoose.model('ParticipationRequest', ParticipationRequestSchema);
