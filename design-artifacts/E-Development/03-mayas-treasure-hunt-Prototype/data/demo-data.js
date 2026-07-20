/**
 * Demo seed data — script-loaded (not fetched) to avoid file:// CORS issues.
 * See _progress/agent-experiences/2026-07-13-prototype-file-cors-fix.md.
 */
window.DEMO_DATA = {
  currentUser: {
    id: "user-maya-demo",
    firstName: "Maya",
    lastName: "Chen",
    email: "maya.chen@example.com",
    authenticated: true
  },
  browseListings: [
    {
      id: "browse-1",
      title: "Piranesi",
      author: "Susanna Clarke",
      genre: "Fantasy",
      condition: "Good",
      description: "Loved this one — strange and beautiful. A little water damage on the back cover, nothing on the pages.",
      listerId: "lister-1"
    },
    {
      id: "browse-2",
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      genre: "Sci-Fi",
      condition: "Fair",
      description: "Read once, some highlighting in chapter 3. Spine is a bit creased.",
      listerId: "lister-2"
    },
    {
      id: "browse-3",
      title: "The Song of Achilles",
      author: "Madeline Miller",
      genre: "Historical Fiction",
      condition: "Good",
      description: "Barely touched, practically new. Smoke-free home.",
      listerId: "lister-1"
    }
  ],
  listers: {
    "lister-1": {
      id: "lister-1",
      name: "Jordan P.",
      rating: 4.8,
      tradeCount: 24,
      memberSince: "2025",
      reviews: [
        { rating: 5, comment: "Fast shipper, book exactly as described" },
        { rating: 5, comment: "Great trade, would swap again" }
      ]
    },
    "lister-2": {
      id: "lister-2",
      name: "Sam R.",
      rating: 0,
      tradeCount: 0,
      memberSince: "2026",
      reviews: []
    }
  },
  isbnCatalog: [
    { isbn: "9780143127550", title: "The Goldfinch", author: "Donna Tartt" },
    { isbn: "9780062316097", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari" },
    { isbn: "9780451524935", title: "1984", author: "George Orwell" }
  ]
};
