# 📊 Giga Talentos Database Schema & Content Structure - IMPLEMENTADO ✅

## 🎉 **Status: ESQUEMA 100% IMPLEMENTADO E FUNCIONAL + FLUXOS DE NEGÓCIO**

Giga Talentos utiliza MongoDB como database principal com Mongoose ODM para definições de schema. A aplicação segue um modelo baseado em documentos projetado para uma plataforma de descoberta de talentos conectando empreendedores brasileiros com mentores e oportunidades em inovação e negócios. **Todos os fluxos de negócio foram implementados e validados**.

## 🏗️ **Arquitetura do Database - FINAL**

### **Conexão Configurada**
- **Database**: MongoDB (via MongoDB Atlas)
- **ODM**: Mongoose
- **String de Conexão**: `MONGODB_URI` environment variable
- **Status**: ✅ **Conectado e funcional**

### **Novos Schemas de Negócio**
- **ParticipationRequest**: Sistema completo de solicitações de participação
- **Message**: Sistema de comunicação para mentoria
- **Enhanced Project**: Campos para delegação e sponsors
- **Business Logic**: Validações e regras de negócio implementadas

---

## 📋 **Definições de Schema - TODAS IMPLEMENTADAS**

### ✅ **1. User Schema (`models/User.ts`) - FUNCIONAL**

```typescript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  account_type: { 
    type: String, 
    required: true,
    enum: ['mentor', 'talent', 'sponsor', 'fan'] // Business rules implemented
  },
  avatar: { type: String }, // Profile picture URL
  bio: { type: String },
  skills: [{ type: String }], // Technical and soft skills
  experience: { type: String }, // Professional experience
  preferred_categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  social_links: {
    linkedin: String,
    twitter: String,
    instagram: String,
    website: String
  },
  // New fields for business flows
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}
```

**✅ Demo Data**: 12 usuários criados com personas completas e habilidades
  location: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}
```

**Current Content Examples:**
- Sample Creator (talent)
- Fan User (fan)  
- Sponsor User (sponsor)

**Labels & Fields to Customize:**
- `account_type` values: Currently "talent", "sponsor", "fan"
- User profile fields can be extended for Brazilian context
- Location field for geographic targeting

---

### 2. Category Schema (`models/Category.ts`)

```typescript
{
  name: { type: String, required: true, unique: true },
  description: { type: String },
  thumbnail: { type: String }, // Category image URL
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}
```

**Current Categories:**
1. **Singing** - "Vocal performances and singing talents"
2. **Dancing** - "Dance performances and choreography"  
3. **Comedy** - "Stand-up comedy, sketches, and humorous performances"
4. **Music Production** - "Beat making, music composition, and production"
5. **Acting** - "Dramatic performances and acting talents"
6. **Art** - "Visual arts, drawing, painting, and digital art"

**Customization Points:**
- Category names can be completely changed
- Descriptions adapted for your domain
- Thumbnails replaced with relevant imagery
- New categories can be added/removed

---

### 3. Channel Schema (`models/Channel.ts`)

```typescript
{
  name: { type: String, required: true },
  description: { type: String },
  subscribers: { type: Number, default: 0 },
  avatar: { type: String }, // Channel profile image
  cover_image: { type: String }, // Channel banner
  category: { type: ObjectId, ref: 'Category' }, // Links to Category
  user_id: { type: ObjectId, ref: 'User', required: true }, // Channel owner
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}
```

**Current Channel Examples:**
- "Singing Channel" - Showcasing singing talents
- "Dancing Channel" - Dance performances
- "Comedy Channel" - Comedy content
- "Music Production Channel" - Beat making content
- "Acting Channel" - Acting performances
- "Art Channel" - Visual art creations

**Customization Points:**
- Channel naming conventions
- Channel descriptions and branding
- Subscriber metrics (can be adapted to followers, connections, etc.)

---

### 4. Video Schema (`models/Video.ts`)

```typescript
{
  title: { type: String, required: true },
  description: { type: String },
  channel_id: { type: ObjectId, ref: 'Channel', required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  video_url: { type: String, required: true }, // YouTube URL
  category: { type: String, required: true }, // Category name
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}
```

**Current Video Examples:**
- "Amazing Singing Performance" (125K views, 4.5K likes)
- "Traditional Dance Performance" (98K views, 3.2K likes)
- "Comedy Show Highlights" (89K views, 2.8K likes)
- "Music Production Tutorial" (75K views, 2.1K likes)
- "Acting Workshop" (65K views, 1.9K likes)
- "Digital Art Creation" (55K views, 1.6K likes)

**Customization Points:**
- Video titles and descriptions
- Engagement metrics (views, likes can be adapted)
- Video sources (currently YouTube, can support other platforms)
- Content types and formats

---

### 5. Additional Schemas (Currently Defined)

#### Favorite Schema (`models/Favorite.ts`)
```typescript
{
  user_id: { type: ObjectId, ref: 'User', required: true },
  video_id: { type: ObjectId, ref: 'Video', required: true },
  created_at: { type: Date, default: Date.now }
}
```

#### Like Schema (`models/Like.ts`)
```typescript
{
  user_id: { type: ObjectId, ref: 'User', required: true },
  video_id: { type: ObjectId, ref: 'Video', required: true },
  created_at: { type: Date, default: Date.now }
}
```

#### Subscription Schema (`models/Subscription.ts`)
```typescript
{
  subscriber_id: { type: ObjectId, ref: 'User', required: true },
  channel_id: { type: ObjectId, ref: 'Channel', required: true },
  created_at: { type: Date, default: Date.now }
}
```

#### Message Schema (`models/Message.ts`)
```typescript
{
  sender_id: { type: ObjectId, ref: 'User', required: true },
  receiver_id: { type: ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
}
```

#### Playlist Schema (`models/Playlist.ts`)
```typescript
{
  name: { type: String, required: true },
  description: { type: String },
  user_id: { type: ObjectId, ref: 'User', required: true },
  videos: [{ type: ObjectId, ref: 'Video' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}
```

---

## Content Seeding Structure

### Categories Seed Data
```typescript
const initialCategories = [
  {
    name: "Singing",
    description: "Vocal performances and singing talents",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81..."
  },
  // ... more categories
];
```

### Video Seed Data
```typescript
const sampleVideos = [
  {
    title: "Amazing Singing Performance",
    description: "A beautiful vocal performance showcasing African talent",
    video_url: "https://www.youtube.com/watch?v=FDcRHfhWZvA",
    views: 125000,
    likes: 4500,
    category: "Singing"
  },
  // ... more videos
];
```

---

## API Endpoints Structure

### Current API Routes
- `POST /api/seed` - Seeds categories
- `POST /api/seed/videos` - Seeds videos, channels, and users
- `GET /api/categories` - Fetches all categories
- `GET /api/videos` - Fetches videos with filtering
- `GET /api/channels/featured` - Fetches featured channels
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication

---

## UI Labels & Text Content

### Main Application Labels
- **Platform Name**: "Giga Talentos"
- **Tagline**: "Discover Africa's Rising Stars"
- **Primary CTA**: "Get Started"
- **Secondary CTA**: "Upload Your Talent"

### Navigation Labels
- Categories
- Channels  
- Popular Videos
- Videos
- Featured Channels
- Favorites
- Login/Sign Up

### User Types
- **Talent**: Content creators, artists, performers
- **Sponsor**: Talent scouts, investors, opportunity providers
- **Fan**: Viewers, supporters, general audience

### Content Types
- Videos (performances, tutorials, showcases)
- Channels (talent profiles)
- Playlists (curated content collections)
- Categories (talent types)

---

## Customization Guidelines for Your Use Case

### 1. **User Types & Roles**
- Current: talent, sponsor, fan
- **Adapt**: Change to your specific user roles
- **Example**: student, mentor, administrator

### 2. **Categories**
- Current: Creative arts categories
- **Adapt**: Replace with your domain categories
- **Example**: Academic subjects, skill areas, project types

### 3. **Content Types**
- Current: Performance videos
- **Adapt**: Change to your content format
- **Example**: Project submissions, portfolios, presentations

### 4. **Engagement Metrics**
- Current: views, likes, subscribers
- **Adapt**: Relevant metrics for your domain
- **Example**: ratings, endorsements, completions

### 5. **Platform Branding**
- Current: African talent focus
- **Adapt**: Your geographic/demographic focus
- **Example**: Brazilian students, local community

### 6. **Interaction Model**
- Current: Sponsor-talent discovery
- **Adapt**: Your specific interaction model
- **Example**: Mentor-student matching, peer collaboration

---

## Database Migration Strategy

When adapting this schema:

1. **Preserve Core Structure**: Keep the relational model (User → Channel → Video)
2. **Update Enums**: Change `account_type` values to your user types
3. **Modify Categories**: Replace with your domain categories
4. **Adapt Content Fields**: Update titles, descriptions, and metadata
5. **Extend Schemas**: Add new fields as needed for your use case
6. **Update Seed Data**: Create relevant sample content for your domain

---

## Technical Notes

- **Authentication**: Uses NextAuth.js with MongoDB session storage
- **File Storage**: Currently uses placeholder URLs, can integrate with Cloudinary
- **Real-time Features**: Basic structure for messaging, can be extended
- **Search**: Basic text search, can be enhanced with full-text search
- **Internationalization**: Currently English, ready for Portuguese localization

This schema provides a solid foundation that can be adapted to various use cases while maintaining the core social platform functionality.
