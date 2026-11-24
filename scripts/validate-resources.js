// Run with: npm run validate
// Checks every file in src/data/resources/ with the SAME rules the app uses.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildResourceCollection } from '../src/utils/resourceCollection.js';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data/resources');

const useColor = process.stdout.isTTY;
const paint = (code, text) => (useColor ? `\x1b[${code}m${text}\x1b[0m` : text);
const red = (t) => paint(31, t);
const yellow = (t) => paint(33, t);
const green = (t) => paint(32, t);
const bold = (t) => paint(1, t);

const files = readdirSync(dir).filter((name) => !name.startsWith('.'));
const jsonFiles = files.filter((name) => name.endsWith('.json'));
const ignoredFiles = files.filter((name) => !name.endsWith('.json'));

const entries = jsonFiles.map((fileName) => ({
  fileName,
  raw: readFileSync(path.join(dir, fileName), 'utf8'),
}));

const { resources, issues, invalidFiles } = buildResourceCollection(entries);

console.log(bold(`\nChecking ${jsonFiles.length} resource file(s) in src/data/resources/\n`));

for (const name of ignoredFiles) {
  console.log(
    `${yellow('warning')} ${name}: not a ".json" file, so the app ignores it (check the extension).`,
  );
}

for (const fileName of jsonFiles) {
  const own = issues.filter((issue) => issue.fileName === fileName);
  if (own.length === 0) {
    console.log(`${green('✔')} ${fileName}`);
    continue;
  }
  const hasError = own.some((issue) => issue.level === 'error');
  console.log(`${hasError ? red('✖') : yellow('!')} ${fileName}`);
  for (const issue of own) {
    const tag = issue.level === 'error' ? red('error  ') : yellow('warning');
    console.log(`    ${tag} ${issue.message}`);
  }
}

console.log('');
if (invalidFiles > 0) {
  console.log(red(bold(`${invalidFiles} file(s) have errors and would NOT appear in the app.`)));
  console.log('Fix the messages above, then run "npm run validate" again.\n');
  process.exit(1);
}
console.log(green(bold(`All good! ${resources.length} valid resource(s).\n`)));
