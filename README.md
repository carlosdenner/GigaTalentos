# Giga Talentos

![Logo Giga Talentos](public/giga-talentos-logo.svg)

## Descubra os Empreendedores Emergentes do Brasil

Giga Talentos é uma plataforma dinâmica que conecta talentos empreendedores brasileiros com mentores e oportunidades em inovação e negócios. Capacitamos empreendedores emergentes, inovadores e criadores fornecendo-lhes visibilidade, recursos e conexões com mentores que podem ajudar a transformar suas ideias em empreendimentos de sucesso.

## ✨ Recursos Principais

### Descobrir
- Explore talentos em dimensões-chave: Habilidade Cognitiva e Técnica, Criatividade e Inovação, Liderança e Colaboração, e mais
- Assista apresentações de projetos de alta qualidade, vídeos de pitch e showcases de inovação de empreendedores brasileiros
- Explore desafios em destaque e conteúdo de startups em tendência
- Funcionalidade de busca avançada para encontrar perfis de talentos específicos ou tipos de projetos

### Apresentar
- Crie um perfil profissional destacando sua jornada empreendedora e habilidades técnicas
- Faça upload e gerencie vídeos de seus pitches, demos de projetos e apresentações de inovação
- Construa portfólios curados para organizar seu trabalho e mostrar seu crescimento
- Ganhe seguidores e construa sua rede dentro da comunidade empreendedora

### Conectar
- Conecte-se com outros empreendedores talentosos e inovadores
- Interaja com mentores procurando jovens de alto potencial para orientar
- Receba feedback através de comentários e interações em seus projetos
- Acesse oportunidades para hackathons, incubadoras e avanço na carreira

## 🌍 Experiências do Usuário

### Para Empreendedores (Talentos)
- Ferramentas para apresentar seus projetos de startup e inovações técnicas
- Oportunidades para colaborar com outros empreendedores em equipes de hackathon
- Acesso a mentoria e feedback de líderes empresariais experientes
- Plataforma para demonstrar suas habilidades de resolução de problemas e soluções criativas

### Para Mentores
- Descubra jovens de alto potencial com habilidades cognitivas e técnicas excepcionais
- Mensagens diretas com empreendedores promissores mostrando inovação e liderança
- Filtragem personalizada para encontrar talentos por dimensões específicas (criatividade, resiliência, consciência social)
- Oportunidade de orientar a próxima geração de inovadores éticos e agentes de mudança

### Para Membros da Comunidade
- Fluxo infinito de pitches de startups frescas e showcases de inovação
- Participação da comunidade através de comentários e feedback de projetos
- Salve favoritos e crie coleções personalizadas de projetos inspiradores
- Siga empreendedores e equipes para atualizações regulares sobre seus empreendimentos

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