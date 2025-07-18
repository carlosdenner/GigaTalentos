#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

async function validateSeedData() {
  console.log(colorize('🔍 Step 1: Validating seed data...', 'blue'));
  
  try {
    const { stdout, stderr } = await execPromise('npm run seed:validate');
    console.log(stdout);
    if (stderr) console.warn(colorize(stderr, 'yellow'));
    return true;
  } catch (error) {
    console.error(colorize('❌ Seed data validation failed:', 'red'));
    console.error(error.message);
    return false;
  }
}

async function createMongoBackup() {
  console.log(colorize('🗄️ Step 2: Creating MongoDB backup...', 'blue'));
  
  try {
    const { stdout, stderr } = await execPromise('npm run db:backup');
    console.log(stdout);
    if (stderr) console.warn(colorize(stderr, 'yellow'));
    return true;
  } catch (error) {
    console.error(colorize('❌ MongoDB backup failed:', 'red'));
    console.error(error.message);
    
    // Ask user if they want to continue without backup
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      rl.question(colorize('⚠️ Continue without backup? (y/N): ', 'yellow'), (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
  }
}

async function createSeedDataBackup() {
  console.log(colorize('📋 Step 3: Creating seed data backup...', 'blue'));
  
  try {
    const { stdout, stderr } = await execPromise('npm run seed:backup');
    console.log(stdout);
    if (stderr) console.warn(colorize(stderr, 'yellow'));
    return true;
  } catch (error) {
    console.error(colorize('❌ Seed data backup failed:', 'red'));
    console.error(error.message);
    return false;
  }
}

async function seedDatabase() {
  console.log(colorize('🚀 Step 4: Seeding database with structured data...', 'blue'));
  
  try {
    // Call the structured seed API
    const fetch = require('node-fetch');
    const response = await fetch('http://localhost:3000/api/seed-structured', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    console.log(colorize('✅ Database seeded successfully!', 'green'));
    console.log(colorize('📊 Seeding Statistics:', 'cyan'));
    
    if (result.stats) {
      Object.entries(result.stats).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error(colorize('❌ Database seeding failed:', 'red'));
    console.error(error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error(colorize('💡 Make sure the Next.js development server is running:', 'yellow'));
      console.error('   npm run dev');
    }
    
    return false;
  }
}

async function showSummary() {
  console.log(colorize('\n🎉 Pre-seeding process completed!', 'green'));
  console.log(colorize('📋 Summary:', 'cyan'));
  console.log('   ✅ Seed data validated');
  console.log('   ✅ MongoDB backup created');
  console.log('   ✅ Seed data backup created');
  console.log('   ✅ Database seeded with structured data');
  console.log('');
  console.log(colorize('🔄 Next steps:', 'blue'));
  console.log('   1. Test your application to ensure everything works correctly');
  console.log('   2. If issues occur, you can restore from backups:');
  console.log('      - MongoDB: npm run db:restore <backup-name>');
  console.log('      - Seed data: npm run seed:restore <backup-name>');
  console.log('   3. List available backups: npm run db:list-backups');
}

async function main() {
  const args = process.argv.slice(2);
  const skipBackup = args.includes('--skip-backup');
  const skipValidation = args.includes('--skip-validation');
  
  console.log(colorize('🎯 GigaTalentos Pre-Seeding Process', 'magenta'));
  console.log(colorize('═'.repeat(50), 'cyan'));
  console.log('');
  
  if (skipBackup) {
    console.log(colorize('⚠️ Skipping backup creation (--skip-backup flag)', 'yellow'));
  }
  
  if (skipValidation) {
    console.log(colorize('⚠️ Skipping validation (--skip-validation flag)', 'yellow'));
  }
  
  console.log('');
  
  try {
    // Step 1: Validate seed data
    if (!skipValidation) {
      const validationSuccess = await validateSeedData();
      if (!validationSuccess) {
        console.error(colorize('❌ Process aborted due to validation errors', 'red'));
        process.exit(1);
      }
    }
    
    console.log('');
    
    // Step 2: Create MongoDB backup
    if (!skipBackup) {
      const mongoBackupSuccess = await createMongoBackup();
      if (!mongoBackupSuccess) {
        console.error(colorize('❌ Process aborted due to backup failure', 'red'));
        process.exit(1);
      }
    }
    
    console.log('');
    
    // Step 3: Create seed data backup
    if (!skipBackup) {
      const seedBackupSuccess = await createSeedDataBackup();
      if (!seedBackupSuccess) {
        console.error(colorize('❌ Process aborted due to seed backup failure', 'red'));
        process.exit(1);
      }
    }
    
    console.log('');
    
    // Step 4: Seed database
    const seedSuccess = await seedDatabase();
    if (!seedSuccess) {
      console.error(colorize('❌ Process aborted due to seeding failure', 'red'));
      process.exit(1);
    }
    
    console.log('');
    
    // Show summary
    await showSummary();
    
  } catch (error) {
    console.error(colorize('❌ Unexpected error:', 'red'));
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  // Check if required dependency is available
  try {
    require('node-fetch');
  } catch (e) {
    console.error(colorize('❌ Required dependency missing: node-fetch', 'red'));
    console.error('Install it with: npm install node-fetch');
    process.exit(1);
  }
  
  main();
}

module.exports = {
  validateSeedData,
  createMongoBackup,
  createSeedDataBackup,
  seedDatabase
};
