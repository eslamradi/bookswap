window.PrototypeAPI = (function () {
  const STORAGE_KEY = 'bookswap_scenario05_prototype_state';

  function loadSeed() {
    if (!window.DEMO_DATA) {
      throw new Error('window.DEMO_DATA not found — ensure data/demo-data.js is loaded before prototype-api.js');
    }
    return window.DEMO_DATA;
  }

  function normalize(state, seed) {
    state.currentUser = state.currentUser || seed.currentUser;
    state.privacySettings = state.privacySettings || seed.privacySettings;
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

  async function getPrivacySettings() {
    const state = await getState();
    return state.privacySettings;
  }

  async function updatePrivacySettings(updates) {
    const state = await getState();
    Object.assign(state.privacySettings, updates);
    await saveState(state);
    return state.privacySettings;
  }

  async function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { getUser, getPrivacySettings, updatePrivacySettings, reset };
})();
