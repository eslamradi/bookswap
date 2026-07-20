/**
 * Shared utility functions — add as needed across pages.
 */
window.ProtoUtils = {
  formatIsbn(raw) {
    return raw.replace(/[^0-9Xx]/g, '');
  },
};
