/**
 * Demo seed data — script-loaded (not fetched) to avoid file:// CORS issues.
 * See _progress/agent-experiences/2026-07-13-prototype-file-cors-fix.md.
 */
window.DEMO_DATA = {
  currentUser: {
    id: "user-tom-demo",
    firstName: "Tom",
    lastName: "Reyes",
    authenticated: true
  },
  trade: {
    id: "trade-demo-1",
    book: { title: "1984", author: "George Orwell" },
    offerType: "exchange", // "exchange" | "sale"
    price: null,
    counterpart: { id: "counterpart-1", name: "Alex M.", rating: 4.6, tradeCount: 12 },
    accepted: false,
    paymentConfirmed: false,
    labelGenerated: false,
    trackingStageIndex: -1,
    ratingGiven: null
  },
  trackingStages: ["Awaiting drop-off", "In transit", "Delivered"],
  messages: []
};
