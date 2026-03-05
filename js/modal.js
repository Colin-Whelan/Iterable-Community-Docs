/**
 * Iterable Community Docs — Modal
 * Handles snippet detail view in a modal overlay
 */

const Modal = (() => {
  let overlayEl, modalEl;

  function init() {
    overlayEl = document.getElementById('modal-overlay');
    modalEl = document.getElementById('modal');

    overlayEl.addEventListener('click', e => {
      if (e.target === overlayEl) close();
    });
  }

  function open(snippet, code) {
    const links = snippet.links || [];
    const linksHtml = links.length
      ? `<div class="modal-links">${links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join('')}</div>`
      : '';

    const tagsHtml = (snippet.tags || [])
      .map(t => `<span class="snippet-tag">${t}</span>`).join('');

    const escapedCode = escapeHtml(code);

    modalEl.innerHTML = `
      <div class="modal-header">
        <div>
          <div class="modal-title">${escapeHtml(snippet.title)}</div>
        </div>
        <button class="modal-close" onclick="Modal.close()" title="Close (Esc)">&times;</button>
      </div>
      <div class="modal-body">
        <p class="modal-description">${escapeHtml(snippet.description || '')}</p>
        <div class="modal-meta">
          ${tagsHtml}
          ${snippet.context ? `<span class="snippet-context">${escapeHtml(snippet.context)}</span>` : ''}
        </div>
        <div class="modal-meta" style="margin-bottom: 16px;">
          <span class="modal-meta-item"><span>by</span> ${escapeHtml(snippet.author || 'unknown')}</span>
          <a class="quick-link" onclick="Modal.copyLink('${snippet.slug}')" title="Copy link to this snippet">
            # ${snippet.slug}
          </a>
        </div>
        <div class="code-container">
          <div class="code-toolbar">
            <span>handlebars</span>
            <button class="copy-btn" onclick="Modal.copyCode(this)">
              <span class="copy-icon">⎘</span> Copy
            </button>
          </div>
          <pre><code class="language-handlebars">${escapedCode}</code></pre>
        </div>
        ${linksHtml}
      </div>
    `;

    overlayEl.classList.add('visible');
    document.body.style.overflow = 'hidden';

    // Trigger Prism highlighting
    if (window.Prism) {
      Prism.highlightAllUnder(modalEl);
    }
  }

  function close() {
    overlayEl.classList.remove('visible');
    document.body.style.overflow = '';
  }

  function copyCode(btn) {
    const codeEl = btn.closest('.code-container').querySelector('code');
    const text = codeEl.textContent;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      btn.innerHTML = '<span class="copy-icon">✓</span> Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<span class="copy-icon">⎘</span> Copy';
      }, 2000);
    });
  }

  function copyLink(slug) {
    const url = `${window.location.origin}${window.location.pathname}#snippets/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      // Brief visual feedback could be added here
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', init);

  return { open, close, copyCode, copyLink };
})();
