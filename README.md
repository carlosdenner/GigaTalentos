# Giga Talentos 🚀

**Giga Talentos** é uma plataforma brasileira de identificação e desenvolvimento de talentos empreendedores, focada nas 6 dimensões científicas fundamentais para o sucesso no empreendedorismo e inovação.

## 🎯 Missão

Democratizar o acesso ao empreendedorismo no Brasil, conectando talentos promissores com oportunidades, mentores e recursos para transformar ideias em negócios de impacto social positivo.

## 🔄 Lógica de Negócio e Fluxo do Usuário

### **Filosofia Central: Talento → Projeto → Desafio**

A Giga Talentos opera em um ecossistema onde:

1. **Talentos** se cadastram e demonstram suas habilidades
2. **Criam Projetos** que showcasem suas competências nas 6 dimensões
3. **Participam de Desafios** para desenvolver e validar novas habilidades
4. **Constroem Portfólio** que atrai mentores, investidores e oportunidades

### **Jornada do Usuário**

#### **Fase 1: Descoberta e Cadastro**
- Usuário explora projetos em destaque e talentos da comunidade
- Se cadastra escolhendo tipo de conta (Talento, Fã ou Mentor)
- Completa perfil com bio, habilidades e categorias de interesse

#### **Fase 2: Construção de Portfólio**
- Upload de projetos com vídeos demonstrando habilidades
- Organização por uma ou mais das 6 dimensões de talento
- Curadoria de playlist pessoal com projetos favoritos

#### **Fase 3: Participação em Desafios**
- Exploração de desafios ativos organizados por categoria
- Participação em competições com prazos e critérios específicos
- Networking com outros participantes e mentores

#### **Fase 4: Crescimento e Reconhecimento**
- Projetos ganham visibilidade e podem ser destacados
- Talentos recebem verificação e reconhecimento da comunidade
- Oportunidades de mentoria, investimento e parcerias

## 🧬 As 6 Dimensões do Talento Empreendedor

### 1. **Habilidade Cognitiva & Técnica** 💻
Capacidade de resolver problemas complexos, pensamento analítico e competências técnicas específicas necessárias para desenvolvimento de soluções inovadoras.

**Projetos Exemplo**: Sistemas IoT, Apps Mobile, Análise de Dados, IA/ML

### 2. **Criatividade & Inovação** 🎨
Capacidade de gerar ideias originais e implementar soluções inovadoras para desafios existentes, transformando conceitos em realidade.

**Projetos Exemplo**: Design Thinking, Produtos Disruptivos, Arte Digital, Conceitos Únicos

### 3. **Liderança & Colaboração** 👥
Habilidade de inspirar equipes, facilitar colaboração efetiva e dirigir projetos multidisciplinares para o sucesso.

**Projetos Exemplo**: Gestão de Equipes, Hackathons, Projetos Colaborativos, Mentorias

### 4. **Resiliência & Adaptabilidade** 💪
Capacidade de superar obstáculos, aprender com falhas e adaptar-se rapidamente a mudanças do mercado e tecnologia.

**Projetos Exemplo**: Stories de Superação, Pivots de Negócio, Adaptação a Crises

### 5. **Consciência Social & Ética** 🌱
Compreensão do impacto social, responsabilidade ética e compromisso com desenvolvimento sustentável e inclusivo.

**Projetos Exemplo**: Sustentabilidade, ESG, Impacto Social, Inclusão Digital

### 6. **Comunicação & Persuasão** 🎤
Habilidade de comunicar ideias complexas de forma clara e influenciar stakeholders para ação e mudança positiva.

**Projetos Exemplo**: Pitches, Storytelling, Marketing, Apresentações Técnicas

## 🌟 Funcionalidades Implementadas

### **Core Features**
- ✅ **Portfólio de Talentos**: 8 perfis demo com bios detalhadas, skills e portfolios
- ✅ **Projetos em Destaque**: 11 projetos reais demonstrando as 6 dimensões
- ✅ **Desafios Empreendedoriais**: 6 desafios ativos com prêmios e critérios
- ✅ **Sistema de Categorias**: Organização completa pelas 6 dimensões científicas
- ✅ **Interface Responsiva**: Design moderno em verde/azul otimizado para mobile

### **Recursos Avançados**
- ✅ **Autenticação Completa**: Sistema de login/registro com NextAuth.js
- ✅ **Playlists Personalizadas**: Curadoria de projetos favoritos por usuário
- ✅ **Sistema de Likes**: Interação social com projetos da comunidade
- ✅ **Busca Inteligente**: Filtros por categoria, dificuldade e status
- ✅ **Perfis Verificados**: Sistema de verificação para talentos autênticos

### **Dados Demo Realistas**
- 🎭 **8 Talentos Brasileiros**: Perfis completos de SP, RJ, MG, DF, PR, CE, BA, RS
- 📱 **11 Projetos Diversos**: Desde IoT até ESG, cobrindo todas as dimensões
- 🏆 **6 Desafios Ativos**: Com prêmios de R$ 2K a R$ 25K e prazos realistas
- 🎯 **6 Categorias Científicas**: Baseadas em pesquisa de talentos empreendedores

## 💻 Stack Tecnológica

### **Frontend**
- **Next.js 14** com App Router para SSR e performance otimizada
- **React 18** com hooks modernos e context para estado global
- **Tailwind CSS** com design system customizado verde/azul
- **shadcn/ui** para componentes acessíveis e consistentes
- **Lucide Icons** para iconografia moderna e limpa

### **Backend**
- **Next.js API Routes** para endpoints RESTful
- **MongoDB** com Mongoose para modelagem de dados
- **NextAuth.js** para autenticação segura e social login
- **bcryptjs** para hash de senhas

### **Infrastructure**
- **Vercel** para deploy contínuo e edge computing
- **MongoDB Atlas** para banco de dados em nuvem
- **Cloudinary** para otimização e delivery de imagens
- **Git/GitHub** para versionamento e colaboração

## 🔧 Setup de Desenvolvimento

### **Pré-requisitos**
```bash
Node.js 18+ 
MongoDB 6+
Git 2.30+
```

### **Instalação Rápida**

1. **Clone e Configure**:
```bash
git clone https://github.com/gigacandanga/giga-talentos.git
cd giga-talentos
npm install
```

2. **Variáveis de Ambiente** (`.env.local`):
```env
MONGODB_URI=mongodb://localhost:27017/giga-talentos
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. **Inicializar e Popular**:
```bash
npm run dev
# Em outro terminal:
curl -X POST http://localhost:3000/api/seed-all -H "Content-Type: application/json"
```

### **Scripts Disponíveis**
```bash
npm run dev          # Servidor desenvolvimento
npm run build        # Build produção  
npm run start        # Servidor produção
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

### **Endpoints de Seed**
```bash
POST /api/seed            # Categorias (6)
POST /api/seed-users      # Usuários demo (8)  
POST /api/seed-desafios   # Desafios (6)
POST /api/seed-projects   # Projetos (11)
POST /api/seed-all        # Todos em sequência
```

## 🚀 Próximas Features

### **Q3 2025 - Engajamento Avançado**
- 🔔 **Sistema de Notificações**: Push notifications para novos desafios e atualizações
- 💬 **Chat em Tempo Real**: Messaging entre talentos, mentores e investidores  
- 🎥 **Video Calls Integradas**: Reuniões e mentoring direto na plataforma
- 📊 **Analytics de Perfil**: Métricas detalhadas de visualizações e engajamento

### **Q4 2025 - Monetização e Parcerias**
- 💰 **Sistema de Pagamentos**: Prêmios em dinheiro para desafios vencedores
- 🤝 **Marketplace de Talentos**: Contratação direta de freelancers especializados
- 🏢 **Portal Corporativo**: Dashboard para empresas buscarem talentos
- 📜 **Certificações**: Badges e certificados verificados por competência

### **Q1 2026 - IA e Personalização**
- 🤖 **Matching Inteligente**: IA para conectar talentos com oportunidades ideais
- 📈 **Análise Preditiva**: Identificação de talentos com maior potencial de sucesso
- 🎯 **Recomendações Personalizadas**: Feed customizado baseado em comportamento
- 📚 **Curadoria Automática**: Playlists de aprendizado geradas por IA

### **Q2 2026 - Expansão e Impacto**
- 🌎 **Expansão Internacional**: Versões para México, Colômbia e Argentina
- 🏫 **Programa Educacional**: Parcerias com universidades brasileiras
- 📱 **App Mobile Nativo**: iOS e Android com funcionalidades offline
- 🌱 **Impacto Social**: Métricas de transformação social e geração de renda

## 🎯 Métricas de Sucesso

### **Objetivos 2025**
- 👥 **10.000 talentos** cadastrados e ativos
- 📁 **50.000 projetos** publicados na plataforma  
- 🏆 **500 desafios** realizados com premiação
- 💼 **1.000 conexões** entre talentos e oportunidades
- 🌟 **95% satisfação** dos usuários verificados

## 🤝 Como Contribuir

### **Para Desenvolvedores**
1. Fork o repositório
2. Crie branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra Pull Request com descrição detalhada

### **Para a Comunidade**
- 🐛 **Reporte bugs** via GitHub Issues
- 💡 **Sugira features** no nosso roadmap público
- 📝 **Melhore a documentação** 
- 🎨 **Contribua com design** e UX feedback
- 🧪 **Teste features beta** e dê feedback

## 📞 Contato e Suporte

**GigaCandanga - Inovação & Empreendedorismo**

🌐 **Website**: [gigacandanga.com](https://gigacandanga.com)  
📧 **Email**: contato@gigacandanga.com  
💼 **LinkedIn**: [/company/gigacandanga](https://linkedin.com/company/gigacandanga)  
📸 **Instagram**: [@gigacandanga](https://instagram.com/gigacandanga)  
📱 **WhatsApp**: +55 (61) 99999-9999

### **Equipe Core**
- **Fundador & CEO**: Especialista em identificação de talentos
- **CTO**: Arquiteto de soluções escaláveis
- **Head of Product**: Designer de experiências transformadoras
- **Head of Community**: Facilitador de conexões e networking

---

<div align="center">

**Desenvolvido com ❤️ em Brasília pela equipe GigaCandanga**

*Transformando talentos em empreendedores de impacto desde 2025*

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)](https://mongodb.com)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2014-blue)](https://nextjs.org)

</div>
