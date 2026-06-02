#!/usr/bin/env node
/**
 * version-check.js
 *
 * Standalone script to preview or apply the same versioning logic used
 * by the pre-push git hook.
 *
 * Usage:
 *   node scripts/version-check.js            # dry-run: show what would change
 *   node scripts/version-check.js --apply    # apply: write version + create tag
 *   node scripts/version-check.js --since v1.2.3  # diff against a specific ref
 *
 * The script compares HEAD against origin/main (or the ref in --since) and
 * prints every changed file with its classification, the resolved bump level,
 * and the new version.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ── config ───────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const PKG_PATH = path.join(ROOT, 'package.json');

const RULES = [
  {
    level: 'major',
    label: 'Breaking / type contract',
    patterns: [
      /^src\/shared\/types\//,
      /^src\/router\//,
      /^src\/store\/authSlice\.ts$/,
    ],
  },
  {
    level: 'minor',
    label: 'New feature / page / layout',
    patterns: [
      /^src\/pages\//,
      /^src\/features\//,
      /^src\/shared\/layout\//,
    ],
  },
  {
    level: 'patch',
    label: 'Style / asset / config / docs',
    patterns: [/.*/],   // catch-all
  },
];

// ── helpers ───────────────────────────────────────────────────────────────────

function run(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function classifyFile(filePath) {
  for (const rule of RULES) {
    if (rule.patterns.some(p => p.test(filePath))) {
      return { level: rule.level, label: rule.label };
    }
  }
  return { level: 'patch', label: 'Style / asset / config / docs' };
}

const PRIORITY = { major: 3, minor: 2, patch: 1 };

function highestBump(classifications) {
  return classifications.reduce(
    (best, c) => PRIORITY[c.level] > PRIORITY[best] ? c.level : best,
    'patch'
  );
}

function bumpVersion(version, part) {
  const [major, minor, patch] = version.replace(/-.*/, '').split('.').map(Number);
  switch (part) {
    case 'major': return `${major + 1}.0.0`;
    case 'minor': return `${major}.${minor + 1}.0`;
    case 'patch': return `${major}.${minor}.${patch + 1}`;
  }
}

// ── parse args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const sinceIdx = args.indexOf('--since');
const sinceRef = sinceIdx !== -1 ? args[sinceIdx + 1] : null;

// ── determine diff range ──────────────────────────────────────────────────────

let baseRef;
if (sinceRef) {
  baseRef = sinceRef;
} else {
  // Try origin/main → origin/master → last tag → first commit
  const candidates = ['origin/main', 'origin/master'];
  baseRef = candidates.find(ref => run(`git rev-parse --verify ${ref} 2>/dev/null`)) ||
            run('git describe --tags --abbrev=0 2>/dev/null') ||
            run('git rev-list --max-parents=0 HEAD');
}

const headRef = 'HEAD';
const diffCmd = `git diff --name-only ${baseRef} ${headRef}`;
const raw = run(diffCmd);

if (!raw) {
  console.log(`\nNo changed files found between ${baseRef} and HEAD.\n`);
  process.exit(0);
}

const files = raw.split('\n').filter(Boolean);

// ── classify each file ────────────────────────────────────────────────────────

const COLS = { file: 0, level: 0, label: 0 };
const rows = files.map(f => {
  const c = classifyFile(f);
  COLS.file  = Math.max(COLS.file,  f.length);
  COLS.level = Math.max(COLS.level, c.level.length);
  COLS.label = Math.max(COLS.label, c.label.length);
  return { file: f, ...c };
});

// ── resolve bump ──────────────────────────────────────────────────────────────

const bump = highestBump(rows);
const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
const currentVersion = pkg.version;
const newVersion = bumpVersion(currentVersion, bump);
const tag = `v${newVersion}`;

// ── print report ──────────────────────────────────────────────────────────────

const LEVEL_COLOR = { major: '\x1b[31m', minor: '\x1b[33m', patch: '\x1b[32m' };
const RESET = '\x1b[0m';
const BOLD  = '\x1b[1m';
const DIM   = '\x1b[2m';

console.log(`\n${BOLD}StayEase — Version Check${RESET}`);
console.log(`${DIM}Comparing: ${baseRef} → ${headRef}${RESET}\n`);

console.log(
  `${'FILE'.padEnd(COLS.file + 2)}${'BUMP'.padEnd(COLS.level + 2)}REASON`
);
console.log('─'.repeat(COLS.file + COLS.level + COLS.label + 6));

for (const r of rows) {
  const color = LEVEL_COLOR[r.level];
  console.log(
    `${r.file.padEnd(COLS.file + 2)}${color}${r.level.padEnd(COLS.level + 2)}${RESET}${DIM}${r.label}${RESET}`
  );
}

console.log('─'.repeat(COLS.file + COLS.level + COLS.label + 6));
console.log(
  `\n${BOLD}Resolved bump :${RESET} ${LEVEL_COLOR[bump]}${bump.toUpperCase()}${RESET}`
);
console.log(`${BOLD}Version       :${RESET} ${currentVersion}  →  ${BOLD}${newVersion}${RESET}`);
console.log(`${BOLD}Tag           :${RESET} ${tag}\n`);

if (!apply) {
  console.log(`${DIM}Dry-run mode — pass --apply to write the version and create the tag.${RESET}\n`);
  process.exit(0);
}

// ── apply ─────────────────────────────────────────────────────────────────────

// Check tag doesn't already exist
const existingTag = run(`git tag --list ${tag}`);
if (existingTag) {
  console.error(`Tag ${tag} already exists. Aborting.\n`);
  process.exit(1);
}

pkg.version = newVersion;
fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n');
console.log(`✓ Updated package.json → ${newVersion}`);

run(`git add ${PKG_PATH}`);
run(`git commit --no-verify -m "chore: bump version to ${newVersion} [skip ci]"`);
run(`git tag ${tag} -m "Release ${tag}"`);
console.log(`✓ Created tag ${tag}`);
console.log(`\nRun ${BOLD}git push --follow-tags${RESET} to push the tag alongside your branch.\n`);
