import mongoose from 'mongoose';

const DesafioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Iniciante', 'Intermediário', 'Avançado'],
    default: 'Iniciante',
  },
  duration: {
    type: String, // e.g., "2 semanas", "1 mês"
    required: true,
  },
  // Removed static participants field - will be calculated dynamically from projetos_vinculados
  prizes: [{
    position: String, // "1º Lugar", "2º Lugar", etc.
    description: String,
    value: String, // "R$ 5.000", "Mentoria", etc.
  }],
  requirements: [String],
  submissions: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    project_url: String,
    description: String,
    submitted_at: {
      type: Date,
      default: Date.now,
    },
  }],
  status: {
    type: String,
    enum: ['Ativo', 'Em Breve', 'Finalizado'],
    default: 'Ativo',
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  favoritos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }], // Usuários que favoritaram o desafio
  projetos_vinculados: [{
    projeto_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Projeto'
    },
    status: {
      type: String,
      enum: ['pendente', 'aprovado', 'rejeitado'],
      default: 'pendente'
    },
    solicitado_em: {
      type: Date,
      default: Date.now
    },
    aprovado_em: {
      type: Date
    }
  }], // Projetos que solicitaram vinculação ao desafio
});

export default mongoose.models.Desafio || mongoose.model('Desafio', DesafioSchema);
