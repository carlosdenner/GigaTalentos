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
- Se cadastra escolhendo tipo de conta (Talento, Fã ou Patrocinador)
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

## 💻 Tecnologia

Construído com tecnologias modernas para garantir uma experiência suave e responsiva para empreendedores e mentores:

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Rotas de API Next.js com integração MongoDB
- **Dados**: Banco de dados MongoDB para perfis de talentos e dados de projetos escaláveis
- **Mídia**: Streaming de vídeo otimizado para apresentações de pitch e demos de projetos
- **Segurança**: Autenticação robusta com NextAuth.js
- **Deploy**: Deploy contínuo através do Vercel

## 🛠️ Configuração de Desenvolvimento

### Pré-requisitos
- Node.js 18.x ou superior
- Gerenciador de pacotes npm ou yarn
- Conta no MongoDB Atlas ou MongoDB local
- Conta Vercel (recomendada para deploy)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/yourusername/GigaTalentos.git
   cd GigaTalentos
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```
   Então edite `.env.local` com suas variáveis MONGODB_URI, NEXTAUTH_SECRET e NEXTAUTH_URL

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000) para visualizar a aplicação.

## 🤝 Contribuindo

Recebemos contribuições de desenvolvedores apaixonados por apoiar o empreendedorismo brasileiro e o desenvolvimento de talentos. Consulte nosso arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- Obrigado a todos os empreendedores talentosos e inovadores que inspiram esta plataforma
- Agradecimento especial aos nossos mentores e apoiadores do ecossistema de startups brasileiro
- Construído com amor para o futuro empreendedor do Brasil