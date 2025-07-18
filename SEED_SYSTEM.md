# GigaTalentos Structured Seed System

## Overview

This document describes the complete structured seed system for GigaTalentos, which separates large content lists into organized JSON files to make customization easier without requiring code changes.

## Quick Start

1. **Validate existing data**: `npm run seed:validate`
2. **Create a backup**: `npm run seed:backup`
3. **Customize JSON files** in `data/seed/` directory
4. **Validate changes**: `npm run seed:validate`
5. **Seed database**: Call `/api/seed-structured` endpoint

## System Architecture

### File Structure
```
data/
├── seed/
│   ├── categories.json          # Platform categories
│   ├── users.json              # User profiles organized by type
│   ├── desafios.json           # Challenge definitions
│   ├── project-templates.json  # Project templates
│   ├── admin-projects.json     # Admin-specific projects
│   ├── youtube-videos.json     # YouTube video data
│   ├── config.json             # Seed configuration
│   └── README.md               # Detailed documentation
├── backups/                    # Automatic backups
│   └── backup-YYYY-MM-DD.../   # Timestamped backups
└── samples/                    # Sample templates
    ├── sample-project.json
    ├── sample-user.json
    └── sample-challenge.json
```

### Core Components

1. **Data Loader** (`lib/seed-data-loader.ts`)
   - Loads and validates JSON files
   - Provides TypeScript interfaces
   - Handles file system operations

2. **Data Generator** (`lib/seed-data-generator.ts`)
   - Generates realistic metrics and relationships
   - Configurable randomization
   - Consistent but varied data

3. **Structured Seed API** (`app/api/seed-structured/route.ts`)
   - Uses structured data instead of hardcoded content
   - Maintains all original functionality
   - Improved error handling and timeouts

## Available Scripts

### Validation
```bash
npm run seed:validate        # Validate all JSON files
```

### Backup & Restore
```bash
npm run seed:backup          # Create backup of current data
npm run seed:manager list    # List available backups
npm run seed:restore         # Restore from backup (requires backup name)
```

### Sample Generation
```bash
npm run seed:samples         # Generate sample templates
```

### Management
```bash
npm run seed:manager         # Show all available commands
```

## Data Customization Guide

### 1. Categories (`categories.json`)

Categories define the main skill areas for the platform:

```json
{
  "name": "Your Category Name",
  "code": "CATEGORY_CODE",
  "description": "Category description explaining the skill area",
  "thumbnail": "/path/to/category-thumbnail.jpg"
}
```

**Required fields**: `name`, `code`, `description`, `thumbnail`

### 2. Users (`users.json`)

Users are organized by account type:

```json
{
  "admin": [...],
  "fans": [...],
  "talents": [...],
  "mentors": [...],
  "sponsors": [...]
}
```

**User object structure**:
```json
{
  "name": "Full Name",
  "email": "email@example.com",
  "password": "plaintext-password",
  "avatar": "/path/to/avatar.jpg",
  "account_type": "talent",
  "bio": "User biography and background",
  "location": "City, State",
  "portfolio": "https://portfolio-url.com",
  "experience": "Iniciante|Intermediário|Avançado|Expert",
  "skills": ["Skill 1", "Skill 2"],
  "verified": true
}
```

**Required fields**: `name`, `email`, `password`, `account_type`, `bio`, `location`, `experience`

### 3. Challenges (`desafios.json`)

Challenges define competitions and learning opportunities:

```json
{
  "title": "Challenge Title",
  "description": "Detailed challenge description",
  "difficulty": "Iniciante|Intermediário|Avançado",
  "duration": "4 semanas",
  "category": "Category Name (must match categories.json)",
  "prizes": [
    {
      "position": "1º Lugar",
      "description": "Prize description",
      "value": "R$ 10.000"
    }
  ],
  "requirements": [
    "Requirement 1",
    "Requirement 2"
  ]
}
```

**Required fields**: `title`, `description`, `difficulty`, `duration`, `category`, `prizes`, `requirements`

### 4. Project Templates (`project-templates.json`)

Templates for generating sample projects:

```json
{
  "title": "Project Title",
  "description": "Project description",
  "category": "Category Name (must match categories.json)",
  "technologies": ["Tech1", "Tech2", "Tech3"],
  "demo_url": "https://demo-url.com",
  "repository_url": "https://github.com/user/repo",
  "image": "/path/to/project-image.svg"
}
```

**Required fields**: `title`, `description`, `category`, `technologies`, `demo_url`, `repository_url`, `image`

### 5. Admin Projects (`admin-projects.json`)

Special projects created by admin users:

```json
{
  "nome": "Admin Project Name",
  "descricao": "Detailed project description",
  "objetivo": "Project objective and goals",
  "categoria": "Category Name (must match categories.json)",
  "video_apresentacao": "https://video-url.com",
  "status": "ativo|concluido|pausado",
  "lideranca_status": "ativo|buscando_lider",
  "avatar": "/path/to/project-avatar.svg",
  "imagem_capa": "/path/to/project-cover.svg",
  "tecnologias": ["Tech1", "Tech2"],
  "repositorio_url": "https://github.com/user/repo",
  "demo_url": "https://demo-url.com",
  "verificado": true,
  "demo": false
}
```

### 6. YouTube Videos (`youtube-videos.json`)

Real YouTube videos to include in the platform:

```json
{
  "youtube_id": "VIDEO_ID_FROM_URL",
  "title": "Video Title",
  "description": "Video description",
  "channel_name": "YouTube Channel Name",
  "category_name": "Category Name (must match categories.json)",
  "featured": true,
  "tags": ["tag1", "tag2", "tag3"],
  "duration": "15:32"
}
```

**Required fields**: `youtube_id`, `title`, `description`, `channel_name`, `category_name`, `featured`, `tags`, `duration`

### 7. Configuration (`config.json`)

Controls seed behavior and generation parameters:

```json
{
  "database": {
    "clearExisting": true,
    "timeout": {
      "categoryCreation": 10000,
      "userCreation": 15000,
      "desafioCreation": 30000,
      "projectCreation": 25000,
      "videoCreation": 20000
    }
  },
  "generation": {
    "maxParticipantsPerProject": 6,
    "projectLeadershipChance": {
      "hasLeader": 0.4,
      "pendingRequest": 0.3,
      "lookingForLeader": 0.3
    },
    "videoMetrics": {
      "minViews": 15000,
      "maxViews": 65000,
      "likeRateMin": 0.02,
      "likeRateMax": 0.12
    }
  },
  "demo": {
    "createDemoContent": true,
    "realYouTubeVideos": true,
    "generateInteractions": true
  }
}
```

## Best Practices

### 1. Data Consistency
- Always validate JSON files before seeding
- Use consistent category names across all files
- Maintain referential integrity between files

### 2. Backup Strategy
- Create backups before major changes
- Use descriptive backup names
- Test restore functionality regularly

### 3. Content Quality
- Use realistic and relevant data
- Ensure proper Portuguese localization
- Include diverse user profiles and projects

### 4. Performance Considerations
- Adjust timeout values based on data size
- Monitor generation parameters for balance
- Consider database performance with large datasets

## Migration from Legacy System

### Step 1: Backup Current Data
```bash
npm run seed:backup
```

### Step 2: Validate New Structure
```bash
npm run seed:validate
```

### Step 3: Test New System
- Use `/api/seed-structured` endpoint
- Verify all data is correctly generated
- Test application functionality

### Step 4: Update Applications
- Change API calls from `/api/seed-complete` to `/api/seed-structured`
- Update any hardcoded references
- Test all seed-related functionality

## Troubleshooting

### Common Issues

1. **JSON Validation Errors**
   - Check for missing commas, quotes, or brackets
   - Use JSON validation tools
   - Run `npm run seed:validate` for detailed errors

2. **Category Mismatch**
   - Ensure category names match exactly between files
   - Check for typos or extra spaces
   - Verify category codes are unique

3. **Large Dataset Performance**
   - Increase timeout values in config.json
   - Reduce data size for testing
   - Check database connection stability

4. **TypeScript Errors**
   - Ensure all required fields are present
   - Check data types match interfaces
   - Verify array structures are correct

### Getting Help

- Check the detailed README in `data/seed/README.md`
- Review sample files in `data/samples/`
- Run validation scripts for specific error messages
- Create GitHub issues for bugs or feature requests

## Future Enhancements

- [ ] CSV import/export functionality
- [ ] Web-based data editor
- [ ] Advanced validation rules
- [ ] Multi-language support
- [ ] Database schema migration tools
- [ ] Performance optimization
- [ ] Automated testing integration

## Contributing

When adding new seed data:

1. Follow the established JSON structure
2. Add validation rules for new fields
3. Update TypeScript interfaces
4. Include sample data in documentation
5. Test thoroughly before submitting

## License

This seed system is part of the GigaTalentos project and follows the same licensing terms.
