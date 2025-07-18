# Structured Seed Data System

This directory contains a reorganized seed data system that separates large content lists into structured JSON files, making it easier to customize and maintain seed data without diving into code.

## Directory Structure

```
data/
└── seed/
    ├── categories.json          # Platform categories
    ├── users.json              # User profiles by type
    ├── desafios.json           # Challenge definitions
    ├── project-templates.json  # Project templates
    ├── admin-projects.json     # Admin-specific projects
    ├── youtube-videos.json     # YouTube video data
    └── config.json             # Seed configuration
```

## Usage

### Using the Structured Seed System

1. **API Endpoint**: `/api/seed-structured`
2. **Method**: POST
3. **Description**: Seeds the database using structured JSON files

### Customizing Seed Data

#### 1. Categories (`categories.json`)
Add or modify platform categories:

```json
{
  "name": "Your Category Name",
  "code": "CATEGORY_CODE",
  "description": "Category description",
  "thumbnail": "/path/to/thumbnail.jpg"
}
```

#### 2. Users (`users.json`)
Organize users by type (admin, fans, talents, mentors, sponsors):

```json
{
  "talents": [
    {
      "name": "User Name",
      "email": "user@example.com",
      "password": "password123",
      "account_type": "talent",
      "bio": "User biography",
      "location": "City, State",
      "skills": ["Skill1", "Skill2"]
    }
  ]
}
```

#### 3. Challenges (`desafios.json`)
Define challenges with prizes and requirements:

```json
{
  "title": "Challenge Title",
  "description": "Challenge description",
  "difficulty": "Intermediário",
  "duration": "4 semanas",
  "category": "Category Name",
  "prizes": [
    {
      "position": "1º Lugar",
      "description": "Prize description",
      "value": "R$ 10.000"
    }
  ],
  "requirements": ["Requirement 1", "Requirement 2"]
}
```

#### 4. Project Templates (`project-templates.json`)
Define project templates that will be used to generate sample projects:

```json
{
  "title": "Project Title",
  "description": "Project description",
  "category": "Category Name",
  "technologies": ["Tech1", "Tech2"],
  "demo_url": "https://demo.example.com",
  "repository_url": "https://github.com/user/repo",
  "image": "/path/to/image.svg"
}
```

#### 5. Admin Projects (`admin-projects.json`)
Special projects created by admin users:

```json
{
  "nome": "Admin Project Name",
  "descricao": "Project description",
  "objetivo": "Project objective",
  "categoria": "Category Name",
  "tecnologias": ["Tech1", "Tech2"],
  "status": "ativo",
  "lideranca_status": "ativo",
  "verificado": true
}
```

#### 6. YouTube Videos (`youtube-videos.json`)
Real YouTube videos to be included:

```json
{
  "youtube_id": "VIDEO_ID",
  "title": "Video Title",
  "description": "Video description",
  "channel_name": "Channel Name",
  "category_name": "Category Name",
  "featured": true,
  "tags": ["tag1", "tag2"],
  "duration": "15:32"
}
```

#### 7. Configuration (`config.json`)
Adjust seed behavior and settings:

```json
{
  "database": {
    "clearExisting": true,
    "timeout": {
      "categoryCreation": 10000,
      "userCreation": 15000
    }
  },
  "generation": {
    "maxParticipantsPerProject": 6,
    "projectLeadershipChance": {
      "hasLeader": 0.4,
      "pendingRequest": 0.3,
      "lookingForLeader": 0.3
    }
  },
  "demo": {
    "createDemoContent": true,
    "realYouTubeVideos": true,
    "generateInteractions": true
  }
}
```

## Key Features

### 1. **Separation of Concerns**
- Content data is separated from logic
- Easy to modify without touching code
- Version control friendly

### 2. **Flexible Configuration**
- Adjust generation parameters
- Enable/disable features
- Set timeouts and limits

### 3. **Type Safety**
- TypeScript interfaces for all data structures
- Validation and error handling
- IDE autocomplete support

### 4. **Realistic Data Generation**
- Metrics based on deterministic algorithms
- Randomized but consistent results
- Configurable generation parameters

### 5. **Modular Structure**
- Each data type in its own file
- Easy to extend with new data types
- Clean separation of admin vs user data

## Benefits

### For Developers
- **Faster Development**: No need to modify complex seed scripts
- **Better Maintainability**: Clear separation of data and logic
- **Type Safety**: Full TypeScript support with interfaces
- **Flexible Testing**: Easy to create different data sets

### For Content Managers
- **Easy Customization**: Edit JSON files directly
- **No Code Required**: Modify content without programming
- **Version Control**: Track changes to seed data
- **Validation**: Clear structure prevents errors

### For Deployment
- **Environment-Specific**: Different data sets for different environments
- **Reproducible**: Consistent results across deployments
- **Scalable**: Easy to add more content types
- **Configurable**: Adjust behavior without code changes

## Migration from Old System

1. **Replace API Call**: Change from `/api/seed-complete` to `/api/seed-structured`
2. **Update Content**: Modify JSON files instead of code
3. **Configure Behavior**: Adjust `config.json` for your needs
4. **Test Changes**: Run seed to verify everything works

## Example Usage

```bash
# Seed database with structured data
curl -X POST http://localhost:3000/api/seed-structured

# Or use the frontend interface
# Navigate to the admin panel and click "Seed Database"
```

## Future Enhancements

- **CSV Support**: Import/export data as CSV
- **Database Backup**: Export existing data to JSON
- **Validation Schema**: JSON schema validation
- **Migration Tools**: Convert between formats
- **Dynamic Loading**: Load data from external sources

This structured approach makes the seed system more maintainable, flexible, and user-friendly while preserving all the functionality of the original system.
