#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'data', 'backups');
const SEED_DIR = path.join(__dirname, '..', 'data', 'seed');

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createBackup() {
  console.log('🔄 Creating backup of current seed data...');
  
  ensureDirectoryExists(BACKUP_DIR);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFolder = path.join(BACKUP_DIR, `backup-${timestamp}`);
  
  ensureDirectoryExists(backupFolder);
  
  const seedFiles = fs.readdirSync(SEED_DIR).filter(file => file.endsWith('.json'));
  
  for (const file of seedFiles) {
    const sourcePath = path.join(SEED_DIR, file);
    const backupPath = path.join(backupFolder, file);
    
    fs.copyFileSync(sourcePath, backupPath);
    console.log(`✅ Backed up ${file}`);
  }
  
  console.log(`📦 Backup created at: ${backupFolder}`);
  return backupFolder;
}

function listBackups() {
  console.log('📋 Available backups:');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('   No backups found.');
    return;
  }
  
  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(item => fs.statSync(path.join(BACKUP_DIR, item)).isDirectory())
    .sort()
    .reverse();
  
  if (backups.length === 0) {
    console.log('   No backups found.');
    return;
  }
  
  backups.forEach((backup, index) => {
    const backupPath = path.join(BACKUP_DIR, backup);
    const stats = fs.statSync(backupPath);
    const date = stats.mtime.toLocaleDateString();
    const time = stats.mtime.toLocaleTimeString();
    
    console.log(`   ${index + 1}. ${backup} (${date} ${time})`);
  });
}

function restoreBackup(backupName) {
  console.log(`🔄 Restoring backup: ${backupName}`);
  
  const backupPath = path.join(BACKUP_DIR, backupName);
  
  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Backup not found: ${backupName}`);
    return false;
  }
  
  // Create backup of current state before restoring
  const currentBackup = createBackup();
  console.log(`📦 Current state backed up to: ${path.basename(currentBackup)}`);
  
  // Restore files
  const backupFiles = fs.readdirSync(backupPath).filter(file => file.endsWith('.json'));
  
  for (const file of backupFiles) {
    const backupFilePath = path.join(backupPath, file);
    const seedFilePath = path.join(SEED_DIR, file);
    
    fs.copyFileSync(backupFilePath, seedFilePath);
    console.log(`✅ Restored ${file}`);
  }
  
  console.log(`✅ Backup restored successfully: ${backupName}`);
  return true;
}

function generateSampleData() {
  console.log('🎯 Generating sample data templates...');
  
  const sampleDir = path.join(__dirname, '..', 'data', 'samples');
  ensureDirectoryExists(sampleDir);
  
  // Create sample project template
  const sampleProject = {
    title: "Sample Project - Replace with your own",
    description: "This is a sample project template. Replace with your own project description.",
    category: "Habilidade Cognitiva & Técnica",
    technologies: ["React", "Node.js", "MongoDB"],
    demo_url: "https://your-demo-url.com",
    repository_url: "https://github.com/your-username/your-repo",
    image: "/projects/your-project-image.svg"
  };
  
  // Create sample user
  const sampleUser = {
    name: "Sample User",
    email: "sample@example.com",
    password: "password123",
    avatar: "/placeholder-user.jpg",
    account_type: "talent",
    bio: "Sample user biography. Replace with actual bio.",
    location: "Your City, State",
    portfolio: "https://your-portfolio.com",
    experience: "Intermediário",
    skills: ["Skill 1", "Skill 2", "Skill 3"]
  };
  
  // Create sample challenge
  const sampleChallenge = {
    title: "Sample Challenge Title",
    description: "Sample challenge description. Replace with actual challenge details.",
    difficulty: "Intermediário",
    duration: "4 semanas",
    category: "Habilidade Cognitiva & Técnica",
    prizes: [
      {
        position: "1º Lugar",
        description: "Sample prize description",
        value: "R$ 10.000"
      }
    ],
    requirements: [
      "Sample requirement 1",
      "Sample requirement 2",
      "Sample requirement 3"
    ]
  };
  
  // Write sample files
  fs.writeFileSync(
    path.join(sampleDir, 'sample-project.json'),
    JSON.stringify(sampleProject, null, 2)
  );
  
  fs.writeFileSync(
    path.join(sampleDir, 'sample-user.json'),
    JSON.stringify(sampleUser, null, 2)
  );
  
  fs.writeFileSync(
    path.join(sampleDir, 'sample-challenge.json'),
    JSON.stringify(sampleChallenge, null, 2)
  );
  
  console.log(`✅ Sample templates created in: ${sampleDir}`);
  console.log('   Use these as templates for creating your own content.');
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'backup':
      createBackup();
      break;
      
    case 'list':
      listBackups();
      break;
      
    case 'restore':
      const backupName = args[1];
      if (!backupName) {
        console.error('❌ Please specify a backup name to restore.');
        listBackups();
        process.exit(1);
      }
      restoreBackup(backupName);
      break;
      
    case 'samples':
      generateSampleData();
      break;
      
    default:
      console.log('🔧 Seed Data Manager');
      console.log('');
      console.log('Usage:');
      console.log('  node scripts/seed-manager.js backup           - Create backup of current seed data');
      console.log('  node scripts/seed-manager.js list             - List available backups');
      console.log('  node scripts/seed-manager.js restore <name>   - Restore from backup');
      console.log('  node scripts/seed-manager.js samples          - Generate sample data templates');
      console.log('');
      console.log('Examples:');
      console.log('  node scripts/seed-manager.js backup');
      console.log('  node scripts/seed-manager.js restore backup-2025-07-18T10-30-45-123Z');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = { createBackup, listBackups, restoreBackup, generateSampleData };
