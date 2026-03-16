/**
 * Iterable Community Docs — Content Module
 * Unified handler for all content types: snippets, guides, tips, bugs
 * Handles listing views (card grids), detail page views, search, and markdown rendering.
 */

const Content = (() => {
  // Section configuration
  const SECTIONS = {
    snippets: {
      title: 'Snippets',
      description: 'Handlebars code snippets for Iterable templates. Browse by category or search by keyword.',
      contentDir: 'snippets',
      icon: '⌘',
    },
    guides: {
      title: 'Guides',
      description: 'Data practices, journey samples, and in-depth walkthroughs.',
      contentDir: 'guides',
      icon: '📖',
    },
    tips: {
      title: 'Tips',
      description: 'Quick tips, best practices, and workflow tricks.',
      contentDir: 'tips',
      icon: '💡',
    },
    bugs: {
      title: 'Bugs & Workarounds',
      description: 'Documented quirks with community-sourced fixes.',
      contentDir: 'bugs',
      icon: '🐛',
    },
    scripts: {
      title: 'Extensions (scripts)',
      description: `Custom scripts and extensions for Iterable.
      <br><br>
      1. Install <a href="https://www.tampermonkey.net/" target="_blank">TamperMonkey</a> on the browser of your choice - Pinning it to the toolbar is recommended. <br>
      2. Copy the 'Script Source' URL at the bottom of each script page.<br>
      3. In TamperMonkey, create a new script and paste the URL into the source field. Save and enable the script to activate it on your Iterable account!
      `,
      contentDir: 'scripts',
      icon: '⚙',
    },
  };

  // State
  const indexCache = {};       // section -> items[]
  const contentCache = {};     // "section/slug" -> { frontmatter, body }
  let currentSection = null;
  let currentSlug = null;

  // --- Configure marked.js ---
  function initMarked() {
    if (!window.marked) return;

    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // Custom renderer for code blocks — wraps them in our styled container with copy button
    const renderer = new marked.Renderer();
    const originalCode = renderer.code.bind(renderer);

    renderer.code = function (code, lang) {
      const language = lang || 'plaintext';
      const displayLang = language.replace('hbs', 'handlebars');
      const escaped = escapeHtml(typeof code === 'string' ? code : code.text || '');
      const langClass = `language-${language === 'hbs' ? 'handlebars' : language}`;

      return `
        <div class="code-container">
          <div class="code-toolbar">
            <span>${displayLang}</span>
            <button class="copy-btn" onclick="Content.copyCode(this)">⎘ Copy</button>
          </div>
          <pre><code class="${langClass}">${escaped}</code></pre>
        </div>`;
    };

    // Images — make them responsive
    renderer.image = function (href, title, text) {
      const src = typeof href === 'string' ? href : href.href || '';
      const alt = typeof text === 'string' ? text : href.text || '';
      const titleAttr = (typeof title === 'string' ? title : href.title || '') 
        ? ` title="${escapeHtml(typeof title === 'string' ? title : href.title || '')}"` 
        : '';
      return `<img src="${src}" alt="${escapeHtml(alt)}"${titleAttr} class="content-image" loading="lazy">`;
    };

    marked.setOptions({ renderer });
  }

  // --- Index Loading ---
  async function loadIndex(section) {
    if (indexCache[section]) return indexCache[section];

    const config = SECTIONS[section];
    if (!config) return [];

    try {
      const res = await fetch(`${config.contentDir}/index.json`);
      if (!res.ok) {
        indexCache[section] = [];
        return [];
      }
      const items = await res.json();
      indexCache[section] = items;
      return items;
    } catch (err) {
      console.error(`Failed to load ${section} index:`, err);
      indexCache[section] = [];
      return [];
    }
  }

  // --- Content Loading ---
  async function loadContent(section, slug) {
    const cacheKey = `${section}/${slug}`;
    if (contentCache[cacheKey]) return contentCache[cacheKey];

    const config = SECTIONS[section];
    if (!config) return null;

    try {
      const res = await fetch(`${config.contentDir}/${slug}.md`);
      if (!res.ok) return null;
      const md = await res.text();
      const parsed = parseFrontmatter(md);
      contentCache[cacheKey] = parsed;
      return parsed;
    } catch (err) {
      console.error(`Failed to load ${cacheKey}:`, err);
      return null;
    }
  }

  // --- Listing View ---
  async function showListing(section) {
    currentSection = section;
    currentSlug = null;

    const config = SECTIONS[section];
    const main = document.getElementById('main-content');

    if (!config) {
      main.innerHTML = '<div class="empty-state"><p>Unknown section.</p></div>';
      return;
    }

    const items = await loadIndex(section);

    main.innerHTML = `
      <div class="section-header">
        <h1>${config.title}</h1>
        <p>${config.description}</p>
      </div>
      <div class="search-bar">
        <span class="search-icon">⌕</span>
        <input type="text" id="search-input" placeholder="Search ${config.title.toLowerCase()}… (press / to focus)" autocomplete="off">
        <div class="search-results-info" id="search-results-info"></div>
      </div>
      <div id="content-container"></div>
    `;

    renderCards(section, items);
    initSearch(section, items);
    window.scrollTo(0, 0);
  }

  function renderCards(section, items) {
    const container = document.getElementById('content-container');
    if (!container) return;

    if (!items.length) {
      const config = SECTIONS[section];
      container.innerHTML = `
        <div class="coming-soon-section">
          <div class="icon">${config.icon}</div>
          <h2>${config.title}</h2>
          <p>No content yet. Check back soon!</p>
        </div>`;
      updateResultsInfo(0, section);
      return;
    }

    // Group by category
    const groups = {};
    const categoryOrder = [];
    items.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
        categoryOrder.push(item.category);
      }
      groups[item.category].push(item);
    });

    container.innerHTML = categoryOrder.map(cat => `
      <div class="category-section" id="cat-${cat}">
        <div class="category-header" onclick="Content.toggleCategory('${cat}')">
          <h2>${formatCategoryName(cat)}</h2>
          <span class="category-count">${groups[cat].length}</span>
          <span class="category-chevron">▾</span>
        </div>
        <div class="category-cards">
          ${groups[cat].map(item => renderCard(section, item)).join('')}
        </div>
      </div>
    `).join('');

    updateResultsInfo(items.length, section);
  }

  function renderCard(section, item) {
    const tags = (item.tags || []).slice(0, 3)
      .map(t => `<span class="snippet-tag">${t}</span>`).join('');

    return `
      <a class="snippet-card" href="#${section}/${item.slug}" data-slug="${item.slug}">
        <div class="snippet-card-title">${escapeHtml(item.title)}</div>
        <div class="snippet-card-desc">${escapeHtml(item.description)}</div>
        <div class="snippet-card-meta">
          ${tags}
          ${item.context ? `<span class="snippet-context">${escapeHtml(item.context)}</span>` : ''}
        </div>
      </a>
    `;
  }

  // --- Detail Page View ---
  async function showDetail(section, slug) {
    currentSection = section;
    currentSlug = slug;

    const config = SECTIONS[section];
    const main = document.getElementById('main-content');

    if (!config) {
      main.innerHTML = '<div class="empty-state"><p>Unknown section.</p></div>';
      return;
    }

    // Show loading state
    main.innerHTML = `
      <div class="detail-page">
        <div class="detail-back">
          <a href="#${section}">← Back to ${config.title}</a>
        </div>
        <div class="detail-loading">Loading…</div>
      </div>`;

    // Load index to get metadata
    const items = await loadIndex(section);
    const item = items.find(i => i.slug === slug);

    // Load full markdown content
    const content = await loadContent(section, slug);

    if (!content) {
      main.innerHTML = `
        <div class="detail-page">
          <div class="detail-back">
            <a href="#${section}">← Back to ${config.title}</a>
          </div>
          <div class="empty-state">
            <div class="icon">⚠</div>
            <p>Content not found: ${escapeHtml(slug)}</p>
          </div>
        </div>`;
      return;
    }

    const fm = content.frontmatter;
    const title = fm.title || (item && item.title) || slug;
    const description = fm.description || (item && item.description) || '';
    const author = fm.author || (item && item.author) || '';
    const tags = Array.isArray(fm.tags) ? fm.tags : (item && item.tags) || [];
    const context = fm.context || (item && item.context) || '';
    const links = (Array.isArray(fm.links) ? fm.links : []).filter(l => l && l.url && l.label);

    // Render markdown body
    const renderedBody = marked.parse(content.body);

    const tagsHtml = tags.map(t => `<span class="snippet-tag">${t}</span>`).join('');
    const linksHtml = links.length
      ? `<div class="detail-links"><h3>Related Links</h3>${links.map(l =>
          `<a href="${l.url}" target="_blank" rel="noopener">→ ${escapeHtml(l.label)}</a>`
        ).join('')}</div>`
      : '';

    main.innerHTML = `
      <div class="detail-page">
        <div class="detail-back">
          <a href="#${section}">← Back to ${config.title}</a>
        </div>

        <article class="detail-article">
          <header class="detail-header">
            <h1>${escapeHtml(title)}</h1>
            <p class="detail-description">${escapeHtml(description)}</p>
            <div class="detail-meta">
              ${tagsHtml}
              ${context ? `<span class="snippet-context">${escapeHtml(context)}</span>` : ''}
            </div>
            <div class="detail-meta-row">
              ${author ? `<span class="detail-author">by ${escapeHtml(author)}</span>` : ''}
              <span class="quick-link" onclick="Content.copyLink('${section}', '${slug}')" title="Copy permalink">
                # ${slug}
              </span>
            </div>
          </header>

          <div class="detail-body markdown-body">
            ${renderedBody}
          </div>

          ${linksHtml}
        </article>
      </div>
    `;

    // Apply Prism highlighting to all code blocks
    if (window.Prism) {
      main.querySelectorAll('pre code').forEach(block => {
        Prism.highlightElement(block);
      });
    }

    // Add copy buttons to any code blocks that marked rendered without our custom wrapper
    addCopyButtons(main);

    window.scrollTo(0, 0);
  }

  // --- Add Copy Buttons to Raw Code Blocks ---
  // marked's renderer handles fenced blocks, but this catches edge cases
  function addCopyButtons(container) {
    container.querySelectorAll('.code-container').forEach(block => {
      // Already has a copy button from our renderer
    });
  }

  // --- Search ---
  function initSearch(section, allItems) {
    const input = document.getElementById('search-input');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
          renderCards(section, allItems);
          return;
        }
        const terms = query.split(/\s+/);
        const filtered = allItems.filter(item => {
          const haystack = [
            item.title, item.description, item.category,
            ...(item.tags || []), item.context || '', item.author || ''
          ].join(' ').toLowerCase();
          return terms.every(term => haystack.includes(term));
        });
        renderCards(section, filtered);
      }, 150);
    });
  }

  function updateResultsInfo(count, section) {
    const el = document.getElementById('search-results-info');
    const input = document.getElementById('search-input');
    if (!el) return;
    const config = SECTIONS[section];
    const label = config ? config.title.toLowerCase() : 'items';
    if (input && input.value.trim()) {
      el.textContent = `${count} ${label} found`;
    } else {
      el.textContent = `${count} ${label}`;
    }
  }

  // --- Category Toggle ---
  function toggleCategory(cat) {
    const section = document.getElementById(`cat-${cat}`);
    if (section) section.classList.toggle('collapsed');
  }

  // --- Copy Helpers ---
  function copyCode(btn) {
    const codeEl = btn.closest('.code-container').querySelector('code');
    const text = codeEl.textContent;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      btn.textContent = '✓ Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = '⎘ Copy';
      }, 2000);
    });
  }

  function copyLink(section, slug) {
    const url = `${window.location.origin}${window.location.pathname}#${section}/${slug}`;
    navigator.clipboard.writeText(url);
  }

  // --- Frontmatter Parser ---
  function parseFrontmatter(text) {
    // Normalize line endings to LF (handles CRLF from Windows)
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const frontmatter = {};
    let body = text;

    const fmMatch = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (fmMatch) {
      const yaml = fmMatch[1];
      body = fmMatch[2];

      let currentKey = null;
      let currentListObj = null;

      yaml.split('\n').forEach(line => {
        const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.+)$/);
        if (kvMatch) {
          currentListObj = null;
          const key = kvMatch[1];
          let val = kvMatch[2].trim();
          if (val.startsWith('[') && val.endsWith(']')) {
            const inner = val.slice(1, -1).trim();
            val = inner ? inner.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')) : [];
          }
          frontmatter[key] = val;
          currentKey = key;
          return;
        }

        const emptyKeyMatch = line.match(/^(\w[\w-]*)\s*:\s*$/);
        if (emptyKeyMatch) {
          currentKey = emptyKeyMatch[1];
          frontmatter[currentKey] = [];
          currentListObj = null;
          return;
        }

        const listObjMatch = line.match(/^\s+-\s+(\w+)\s*:\s*(.+)$/);
        if (listObjMatch && currentKey) {
          if (!Array.isArray(frontmatter[currentKey])) frontmatter[currentKey] = [];
          const obj = {};
          obj[listObjMatch[1]] = listObjMatch[2].trim();
          frontmatter[currentKey].push(obj);
          currentListObj = obj;
          return;
        }

        const contMatch = line.match(/^\s{4,}(\w+)\s*:\s*(.+)$/);
        if (contMatch && currentListObj) {
          currentListObj[contMatch[1]] = contMatch[2].trim();
          return;
        }

        const listMatch = line.match(/^\s+-\s+(.+)$/);
        if (listMatch && currentKey) {
          if (!Array.isArray(frontmatter[currentKey])) frontmatter[currentKey] = [];
          frontmatter[currentKey].push(listMatch[1].trim());
        }
      });
    }

    return { frontmatter, body: body.trim() };
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

  // Init marked on load
  document.addEventListener('DOMContentLoaded', initMarked);

  return {
    showListing,
    showDetail,
    toggleCategory,
    copyCode,
    copyLink,
    SECTIONS,
  };
})();
