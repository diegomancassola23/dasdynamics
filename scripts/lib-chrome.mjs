// Finds a local Chrome/Edge for playwright-core (no browser download needed).
import fs from 'node:fs';

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

export function findChrome() {
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) throw new Error('No Chrome or Edge found. Set CHROME_PATH.');
  return found;
}
