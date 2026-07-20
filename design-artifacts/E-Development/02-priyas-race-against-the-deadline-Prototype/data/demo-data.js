/**
 * Demo seed data — script-loaded (not fetched) to avoid file:// CORS issues.
 * See _progress/agent-experiences/2026-07-13-prototype-file-cors-fix.md for why.
 */
window.DEMO_DATA = {
  currentUser: {
    id: "user-priya-demo",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@example.com",
    authenticated: true
  },
  // Existing marketplace listings — searchable. Deliberately does NOT include
  // "Intro to Psychology, 3rd Edition" so that search demonstrates the
  // no-exact-match + notify-me sunshine path this scenario is built around.
  listings: [
    { id: "listing-1", title: "The Goldfinch", author: "Donna Tartt", condition: "Good" },
    { id: "listing-2", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", condition: "Fair" },
    { id: "listing-3", title: "1984", author: "George Orwell", condition: "Good" }
  ],
  targetSearchTitle: "Intro to Psychology, 3rd Edition",
  alerts: []
};
