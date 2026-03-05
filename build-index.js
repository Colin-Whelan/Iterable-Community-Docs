#!/usr/bin/env node

/**
 * build-index.js
 * Scans all .md files under snippets/ and generates snippets/index.json
 * from their frontmatter. Run after adding or editing snippets.
 *
 * Usage: node build-index.js
 */

const fs = require('fs');
const path = require('path');

const SNIPPETS_DIR = path.join(__dirname, 'snippets');
const OUTPUT_FILE = path.join(SNIPPETS_DIR, 'index.json');

// Category display order (add new categories here to control sort)
const CATEGORY_ORDER = [
  'personalization',
  'logic',
  'formatting',
  'data-feeds',
];

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const data = {};
  let currentKey = null;
  let currentListObj = null;

  for (const line of yaml.split('\n')) {
    // Top-level key with inline value
    const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.+)$/);
    if (kvMatch) {
      currentListObj = null;
      const key = kvMatch[1];
      let val = kvMatch[2].trim();

      // Inline array: [a, b, c]
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      }
      data[key] = val;
      currentKey = key;
      continue;
    }

    // Key with no inline value (starts a list)
    const emptyKeyMatch = line.match(/^(\w[\w-]*)\s*:\s*$/);
    if (emptyKeyMatch) {
      currentKey = emptyKeyMatch[1];
      data[currentKey] = [];
      currentListObj = null;
      continue;
    }

    // List item with key-value (object start): "  - label: ..."
    const listObjMatch = line.match(/^\s+-\s+(\w+)\s*:\s*(.+)$/);
    if (listObjMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      const obj = { [listObjMatch[1]]: listObjMatch[2].trim() };
      data[currentKey].push(obj);
      currentListObj = obj;
      continue;
    }

    // Continuation key in list object: "    url: ..."
    const contMatch = line.match(/^\s{4,}(\w+)\s*:\s*(.+)$/);
    if (contMatch && currentListObj) {
      currentListObj[contMatch[1]] = contMatch[2].trim();
      continue;
    }

    // Simple list item: "  - value"
    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(listMatch[1].trim());
    }
  }

  return data;
}

function findMdFiles(dir) {
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

function buildIndex() {
  const mdFiles = findMdFiles(SNIPPETS_DIR);
  const snippets = [];

  for (const filePath of mdFiles) {
    const relPath = path.relative(SNIPPETS_DIR, filePath);
    const slug = relPath.replace(/\.md$/, '').replace(/\\/g, '/');

    const content = fs.readFileSync(filePath, 'utf-8');
    const fm = parseFrontmatter(content);

    if (!fm) {
      console.warn(`⚠  Skipping ${relPath} — no frontmatter found`);
      continue;
    }

    if (!fm.title) {
      console.warn(`⚠  Skipping ${relPath} — missing title`);
      continue;
    }

    snippets.push({
      slug,
      title: fm.title,
      description: fm.description || '',
      category: fm.category || slug.split('/')[0],
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      context: fm.context || '',
      author: fm.author || '',
    });
  }

  // Sort: by category order first, then alphabetically by title within each category
  snippets.sort((a, b) => {
    const catA = CATEGORY_ORDER.indexOf(a.category);
    const catB = CATEGORY_ORDER.indexOf(b.category);
    const orderA = catA === -1 ? 999 : catA;
    const orderB = catB === -1 ? 999 : catB;

    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title);
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(snippets, null, 2) + '\n');

  console.log(`✓  Generated ${OUTPUT_FILE}`);
  console.log(`   ${snippets.length} snippet${snippets.length !== 1 ? 's' : ''} indexed`);

  // Show breakdown by category
  const cats = {};
  snippets.forEach(s => { cats[s.category] = (cats[s.category] || 0) + 1; });
  for (const [cat, count] of Object.entries(cats)) {
    console.log(`   · ${cat}: ${count}`);
  }
}

buildIndex();
