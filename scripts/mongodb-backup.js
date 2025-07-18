#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BACKUP_DIR = path.join(__dirname, '..', 'data', 'backups', 'mongodb');
const DB_NAME = process.env.DB_NAME || 'giga-talentos';
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function createTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function backupDatabase() {
  const timestamp = createTimestamp();
  const backupPath = path.join(BACKUP_DIR, `mongodb-backup-${timestamp}`);
  
  console.log('🗄️ Creating MongoDB backup...');
  console.log(`Database: ${DB_NAME}`);
  console.log(`Backup location: ${backupPath}`);
  
  // Use mongodump to create backup
  const mongodumpCmd = `mongodump --uri="${MONGO_URI}" --db="${DB_NAME}" --out="${backupPath}"`;
  
  return new Promise((resolve, reject) => {
    exec(mongodumpCmd, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ MongoDB backup failed:', error.message);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.warn('⚠️ MongoDB backup warnings:', stderr);
      }
      
      console.log('✅ MongoDB backup completed successfully!');
      console.log(`📁 Backup saved to: ${backupPath}`);
      
      // Save backup info
      const backupInfo = {
        timestamp,
        path: backupPath,
        database: DB_NAME,
        mongoUri: MONGO_URI.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
        collections: [], // Will be populated by analyzing the backup
        size: 0
      };
      
      // Get backup size
      try {
        const stats = fs.statSync(backupPath);
        backupInfo.size = stats.size;
      } catch (e) {
        console.warn('Could not get backup size:', e.message);
      }
      
      // List collections in backup
      try {
        const dbBackupPath = path.join(backupPath, DB_NAME);
        if (fs.existsSync(dbBackupPath)) {
          const files = fs.readdirSync(dbBackupPath);
          backupInfo.collections = files
            .filter(file => file.endsWith('.bson'))
            .map(file => file.replace('.bson', ''));
        }
      } catch (e) {
        console.warn('Could not list collections:', e.message);
      }
      
      // Save backup metadata
      const metadataPath = path.join(backupPath, 'backup-info.json');
      fs.writeFileSync(metadataPath, JSON.stringify(backupInfo, null, 2));
      
      resolve(backupInfo);
    });
  });
}

function restoreDatabase(backupPath) {
  console.log('🔄 Restoring MongoDB from backup...');
  console.log(`Backup location: ${backupPath}`);
  
  // Use mongorestore to restore backup
  const mongorestoreCmd = `mongorestore --uri="${MONGO_URI}" --db="${DB_NAME}" --drop "${path.join(backupPath, DB_NAME)}"`;
  
  return new Promise((resolve, reject) => {
    exec(mongorestoreCmd, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ MongoDB restore failed:', error.message);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.warn('⚠️ MongoDB restore warnings:', stderr);
      }
      
      console.log('✅ MongoDB restore completed successfully!');
      resolve();
    });
  });
}

function listBackups() {
  console.log('📋 Available MongoDB backups:');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('No backups found.');
    return [];
  }
  
  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(dir => dir.startsWith('mongodb-backup-'))
    .map(dir => {
      const backupPath = path.join(BACKUP_DIR, dir);
      const metadataPath = path.join(backupPath, 'backup-info.json');
      
      let metadata = {
        timestamp: dir.replace('mongodb-backup-', ''),
        path: backupPath,
        database: DB_NAME,
        collections: [],
        size: 0
      };
      
      // Try to read metadata
      try {
        if (fs.existsSync(metadataPath)) {
          metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        }
      } catch (e) {
        console.warn(`Could not read metadata for ${dir}:`, e.message);
      }
      
      return metadata;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  if (backups.length === 0) {
    console.log('No backups found.');
    return [];
  }
  
  console.log('═'.repeat(80));
  backups.forEach((backup, index) => {
    const date = new Date(backup.timestamp.replace(/-/g, ':')).toLocaleString();
    const size = backup.size > 0 ? `${(backup.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown';
    const collections = backup.collections.length > 0 ? backup.collections.join(', ') : 'Unknown';
    
    console.log(`${index + 1}. ${path.basename(backup.path)}`);
    console.log(`   📅 Created: ${date}`);
    console.log(`   💾 Size: ${size}`);
    console.log(`   📊 Collections: ${collections}`);
    console.log(`   📁 Path: ${backup.path}`);
    console.log('');
  });
  
  return backups;
}

function deleteBackup(backupName) {
  const backupPath = path.join(BACKUP_DIR, backupName);
  
  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Backup not found: ${backupName}`);
    return false;
  }
  
  try {
    fs.rmSync(backupPath, { recursive: true, force: true });
    console.log(`✅ Deleted backup: ${backupName}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to delete backup: ${error.message}`);
    return false;
  }
}

async function main() {
  const command = process.argv[2];
  const argument = process.argv[3];
  
  if (!command) {
    console.log('🗄️ MongoDB Backup Manager');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/mongodb-backup.js backup                    - Create database backup');
    console.log('  node scripts/mongodb-backup.js list                      - List available backups');
    console.log('  node scripts/mongodb-backup.js restore <backup-name>     - Restore from backup');
    console.log('  node scripts/mongodb-backup.js delete <backup-name>      - Delete a backup');
    console.log('');
    console.log('Environment Variables:');
    console.log(`  MONGODB_URI: ${MONGO_URI}`);
    console.log(`  DB_NAME: ${DB_NAME}`);
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/mongodb-backup.js backup');
    console.log('  node scripts/mongodb-backup.js restore mongodb-backup-2025-07-18T15-30-45-123Z');
    return;
  }
  
  try {
    switch (command) {
      case 'backup':
        const backupInfo = await backupDatabase();
        console.log('');
        console.log('📊 Backup Summary:');
        console.log(`   Collections: ${backupInfo.collections.join(', ')}`);
        console.log(`   Size: ${(backupInfo.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Path: ${backupInfo.path}`);
        break;
        
      case 'list':
        listBackups();
        break;
        
      case 'restore':
        if (!argument) {
          console.error('❌ Please provide backup name to restore');
          console.log('Run "node scripts/mongodb-backup.js list" to see available backups');
          process.exit(1);
        }
        
        const backupPath = path.join(BACKUP_DIR, argument);
        if (!fs.existsSync(backupPath)) {
          console.error(`❌ Backup not found: ${argument}`);
          process.exit(1);
        }
        
        await restoreDatabase(backupPath);
        break;
        
      case 'delete':
        if (!argument) {
          console.error('❌ Please provide backup name to delete');
          process.exit(1);
        }
        
        deleteBackup(argument);
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('Run "node scripts/mongodb-backup.js" for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  backupDatabase,
  restoreDatabase,
  listBackups,
  deleteBackup
};
