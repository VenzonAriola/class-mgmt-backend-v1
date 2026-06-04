// Bootstrap file for platforms that run `node server.js` by default (e.g., Render).
// This forwards execution to the compiled output in `dist/server.js`.
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple common build output locations so this bootstrap works
// whether `tsc` emitted `dist/server.js` or `dist/src/server.js`.
const candidates = [
  path.join(__dirname, 'dist', 'server.js'),
  path.join(__dirname, 'dist', 'src', 'server.js'),
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
