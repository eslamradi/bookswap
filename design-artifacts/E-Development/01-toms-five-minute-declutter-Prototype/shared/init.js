/**
 * Shared page bootstrap — runs on every prototype page.
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.initPage === 'function') {
    window.initPage();
  }
});
