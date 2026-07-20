/**
 * Prototype API — simulates a backend using localStorage, seeded from data/demo-data.js.
 * Static prototype only. Not production code.
 */
window.PrototypeAPI = (function () {
  const STORAGE_KEY = 'bookswap_scenario04_prototype_state';

  function loadSeed() {
    if (!window.DEMO_DATA) {
      throw new Error('window.DEMO_DATA not found — ensure data/demo-data.js is loaded before prototype-api.js');
    }
    return window.DEMO_DATA;
  }

  function normalize(state, seed) {
    state.currentUser = state.currentUser || seed.currentUser;
    state.trade = state.trade || seed.trade;
    state.trackingStages = state.trackingStages || seed.trackingStages;
    state.messages = state.messages || seed.messages;
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

  async function getTrade() {
    const state = await getState();
    return state.trade;
  }

  async function acceptTrade() {
    const state = await getState();
    state.trade.accepted = true;
    await saveState(state);
    return state.trade;
  }

  async function getMessages() {
    const state = await getState();
    return state.messages;
  }

  async function sendMessage(text, from) {
    const state = await getState();
    state.messages.push({ id: `msg-${Date.now()}`, text, from, at: new Date().toISOString() });
    await saveState(state);
    return state.messages;
  }

  async function confirmCheckout() {
    const state = await getState();
    state.trade.paymentConfirmed = true;
    await saveState(state);
    return state.trade;
  }

  async function generateShippingLabel() {
    const state = await getState();
    state.trade.labelGenerated = true;
    state.trade.trackingStageIndex = 0;
    await saveState(state);
    return state.trade;
  }

  async function getTrackingStages() {
    const state = await getState();
    return state.trackingStages;
  }

  async function advanceTracking() {
    const state = await getState();
    const max = state.trackingStages.length - 1;
    state.trade.trackingStageIndex = Math.min(state.trade.trackingStageIndex + 1, max);
    await saveState(state);
    return state.trade;
  }

  async function submitRating(rating, comment) {
    const state = await getState();
    state.trade.ratingGiven = { rating, comment, at: new Date().toISOString() };
    await saveState(state);
    return state.trade;
  }

  async function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    getUser,
    getTrade,
    acceptTrade,
    getMessages,
    sendMessage,
    confirmCheckout,
    generateShippingLabel,
    getTrackingStages,
    advanceTracking,
    submitRating,
    reset,
  };
})();
