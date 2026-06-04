#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[Build] Starting build process...');
console.log('[Build] Current working directory:', process.cwd());

// Step 1: Run postinstall (prisma generate)
console.log('\n[Build] Step 1: Running postinstall script...');
try {
  execSync('node ./scripts/postinstall.cjs', { stdio: 'inherit' });
  console.log('[Build] Postinstall completed successfully');
} catch (err) {
  console.error('[Build] Postinstall failed:', err.message);
  process.exit(1);
}

// Step 2: Run tsc
console.log('\n[Build] Step 2: Running TypeScript compiler...');
try {
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('[Build] TypeScript compilation completed');
} catch (err) {
  console.error('[Build] TypeScript compilation failed:', err.message);
  process.exit(1);
}

// Step 3: Verify dist directory exists and has content
console.log('\n[Build] Step 3: Verifying build output...');
const distPath = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distPath)) {
  console.error('[Build] ERROR: dist/ directory not found at', distPath);
  process.exit(1);
}

const distContents = fs.readdirSync(distPath);
console.log('[Build] dist/ directory contents:', distContents);

// Check for server.js specifically
const serverPath = path.join(distPath, 'server.js');
const serverSrcPath = path.join(distPath, 'src', 'server.js');

if (!fs.existsSync(serverPath) && !fs.existsSync(serverSrcPath)) {
  console.error('[Build] ERROR: server.js not found in dist/ or dist/src/');
  process.exit(1);
}

console.log('[Build] ✅ Build completed successfully!');
