// Bootstrap file for platforms that run `node server.js` by default (e.g., Render).
// This forwards execution to the compiled output in `dist/server.js` or `dist/src/server.js`.
import path from 'path';

// Determine the project root. If cwd ends with /src, strip it (happens on Render).
let root = process.cwd();
if (root.endsWith('/src') || root.endsWith('\\src')) {
  root = root.slice(0, -4);
}

// Try multiple common build output locations so this bootstrap works
// whether `tsc` emitted `dist/server.js` or `dist/src/server.js`.
const candidates = [
  path.join(root, 'dist', 'src', 'server.js'),
  path.join(root, 'dist', 'server.js'),
];

async function start() {
  for (const candidate of candidates) {
    try {
      await import(candidate);
      return;
    } catch (err) {
      // continue to next candidate
    }
  }

  console.error('Failed to find compiled server entry. Tried:', candidates);
  process.exit(1);
}

await start();
