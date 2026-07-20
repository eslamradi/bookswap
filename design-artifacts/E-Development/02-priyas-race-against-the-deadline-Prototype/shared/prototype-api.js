/**
 * Prototype API — simulates a backend using localStorage, seeded from data/demo-data.js.
 * Static prototype only. Not production code.
 */
window.PrototypeAPI = (function () {
  const STORAGE_KEY = 'bookswap_scenario02_prototype_state';

  function loadSeed() {
    if (!window.DEMO_DATA) {
      throw new Error('window.DEMO_DATA not found — ensure data/demo-data.js is loaded before prototype-api.js');
    }
    return window.DEMO_DATA;
  }

  function normalize(state, seed) {
    // Backfill missing fields against the seed shape on every load — schema can
    // evolve mid-session as pages are built. See agent-experiences lesson.
    state.currentUser = state.currentUser || seed.currentUser;
    state.listings = state.listings || seed.listings;
    state.targetSearchTitle = state.targetSearchTitle || seed.targetSearchTitle;
    state.alerts = state.alerts || [];
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

  async function search(query) {
    const state = await getState();
    const q = query.trim().toLowerCase();
    return state.listings.filter(
      (l) => l.title.toLowerCase().includes(q) || l.author.toLowerCase().includes(q)
    );
  }

  async function createAlert(query) {
    const state = await getState();
    const alert = {
      id: `alert-${Date.now()}`,
      query,
      channel: 'Push + Email',
      createdAt: new Date().toISOString(),
    };
    state.alerts.push(alert);
    await saveState(state);
    return alert;
  }

  async function getAlerts() {
    const state = await getState();
    return state.alerts;
  }

  async function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    getUser,
    search,
    createAlert,
    getAlerts,
    reset,
  };
})();
