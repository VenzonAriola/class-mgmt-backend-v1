// Bootstrap file for platforms that run `node server.js` by default (e.g., Render).
// This forwards execution to the compiled output in `dist/server.js` or `dist/src/server.js`.
import path from 'path';
import fs from 'fs';

// Determine the project root. If cwd ends with /src, strip it (happens on Render).
let root = process.cwd();
console.log('[Bootstrap] Initial cwd:', root);

if (root.endsWith('/src') || root.endsWith('\\src')) {
  root = root.slice(0, -4);
  console.log('[Bootstrap] Stripped /src, new root:', root);
}

// Check if dist directory exists and what's in it
const distPath = path.join(root, 'dist');
console.log('[Bootstrap] Looking for dist at:', distPath);
console.log('[Bootstrap] Dist exists:', fs.existsSync(distPath));

if (fs.existsSync(distPath)) {
  const distContents = fs.readdirSync(distPath);
  console.log('[Bootstrap] Dist contents:', distContents);
}

// Try multiple common build output locations so this bootstrap works
// whether `tsc` emitted `dist/server.js` or `dist/src/server.js`.
const candidates = [
  path.join(root, 'dist', 'src', 'server.js'),
  path.join(root, 'dist', 'server.js'),
];

console.log('[Bootstrap] Checking candidates:');
for (const candidate of candidates) {
  console.log(`  - ${candidate} (exists: ${fs.existsSync(candidate)})`);
}

async function start() {
  for (const candidate of candidates) {
    try {
      console.log(`[Bootstrap] Attempting to import: ${candidate}`);
      await import(candidate);
      console.log('[Bootstrap] Successfully imported and started!');
      return;
    } catch (err) {
      console.log(`[Bootstrap] Failed to import ${candidate}: ${err.message}`);
    }
  }

  console.error('[Bootstrap] Failed to find compiled server entry. Tried:', candidates);
  process.exit(1);
}

await start();
