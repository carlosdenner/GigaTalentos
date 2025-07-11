import mongoose from 'mongoose';

// Clear the model if it exists to force recreation with new schema
if (mongoose.models.Projeto) {
  delete mongoose.models.Projeto;
}

const ProjetoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  objetivo: { type: String }, // Objetivo específico do projeto
  seguidores: { type: Number, default: 0 },
  avatar: { type: String },
  imagem_capa: { type: String },
  categoria: { type: String },
  talento_lider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  criador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Quem criou (pode ser mentor ou talent)
  portfolio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true }, // Projeto pertence a um Portfólio
  desafio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Desafio' }, // Vinculação opcional com Desafio
  mentor_aprovador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Mentor que aprovou vinculação ao desafio
  desafio_aprovado: { type: Boolean, default: false }, // Se a vinculação ao desafio foi aprovada
  sponsors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Mentors que patrocinam o projeto
  participantes_solicitados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Talents que solicitaram participação
  participantes_aprovados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Participantes aprovados pelo líder
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Usuários que favoritaram
  verificado: { type: Boolean, default: false },
  demo: { type: Boolean, default: false },
  status: { type: String, enum: ['ativo', 'concluido', 'pausado'], default: 'ativo' },
  criado_em: { type: Date, default: Date.now },
  atualizado_em: { type: Date, default: Date.now },
});

export default mongoose.model('Projeto', ProjetoSchema);
