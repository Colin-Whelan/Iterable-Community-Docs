#!/usr/bin/env node

/**
 * build-index.js
 * Scans all .md files under each content directory (snippets/, guides/, tips/, bugs/)
 * and generates an index.json for each from their frontmatter.
 *
 * Usage: node build-index.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Content sections to index. Each gets its own index.json.
const SECTIONS = ['snippets', 'guides', 'tips', 'bugs'];

// Category display order per section (shared — add section-specific overrides if needed)
const CATEGORY_ORDER = [
  'components',
  'logic',
  'personalization',
  'formatting',
  'data-feeds',
  // Guides / Tips / Bugs categories — add as needed
  'getting-started',
  'data-practices',
  'journeys',
  'deliverability',
  'general',
];

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const data = {};
  let currentKey = null;
  let currentListObj = null;

  for (const line of yaml.split('\n')) {
    const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.+)$/);
    if (kvMatch) {
      currentListObj = null;
      const key = kvMatch[1];
      let val = kvMatch[2].trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        const inner = val.slice(1, -1).trim();
        val = inner ? inner.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')) : [];
      }
      data[key] = val;
      currentKey = key;
      continue;
    }

    const emptyKeyMatch = line.match(/^(\w[\w-]*)\s*:\s*$/);
    if (emptyKeyMatch) {
      currentKey = emptyKeyMatch[1];
      data[currentKey] = [];
      currentListObj = null;
      continue;
    }

    const listObjMatch = line.match(/^\s+-\s+(\w+)\s*:\s*(.+)$/);
    if (listObjMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      const obj = { [listObjMatch[1]]: listObjMatch[2].trim() };
      data[currentKey].push(obj);
      currentListObj = obj;
      continue;
    }

    const contMatch = line.match(/^\s{4,}(\w+)\s*:\s*(.+)$/);
    if (contMatch && currentListObj) {
      currentListObj[contMatch[1]] = contMatch[2].trim();
      continue;
    }

    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(listMatch[1].trim());
    }
  }

  return data;
}

function findMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function buildSectionIndex(section) {
  const dir = path.join(ROOT, section);
  const outputFile = path.join(dir, 'index.json');

  if (!fs.existsSync(dir)) {
    // Create the directory so index.json can live there
    fs.mkdirSync(dir, { recursive: true });
  }

  const mdFiles = findMdFiles(dir);
  const items = [];

  for (const filePath of mdFiles) {
    const relPath = path.relative(dir, filePath);
    const slug = relPath.replace(/\.md$/, '').replace(/\\/g, '/');

    const content = fs.readFileSync(filePath, 'utf-8');
    const fm = parseFrontmatter(content);

    if (!fm) {
      console.warn(`  ⚠  Skipping ${section}/${relPath} — no frontmatter`);
      continue;
    }
    if (!fm.title) {
      console.warn(`  ⚠  Skipping ${section}/${relPath} — missing title`);
      continue;
    }

    items.push({
      slug,
      title: fm.title,
      description: fm.description || '',
      category: fm.category || slug.split('/')[0],
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      context: fm.context || '',
      author: fm.author || '',
    });
  }

  // Sort by category order, then alphabetically by title
  items.sort((a, b) => {
    const catA = CATEGORY_ORDER.indexOf(a.category);
    const catB = CATEGORY_ORDER.indexOf(b.category);
    const orderA = catA === -1 ? 999 : catA;
    const orderB = catB === -1 ? 999 : catB;
    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title);
  });

  fs.writeFileSync(outputFile, JSON.stringify(items, null, 2) + '\n');

  return items;
}

// --- Main ---
console.log('Building content indexes…\n');

let totalItems = 0;

for (const section of SECTIONS) {
  const items = buildSectionIndex(section);
  totalItems += items.length;

  if (items.length) {
    console.log(`✓  ${section}/index.json — ${items.length} item${items.length !== 1 ? 's' : ''}`);
    const cats = {};
    items.forEach(i => { cats[i.category] = (cats[i.category] || 0) + 1; });
    for (const [cat, count] of Object.entries(cats)) {
      console.log(`   · ${cat}: ${count}`);
    }
  } else {
    console.log(`·  ${section}/index.json — empty (directory will be created)`);
  }
}

console.log(`\nDone. ${totalItems} total items across ${SECTIONS.length} sections.`);
