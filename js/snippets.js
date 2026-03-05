/**
 * Iterable Community Docs — Snippets
 * Handles loading, rendering, searching, and filtering snippet cards
 */

const Snippets = (() => {
  let allSnippets = [];
  let snippetContent = {}; // slug -> { code, links }

  async function init() {
    try {
      const res = await fetch('snippets/index.json');
      allSnippets = await res.json();
      render(allSnippets);
      initSearch();
    } catch (err) {
      console.error('Failed to load snippet index:', err);
      document.getElementById('snippets-container').innerHTML =
        '<div class="empty-state"><div class="icon">⚠</div><p>Failed to load snippets. Check console for details.</p></div>';
    }
  }

  // --- Render snippet cards grouped by category ---
  function render(snippets) {
    const container = document.getElementById('snippets-container');

    if (!snippets.length) {
      container.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><p>No snippets match your search.</p></div>';
      updateResultsInfo(0);
      return;
    }

    // Group by category
    const groups = {};
    const categoryOrder = [];
    snippets.forEach(s => {
      if (!groups[s.category]) {
        groups[s.category] = [];
        categoryOrder.push(s.category);
      }
      groups[s.category].push(s);
    });

    container.innerHTML = categoryOrder.map(cat => `
      <div class="category-section" id="cat-${cat}">
        <div class="category-header" onclick="Snippets.toggleCategory('${cat}')">
          <h2>${formatCategoryName(cat)}</h2>
          <span class="category-count">${groups[cat].length}</span>
          <span class="category-chevron">▾</span>
        </div>
        <div class="category-cards">
          ${groups[cat].map(s => renderCard(s)).join('')}
        </div>
      </div>
    `).join('');

    updateResultsInfo(snippets.length);
  }

  function renderCard(snippet) {
    const tags = (snippet.tags || []).slice(0, 3)
      .map(t => `<span class="snippet-tag">${t}</span>`).join('');

    return `
      <div class="snippet-card" onclick="Snippets.openSnippet('${snippet.slug}')" data-slug="${snippet.slug}">
        <div class="snippet-card-title">${escapeHtml(snippet.title)}</div>
        <div class="snippet-card-desc">${escapeHtml(snippet.description)}</div>
        <div class="snippet-card-meta">
          ${tags}
          ${snippet.context ? `<span class="snippet-context">${escapeHtml(snippet.context)}</span>` : ''}
        </div>
      </div>
    `;
  }

  // --- Category Toggle ---
  function toggleCategory(cat) {
    const section = document.getElementById(`cat-${cat}`);
    if (section) section.classList.toggle('collapsed');
  }

  // --- Search ---
  function initSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
          render(allSnippets);
          return;
        }
        const filtered = allSnippets.filter(s => {
          const haystack = [
            s.title, s.description, s.category,
            ...(s.tags || []), s.context || '', s.author || ''
          ].join(' ').toLowerCase();
          // Support multi-word: all terms must match
          const terms = query.split(/\s+/);
          return terms.every(term => haystack.includes(term));
        });
        render(filtered);
      }, 150);
    });
  }

  function updateResultsInfo(count) {
    const el = document.getElementById('search-results-info');
    const input = document.getElementById('search-input');
    if (!el) return;
    if (input && input.value.trim()) {
      el.textContent = `${count} snippet${count !== 1 ? 's' : ''} found`;
      el.style.display = '';
    } else {
      el.textContent = `${count} snippet${count !== 1 ? 's' : ''}`;
      el.style.display = '';
    }
  }

  // --- Open Snippet in Modal ---
  async function openSnippet(slug) {
    const snippet = allSnippets.find(s => s.slug === slug);
    if (!snippet) return;

    // Fetch markdown file if not cached
    if (!snippetContent[slug]) {
      try {
        const res = await fetch(`snippets/${slug}.md`);
        const md = await res.text();
        snippetContent[slug] = parseMd(md);
      } catch (err) {
        console.error(`Failed to load snippet: ${slug}`, err);
        return;
      }
    }

    const content = snippetContent[slug];
    // Merge parsed data into the snippet object
    const fullSnippet = {
      ...snippet,
      description: content.frontmatter.description || snippet.description,
      links: content.frontmatter.links || [],
    };

    Modal.open(fullSnippet, content.code);

    // Update URL hash without triggering full re-route
    history.replaceState(null, '', `#snippets/${slug}`);
  }

  function openBySlug(slug) {
    openSnippet(slug);
  }

  // --- Markdown Frontmatter Parser ---
  function parseMd(text) {
    const frontmatter = {};
    let body = text;

    // Extract YAML frontmatter
    const fmMatch = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (fmMatch) {
      const yaml = fmMatch[1];
      body = fmMatch[2];

      // Simple YAML parser for our known fields
      let currentKey = null;
      let currentList = null;
      let currentListOfObjects = null;

      yaml.split('\n').forEach(line => {
        // Top-level key: value
        const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.+)$/);
        if (kvMatch) {
          currentListOfObjects = null;
          currentList = null;
          const key = kvMatch[1];
          let val = kvMatch[2].trim();

          // Inline array: [a, b, c]
          if (val.startsWith('[') && val.endsWith(']')) {
            val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
          }
          frontmatter[key] = val;
          currentKey = key;
          return;
        }

        // Empty array/object start: "key:"
        const emptyKeyMatch = line.match(/^(\w[\w-]*)\s*:\s*$/);
        if (emptyKeyMatch) {
          currentKey = emptyKeyMatch[1];
          frontmatter[currentKey] = [];
          currentList = frontmatter[currentKey];
          currentListOfObjects = null;
          return;
        }

        // List item object: "  - label: ..."
        const listObjMatch = line.match(/^\s+-\s+(\w+)\s*:\s*(.+)$/);
        if (listObjMatch && currentKey) {
          if (!Array.isArray(frontmatter[currentKey])) frontmatter[currentKey] = [];
          const obj = {};
          obj[listObjMatch[1]] = listObjMatch[2].trim();
          frontmatter[currentKey].push(obj);
          currentListOfObjects = obj;
          return;
        }

        // Continuation of list object: "    url: ..."
        const contMatch = line.match(/^\s{4,}(\w+)\s*:\s*(.+)$/);
        if (contMatch && currentListOfObjects) {
          currentListOfObjects[contMatch[1]] = contMatch[2].trim();
          return;
        }

        // Simple list item: "  - value"
        const listMatch = line.match(/^\s+-\s+(.+)$/);
        if (listMatch && currentKey) {
          if (!Array.isArray(frontmatter[currentKey])) frontmatter[currentKey] = [];
          frontmatter[currentKey].push(listMatch[1].trim());
        }
      });
    }

    // Extract fenced code block
    let code = '';
    const codeMatch = body.match(/```(?:handlebars|hbs|html|javascript|js)?\n([\s\S]*?)```/);
    if (codeMatch) {
      code = codeMatch[1].trim();
    }

    return { frontmatter, code };
  }

  // --- Helpers ---
  function formatCategoryName(cat) {
    return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', init);

  return { openSnippet, openBySlug, toggleCategory };
})();
