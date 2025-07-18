#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SEED_DIR = path.join(__dirname, '..', 'data', 'seed');

const FILES_TO_VALIDATE = [
  'categories.json',
  'users.json',
  'desafios.json',
  'project-templates.json',
  'admin-projects.json',
  'youtube-videos.json',
  'config.json'
];

function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    console.log(`✅ ${path.basename(filePath)} - Valid JSON`);
    return { valid: true, data };
  } catch (error) {
    console.error(`❌ ${path.basename(filePath)} - Invalid JSON:`, error.message);
    return { valid: false, error: error.message };
  }
}

function validateStructure(filename, data) {
  const validations = {
    'categories.json': (data) => {
      if (!Array.isArray(data)) return 'Must be an array';
      for (const item of data) {
        if (!item.name || !item.code || !item.description) {
          return 'Each category must have name, code, and description';
        }
      }
      return null;
    },
    'users.json': (data) => {
      if (!data.admin || !data.fans || !data.talents || !data.mentors || !data.sponsors) {
        return 'Must have admin, fans, talents, mentors, and sponsors arrays';
      }
      const allUsers = [...data.admin, ...data.fans, ...data.talents, ...data.mentors, ...data.sponsors];
      for (const user of allUsers) {
        if (!user.name || !user.email || !user.account_type) {
          return 'Each user must have name, email, and account_type';
        }
      }
      return null;
    },
    'desafios.json': (data) => {
      if (!Array.isArray(data)) return 'Must be an array';
      for (const item of data) {
        if (!item.title || !item.description || !item.category || !item.creator || !item.start_date || !item.end_date) {
          return 'Each desafio must have title, description, category, creator, start_date, and end_date';
        }
        if (!item.creator.includes('@')) {
          return 'Creator must be a valid email address';
        }
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(item.start_date) || !dateRegex.test(item.end_date)) {
          return 'start_date and end_date must be in YYYY-MM-DD format';
        }
        // Validate end_date is after start_date
        if (new Date(item.end_date) <= new Date(item.start_date)) {
          return 'end_date must be after start_date';
        }
      }
      return null;
    },
    'project-templates.json': (data) => {
      if (!Array.isArray(data)) return 'Must be an array';
      for (const item of data) {
        if (!item.title || !item.description || !item.category || !Array.isArray(item.technologies)) {
          return 'Each template must have title, description, category, and technologies array';
        }
      }
      return null;
    },
    'admin-projects.json': (data) => {
      if (!Array.isArray(data)) return 'Must be an array';
      for (const item of data) {
        if (!item.nome || !item.descricao || !item.categoria) {
          return 'Each admin project must have nome, descricao, and categoria';
        }
      }
      return null;
    },
    'youtube-videos.json': (data) => {
      if (!Array.isArray(data)) return 'Must be an array';
      for (const item of data) {
        if (!item.youtube_id || !item.title || !item.category_name) {
          return 'Each video must have youtube_id, title, and category_name';
        }
      }
      return null;
    },
    'config.json': (data) => {
      if (!data.database || !data.generation || !data.demo || !data.files) {
        return 'Must have database, generation, demo, and files sections';
      }
      return null;
    }
  };

  const validator = validations[filename];
  if (!validator) return null;

  const error = validator(data);
  if (error) {
    console.error(`❌ ${filename} - Structure validation failed: ${error}`);
    return false;
  } else {
    console.log(`✅ ${filename} - Structure validation passed`);
    return true;
  }
}

function main() {
  console.log('🔍 Validating seed data files...\n');
  
  let allValid = true;
  const results = {};

  for (const filename of FILES_TO_VALIDATE) {
    const filePath = path.join(SEED_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ ${filename} - File not found`);
      allValid = false;
      continue;
    }

    const { valid, data, error } = validateJSON(filePath);
    if (!valid) {
      allValid = false;
      continue;
    }

    const structureValid = validateStructure(filename, data);
    if (structureValid === false) {
      allValid = false;
    }

    results[filename] = { valid: valid && structureValid !== false, data };
  }

  console.log('\n📊 Validation Summary:');
  console.log('═'.repeat(50));
  
  for (const [filename, result] of Object.entries(results)) {
    console.log(`${result.valid ? '✅' : '❌'} ${filename}`);
  }

  if (allValid) {
    console.log('\n🎉 All files are valid! Ready for seeding.');
    
    // Show some statistics
    const stats = {
      categories: results['categories.json']?.data?.length || 0,
      users: results['users.json']?.data ? 
        Object.values(results['users.json'].data).reduce((sum, arr) => sum + arr.length, 0) : 0,
      desafios: results['desafios.json']?.data?.length || 0,
      projectTemplates: results['project-templates.json']?.data?.length || 0,
      adminProjects: results['admin-projects.json']?.data?.length || 0,
      youtubeVideos: results['youtube-videos.json']?.data?.length || 0
    };

    console.log('\n📈 Data Summary:');
    console.log(`   Categories: ${stats.categories}`);
    console.log(`   Users: ${stats.users}`);
    console.log(`   Desafios: ${stats.desafios}`);
    console.log(`   Project Templates: ${stats.projectTemplates}`);
    console.log(`   Admin Projects: ${stats.adminProjects}`);
    console.log(`   YouTube Videos: ${stats.youtubeVideos}`);
    
    process.exit(0);
  } else {
    console.log('\n❌ Some files have validation errors. Please fix them before seeding.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateJSON, validateStructure };
