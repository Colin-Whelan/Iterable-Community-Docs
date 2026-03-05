/**
 * Iterable Community Docs — App Shell
 * Handles routing, navigation, and theme management
 */

const App = (() => {
  const sections = ['snippets', 'guides', 'tips', 'bugs'];
  const activeSections = new Set(['snippets']); // sections with content

  function init() {
    initTheme();
    initNav();
    initKeyboardShortcuts();
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
  }

  // --- Theme ---
  function initTheme() {
    const saved = localStorage.getItem('icd-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);

    document.getElementById('theme-toggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('icd-theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    btn.textContent = theme === 'dark' ? '☀' : '☾';
    btn.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;
  }

  // --- Navigation ---
  function initNav() {
    document.querySelectorAll('.nav-links a').forEach(link => {
      const section = link.dataset.section;
      if (!activeSections.has(section)) {
        link.classList.add('coming-soon');
        link.addEventListener('click', e => {
          e.preventDefault();
          showSection(section);
        });
      }
    });
  }

  function setActiveNav(section) {
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.toggle('active', link.dataset.section === section);
    });
  }

  // --- Routing ---
  function handleRoute() {
    const hash = window.location.hash.slice(1) || 'snippets';
    const parts = hash.split('/');
    const section = parts[0];

    setActiveNav(section);
    showSection(section);

    // Deep link to a specific snippet
    if (section === 'snippets' && parts.length > 1) {
      const slug = parts.slice(1).join('/');
      // Wait for snippets to load then open modal
      setTimeout(() => Snippets.openBySlug(slug), 200);
    }
  }

  function showSection(section) {
    document.querySelectorAll('.page-section').forEach(el => {
      el.style.display = el.id === `section-${section}` ? '' : 'none';
    });
    setActiveNav(section);
  }

  // --- Keyboard Shortcuts ---
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      // Escape closes modal
      if (e.key === 'Escape') Modal.close();

      // "/" focuses search (if on snippets)
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const searchInput = document.getElementById('search-input');
        if (searchInput && document.activeElement !== searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
    });
  }

  return { init, showSection };
})();

document.addEventListener('DOMContentLoaded', App.init);
