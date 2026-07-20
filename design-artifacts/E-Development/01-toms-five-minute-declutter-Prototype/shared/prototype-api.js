/**
 * Prototype API — simulates a backend using localStorage, seeded from data/demo-data.json.
 * Static prototype only. Not production code.
 */
window.PrototypeAPI = (function () {
  const STORAGE_KEY = 'bookswap_prototype_state';

  function loadSeed() {
    if (!window.DEMO_DATA) {
      throw new Error('window.DEMO_DATA not found — ensure data/demo-data.js is loaded before prototype-api.js');
    }
    return window.DEMO_DATA;
  }

  function normalize(state, seed) {
    // Backfill any fields missing from a previously-saved (older-schema) state,
    // so schema changes during development don't crash pages reading stale localStorage.
    state.currentUser = state.currentUser || seed.currentUser;
    state.isbnCatalog = state.isbnCatalog || seed.isbnCatalog;
    state.conditionPresets = state.conditionPresets || seed.conditionPresets;
    state.listings = state.listings || [];
    state.queue = state.queue || [];
    return state;
  }

  async function getState() {
    const seed = loadSeed();
    const existing = localStorage.getItem(STORAGE_KEY);
    const state = normalize(existing ? JSON.parse(existing) : {}, seed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }

  async function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  async function getUser() {
    const state = await getState();
    return state.currentUser;
  }

  async function authenticate(method) {
    const state = await getState();
    state.currentUser.authenticated = true;
    state.currentUser.authMethod = method;
    await saveState(state);
    return state.currentUser;
  }

  async function lookupIsbn(isbn) {
    const state = await getState();
    return state.isbnCatalog.find((b) => b.isbn === isbn.replace(/[^0-9Xx]/g, '')) || null;
  }

  async function getConditionPresets() {
    const state = await getState();
    return state.conditionPresets;
  }

  async function submitListings(books) {
    const state = await getState();
    const newListings = books.map((b, i) => ({
      id: `listing-${Date.now()}-${i}`,
      ...b,
      status: 'Live',
      createdAt: new Date().toISOString(),
    }));
    state.listings = state.listings.concat(newListings);
    await saveState(state);
    return newListings;
  }

  async function getListings() {
    const state = await getState();
    return state.listings;
  }

  async function getQueue() {
    const state = await getState();
    return state.queue;
  }

  async function addToQueue(item) {
    const state = await getState();
    state.queue.push({ id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...item });
    await saveState(state);
    return state.queue;
  }

  async function updateQueueItem(id, updates) {
    const state = await getState();
    const item = state.queue.find((q) => q.id === id);
    if (item) Object.assign(item, updates);
    await saveState(state);
    return state.queue;
  }

  async function removeFromQueue(id) {
    const state = await getState();
    state.queue = state.queue.filter((q) => q.id !== id);
    await saveState(state);
    return state.queue;
  }

  async function clearQueue() {
    const state = await getState();
    state.queue = [];
    await saveState(state);
  }

  async function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    getUser,
    authenticate,
    lookupIsbn,
    getConditionPresets,
    submitListings,
    getListings,
    getQueue,
    addToQueue,
    updateQueueItem,
    removeFromQueue,
    clearQueue,
    reset,
  };
})();
