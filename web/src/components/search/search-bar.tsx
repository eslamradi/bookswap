"use client";

import { useRouter } from "next/navigation";

export function SearchBar() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("q");
    const trimmed = typeof query === "string" ? query.trim() : "";
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        id="home-search-input"
        data-object-id="home-search-input"
        name="q"
        type="text"
        // Deliberate: the search bar is the dominant, immediately-actionable
        // element on this page per spec, for a persona arriving already
        // knowing what to search.
        autoFocus
        placeholder="Search title or ISBN"
        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-bookswap-500"
      />
    </form>
  );
}
