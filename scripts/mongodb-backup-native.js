#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const mongoose = require('mongoose');

// Configuration
const BACKUP_DIR = path.join(__dirname, '..', 'data', 'backups', 'mongodb');
const DB_NAME = process.env.DB_NAME || 'gigatalentos';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gigatalentos';

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function createTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

// Collection names in the GigaTalentos database
const COLLECTIONS = [
  'categories',
  'users',
  'channels',
  'desafios',
  'projetos',
  'videos',
  'playlists',
  'likes',
  'favorites',
  'projectfavorites',
  'subscriptions',
  'comments',
  'messages',
  'participationrequests',
  'videowatches'
];

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📡 Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    return false;
  }
}

async function backupCollection(collectionName) {
  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const documents = await collection.find({}).toArray();
    
    console.log(`   📋 ${collectionName}: ${documents.length} documents`);
    
    return {
      name: collectionName,
      count: documents.length,
      data: documents
    };
  } catch (error) {
    console.warn(`   ⚠️ ${collectionName}: ${error.message}`);
    return {
      name: collectionName,
      count: 0,
      data: [],
      error: error.message
    };
  }
}

async function backupDatabase() {
  const timestamp = createTimestamp();
  const backupPath = path.join(BACKUP_DIR, `mongodb-backup-${timestamp}`);
  
  console.log('🗄️ Creating MongoDB backup using Node.js...');
  console.log(`Database: ${DB_NAME}`);
  console.log(`Backup location: ${backupPath}`);
  console.log('');
  
  // Create backup directory
  fs.mkdirSync(backupPath, { recursive: true });
  
  // Connect to database
  const connected = await connectToDatabase();
  if (!connected) {
    throw new Error('Could not connect to MongoDB');
  }
  
  try {
    console.log('📊 Backing up collections:');
    
    const backupData = {
      timestamp,
      database: DB_NAME,
      mongoUri: MONGODB_URI.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
      collections: [],
      totalDocuments: 0,
      createdAt: new Date().toISOString()
    };
    
    // Backup each collection
    for (const collectionName of COLLECTIONS) {
      const collectionBackup = await backupCollection(collectionName);
      backupData.collections.push(collectionBackup);
      backupData.totalDocuments += collectionBackup.count;
      
      // Save collection data to separate file
      const collectionFile = path.join(backupPath, `${collectionName}.json`);
      fs.writeFileSync(collectionFile, JSON.stringify(collectionBackup.data, null, 2));
    }
    
    // Save backup metadata
    const metadataFile = path.join(backupPath, 'backup-info.json');
    fs.writeFileSync(metadataFile, JSON.stringify(backupData, null, 2));
    
    console.log('');
    console.log('✅ MongoDB backup completed successfully!');
    console.log(`📁 Backup saved to: ${backupPath}`);
    console.log(`📊 Total documents: ${backupData.totalDocuments}`);
    
    return backupData;
    
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
}

async function restoreDatabase(backupPath) {
  console.log('🔄 Restoring MongoDB from backup...');
  console.log(`Backup location: ${backupPath}`);
  
  // Check if backup exists
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup not found: ${backupPath}`);
  }
  
  // Read backup metadata
  const metadataFile = path.join(backupPath, 'backup-info.json');
  if (!fs.existsSync(metadataFile)) {
    throw new Error('Backup metadata not found');
  }
  
  const backupData = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
  
  // Connect to database
  const connected = await connectToDatabase();
  if (!connected) {
    throw new Error('Could not connect to MongoDB');
  }
  
  try {
    console.log('🗑️ Clearing existing collections...');
    
    // Clear existing collections
    for (const collectionInfo of backupData.collections) {
      if (collectionInfo.count > 0) {
        try {
          const collection = mongoose.connection.db.collection(collectionInfo.name);
          await collection.deleteMany({});
          console.log(`   ✅ Cleared ${collectionInfo.name}`);
        } catch (error) {
          console.warn(`   ⚠️ Could not clear ${collectionInfo.name}: ${error.message}`);
        }
      }
    }
    
    console.log('');
    console.log('📥 Restoring collections:');
    
    let totalRestored = 0;
    
    // Restore each collection
    for (const collectionInfo of backupData.collections) {
      if (collectionInfo.count > 0) {
        try {
          const collectionFile = path.join(backupPath, `${collectionInfo.name}.json`);
          if (fs.existsSync(collectionFile)) {
            const documents = JSON.parse(fs.readFileSync(collectionFile, 'utf8'));
            
            if (documents.length > 0) {
              const collection = mongoose.connection.db.collection(collectionInfo.name);
              await collection.insertMany(documents);
              console.log(`   ✅ ${collectionInfo.name}: ${documents.length} documents restored`);
              totalRestored += documents.length;
            } else {
              console.log(`   📋 ${collectionInfo.name}: No documents to restore`);
            }
          } else {
            console.warn(`   ⚠️ ${collectionInfo.name}: Data file not found`);
          }
        } catch (error) {
          console.error(`   ❌ ${collectionInfo.name}: ${error.message}`);
        }
      } else {
        console.log(`   📋 ${collectionInfo.name}: No documents to restore`);
      }
    }
    
    console.log('');
    console.log('✅ MongoDB restore completed successfully!');
    console.log(`📊 Total documents restored: ${totalRestored}`);
    
    return { totalRestored, collections: backupData.collections.length };
    
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
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
        totalDocuments: 0
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
    const date = new Date(backup.createdAt || backup.timestamp.replace(/-/g, ':')).toLocaleString();
    const collections = backup.collections.map(c => `${c.name}(${c.count})`).join(', ');
    
    console.log(`${index + 1}. ${path.basename(backup.path)}`);
    console.log(`   📅 Created: ${date}`);
    console.log(`   📊 Total documents: ${backup.totalDocuments}`);
    console.log(`   📋 Collections: ${collections}`);
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
    console.log('🗄️ MongoDB Backup Manager (Node.js Version)');
    console.log('');
    console.log('This version uses Node.js and Mongoose instead of MongoDB tools.');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/mongodb-backup-native.js backup                    - Create database backup');
    console.log('  node scripts/mongodb-backup-native.js list                      - List available backups');
    console.log('  node scripts/mongodb-backup-native.js restore <backup-name>     - Restore from backup');
    console.log('  node scripts/mongodb-backup-native.js delete <backup-name>      - Delete a backup');
    console.log('');
    console.log('Environment Variables:');
    console.log(`  MONGODB_URI: ${MONGODB_URI}`);
    console.log(`  DB_NAME: ${DB_NAME}`);
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/mongodb-backup-native.js backup');
    console.log('  node scripts/mongodb-backup-native.js restore mongodb-backup-2025-07-18T15-30-45-123Z');
    console.log('');
    console.log('💡 Note: This script requires an active MongoDB connection.');
    return;
  }
  
  try {
    switch (command) {
      case 'backup':
        const backupInfo = await backupDatabase();
        console.log('');
        console.log('📊 Backup Summary:');
        console.log(`   Collections: ${backupInfo.collections.length}`);
        console.log(`   Total Documents: ${backupInfo.totalDocuments}`);
        console.log(`   Path: ${backupInfo.path || 'N/A'}`);
        break;
        
      case 'list':
        listBackups();
        break;
        
      case 'restore':
        if (!argument) {
          console.error('❌ Please provide backup name to restore');
          console.log('Run "node scripts/mongodb-backup-native.js list" to see available backups');
          process.exit(1);
        }
        
        const backupPath = path.join(BACKUP_DIR, argument);
        if (!fs.existsSync(backupPath)) {
          console.error(`❌ Backup not found: ${argument}`);
          process.exit(1);
        }
        
        const restoreResult = await restoreDatabase(backupPath);
        console.log('');
        console.log('📊 Restore Summary:');
        console.log(`   Collections: ${restoreResult.collections}`);
        console.log(`   Total Documents: ${restoreResult.totalRestored}`);
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
        console.log('Run "node scripts/mongodb-backup-native.js" for usage information');
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
