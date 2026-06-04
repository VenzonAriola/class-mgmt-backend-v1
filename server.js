// Bootstrap file for platforms that run `node server.js` by default (e.g., Render).
// This forwards execution to the compiled output in `dist/server.js` or `dist/src/server.js`.
import path from 'path';

// Use process.cwd() to ensure we find compiled output relative to where npm runs,
// not relative to where this file is located.
const candidates = [
  path.join(process.cwd(), 'dist', 'src', 'server.js'),
  path.join(process.cwd(), 'dist', 'server.js'),
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
