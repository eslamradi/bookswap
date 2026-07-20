/**
 * Prototype API — simulates a backend using localStorage, seeded from data/demo-data.js.
 * Static prototype only. Not production code.
 */
window.PrototypeAPI = (function () {
  const STORAGE_KEY = 'bookswap_scenario03_prototype_state';

  function loadSeed() {
    if (!window.DEMO_DATA) {
      throw new Error('window.DEMO_DATA not found — ensure data/demo-data.js is loaded before prototype-api.js');
    }
    return window.DEMO_DATA;
  }

  function normalize(state, seed) {
    state.currentUser = state.currentUser || seed.currentUser;
    state.browseListings = state.browseListings || seed.browseListings;
    state.listers = state.listers || seed.listers;
    state.isbnCatalog = state.isbnCatalog || seed.isbnCatalog;
    state.tradeRequests = state.tradeRequests || [];
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

  async function getBrowseListings(genre) {
    const state = await getState();
    if (!genre || genre === 'all') return state.browseListings;
    return state.browseListings.filter((l) => l.genre === genre);
  }

  async function getListing(id) {
    const state = await getState();
    return state.browseListings.find((l) => l.id === id) || null;
  }

  async function getLister(id) {
    const state = await getState();
    return state.listers[id] || null;
  }

  async function lookupIsbn(isbn) {
    const state = await getState();
    return state.isbnCatalog.find((b) => b.isbn === isbn.replace(/[^0-9Xx]/g, '')) || null;
  }

  async function sendTradeRequest(listingId, offeredBook) {
    const state = await getState();
    const request = {
      id: `trade-${Date.now()}`,
      listingId,
      offeredBook,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    state.tradeRequests.push(request);
    await saveState(state);
    return request;
  }

  async function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    getUser,
    getBrowseListings,
    getListing,
    getLister,
    lookupIsbn,
    sendTradeRequest,
    reset,
  };
})();
