# Giga Talentos

![Giga Talentos Logo](public/giga-talentos-logo.svg)

## Discover Brazil's Rising Entrepreneurs

Giga Talentos is a dynamic platform connecting talented Brazilian entrepreneurs with mentors and opportunities in innovation and business. We empower emerging entrepreneurs, innovators, and creators by providing them with visibility, resources, and connections to mentors who can help transform their ideas into successful ventures.

## ✨ Core Features

### Discover
- Browse talent across key dimensions: Cognitive & Technical Ability, Creativity & Innovation, Leadership & Collaboration, and more
- Watch high-quality project presentations, pitch videos, and innovation showcases from Brazilian entrepreneurs
- Explore featured channels and trending startup content
- Advanced search functionality to find specific talent profiles or project types

### Showcase
- Create a professional profile highlighting your entrepreneurial journey and technical abilities
- Upload and manage videos of your pitches, project demos, and innovation presentations
- Build curated portfolios to organize your work and showcase your growth
- Gain followers and build your network within the entrepreneurship community

### Connect
- Network with other talented entrepreneurs and innovators
- Engage with mentors looking for high-potential youth to guide
- Receive feedback through comments and interactions on your projects
- Access opportunities for hackathons, incubators, and career advancement

## 🌍 User Experiences

### For Entrepreneurs (Talents)
- Tools to showcase your startup projects and technical innovations
- Opportunities to collaborate with other entrepreneurs on hackathon teams
- Access to mentorship and feedback from experienced business leaders
- Platform to demonstrate your problem-solving abilities and creative solutions

### For Mentors
- Discover high-potential youth with exceptional cognitive and technical abilities
- Direct messaging with promising entrepreneurs showing innovation and leadership
- Custom filtering to find talents by specific dimensions (creativity, resilience, social consciousness)
- Opportunity to guide the next generation of ethical innovators and changemakers

### For Community Members
- Endless stream of fresh startup pitches and innovation showcases
- Community participation through comments and project feedback
- Save favorites and create custom collections of inspiring projects
- Follow entrepreneurs and teams for regular updates on their ventures

## 💻 Technology

Built with modern technologies to ensure a smooth, responsive experience for entrepreneurs and mentors:

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes with MongoDB integration
- **Data**: MongoDB database for scalable talent profiles and project data
- **Media**: Optimized video streaming for pitch presentations and project demos
- **Security**: Robust authentication with NextAuth.js
- **Deployment**: Continuous deployment through Vercel

## 🛠️ Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- MongoDB atlas account or local mongoDB 
- Vercel account (recommended for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/GigaTalentos.git
   cd GigaTalentos
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your MONGODB_URI,NEXTAUTH_SECRET and NEXTAUTH_URL

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🤝 Contributing

We welcome contributions from developers passionate about supporting Brazilian entrepreneurship and talent development. Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all the talented entrepreneurs and innovators who inspire this platform
- Special appreciation to our mentors and supporters from the Brazilian startup ecosystem
- Built with love for Brazil's entrepreneurial future