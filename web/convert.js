const fs = require('fs');
const content = fs.readFileSync('C:/KILL BUSYness Website/kill-busyness-app/web/public/data/master_coach_training.md', 'utf8');
const safeContent = JSON.stringify(content);
const tsContent = `export const masterTrainingManual = ${safeContent};`;
fs.writeFileSync('C:/KILL BUSYness Website/kill-busyness-app/web/public/data/master_coach_training.ts', tsContent);
