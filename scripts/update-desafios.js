#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const desafiosPath = path.join(__dirname, '..', 'data', 'seed', 'desafios.json');

console.log('🔄 Updating desafios.json to include required fields...');

// Read the current desafios
const desafios = JSON.parse(fs.readFileSync(desafiosPath, 'utf8'));

// Generate realistic date ranges for challenges
const baseDate = new Date('2024-12-01');
const updatedDesafios = desafios.map((desafio, index) => {
  // Calculate start date (staggered every 2 weeks)
  const startDate = new Date(baseDate);
  startDate.setDate(baseDate.getDate() + (index * 14));
  
  // Calculate end date based on duration
  const endDate = new Date(startDate);
  const durationWeeks = parseInt(desafio.duration.match(/\d+/)[0]) || 4;
  endDate.setDate(startDate.getDate() + (durationWeeks * 7));
  
  return {
    ...desafio,
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0]
  };
});

// Write the updated desafios
fs.writeFileSync(desafiosPath, JSON.stringify(updatedDesafios, null, 2));

console.log(`✅ Updated ${updatedDesafios.length} desafios with start_date and end_date fields`);
console.log('📅 Date ranges:');
updatedDesafios.forEach((desafio, index) => {
  if (index < 5) { // Show first 5 examples
    console.log(`   ${desafio.title.substring(0, 40)}... : ${desafio.start_date} → ${desafio.end_date}`);
  }
});
