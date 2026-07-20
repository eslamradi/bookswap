/**
 * Demo seed data — loaded as a plain script (not fetch) so the prototype
 * works when opened directly via file:// (no local server required).
 * fetch() of a local JSON file is blocked by CORS under file://; this avoids that entirely.
 */
window.DEMO_DATA = {
  currentUser: {
    id: "user-tom-demo",
    firstName: "Tom",
    lastName: "Reyes",
    email: "tom.reyes@example.com",
    authenticated: false
  },
  isbnCatalog: [
    { isbn: "9780143127550", title: "The Goldfinch", author: "Donna Tartt", coverUrl: "assets/covers/goldfinch.jpg" },
    { isbn: "9780062316097", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", coverUrl: "assets/covers/sapiens.jpg" },
    { isbn: "9780307474278", title: "The Da Vinci Code", author: "Dan Brown", coverUrl: "assets/covers/davinci.jpg" },
    { isbn: "9780451524935", title: "1984", author: "George Orwell", coverUrl: "assets/covers/1984.jpg" },
    { isbn: "9780544003415", title: "The Lord of the Rings", author: "J.R.R. Tolkien", coverUrl: "assets/covers/lotr.jpg" },
    { isbn: "9780679783268", title: "Pride and Prejudice", author: "Jane Austen", coverUrl: "assets/covers/pride.jpg" },
    { isbn: "9780316769488", title: "The Catcher in the Rye", author: "J.D. Salinger", coverUrl: "assets/covers/catcher.jpg" },
    { isbn: "9780061120084", title: "To Kill a Mockingbird", author: "Harper Lee", coverUrl: "assets/covers/mockingbird.jpg" }
  ],
  conditionPresets: ["Good", "Fair", "Worn"]
};
