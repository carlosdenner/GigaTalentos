import mongoose from 'mongoose';

// Clear the model if it exists to force recreation with new schema
if (mongoose.models.Projeto) {
  delete mongoose.models.Projeto;
}

const ProjetoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  objetivo: { type: String }, // Objetivo específico do projeto
  video_apresentacao: { type: String }, // URL do vídeo de apresentação do projeto
  seguidores: { type: Number, default: 0 },
  avatar: { type: String },
  imagem_capa: { type: String },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  tecnologias: [{ type: String }], // Array of technologies used in the project
  repositorio_url: { type: String }, // GitHub repository URL
  demo_url: { type: String }, // Live demo URL
  talento_lider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  criador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Quem criou (pode ser mentor ou talent)
  portfolio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true }, // Projeto pertence a um Portfólio
  desafio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Desafio' }, // Vinculação opcional com Desafio
  desafio_vinculacao_status: { type: String, enum: ['pendente', 'aprovado', 'rejeitado'], default: 'pendente' }, // Status da vinculação ao desafio
  desafio_solicitado_em: { type: Date }, // Quando foi solicitada a vinculação
  mentor_aprovador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Mentor que aprovou vinculação ao desafio
  desafio_aprovado: { type: Boolean, default: false }, // Se a vinculação ao desafio foi aprovada
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Usuários que curtiram o projeto
  sponsors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Mentors que oferecem mentoria/apoio ao projeto
  
  // Sistema de participação detalhado
  solicitacoes_participacao: [{
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mensagem: { type: String }, // Mensagem opcional do solicitante
    status: { type: String, enum: ['pendente', 'aprovado', 'rejeitado'], default: 'pendente' },
    solicitado_em: { type: Date, default: Date.now },
    respondido_em: { type: Date },
    resposta_mensagem: { type: String } // Mensagem de resposta do líder
  }],
  
  // Arrays simplificados para compatibilidade
  participantes_solicitados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Derived from solicitacoes_participacao
  participantes_aprovados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Participantes aprovados pelo líder
  
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Usuários que favoritaram
  verificado: { type: Boolean, default: false },
  demo: { type: Boolean, default: false },
  status: { type: String, enum: ['ativo', 'concluido', 'pausado'], default: 'ativo' },
  criado_em: { type: Date, default: Date.now },
  atualizado_em: { type: Date, default: Date.now },
});

export default mongoose.model('Projeto', ProjetoSchema);
