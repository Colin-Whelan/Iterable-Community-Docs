/**
 * Iterable Community Docs — App Shell
 * Handles routing, navigation, and theme management.
 */

const App = (() => {
  function init() {
    initTheme();
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    initKeyboardShortcuts();
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

  // --- Routing ---
  function handleRoute() {
    const hash = window.location.hash.slice(1) || 'snippets';
    const parts = hash.split('/');
    const section = parts[0];

    setActiveNav(section);

    if (parts.length > 1) {
      // Detail view: #section/category/slug or #section/slug
      const slug = parts.slice(1).join('/');
      Content.showDetail(section, slug);
    } else {
      // Listing view: #section
      Content.showListing(section);
    }
  }

  function setActiveNav(section) {
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.toggle('active', link.dataset.section === section);
    });
  }

  // --- Keyboard Shortcuts ---
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      // "/" focuses search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const searchInput = document.getElementById('search-input');
        if (searchInput && document.activeElement !== searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
