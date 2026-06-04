#!/usr/bin/env node
const { execSync } = require('child_process');

function runGenerate() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn('Skipping `prisma generate` because DATABASE_URL is not set.');
    return;
  }

  try {
    console.log('Running `prisma generate`...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('`prisma generate` completed.');
  } catch (err) {
    console.error('Error running `prisma generate`:', err);
    process.exit(1);
  }
}

runGenerate();
