"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { lookupIsbn } from "@/lib/books/lookup";

type Condition = "Good" | "Fair" | "Worn";

type QueueItem = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  coverUrl: string | null;
  condition: Condition;
  photoFile: File | null;
  photoFileName: string | null;
};

// Persisted (metadata only — File objects can't survive localStorage). If
// the tab is refreshed mid-batch, book details survive; photos would need
// re-attaching. Disclosed tradeoff — see docs/dev-notes/1.2-batch-listing.md.
type PersistedItem = Omit<QueueItem, "photoFile" | "photoFileName">;

const CONDITIONS: Condition[] = ["Good", "Fair", "Worn"];

function storageKey(userId: string) {
  return `bookswap_batch_queue_${userId}`;
}

export function BatchListingForm({ userId }: { userId: string }) {
  const router = useRouter();
  // null = not yet hydrated from localStorage (still matches server-rendered
  // empty state, avoiding a hydration mismatch); array = hydrated, real queue.
  const [queue, setQueue] = useState<QueueItem[] | null>(null);
  const [isbnInput, setIsbnInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // One-time read of localStorage on mount (not a subscription — nothing
  // else mutates this key while the tab is open, so this isn't the
  // derived-state pattern react-hooks/set-state-in-effect warns about).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) {
      setQueue([]);
      return;
    }
    try {
      const persisted: PersistedItem[] = JSON.parse(raw);
      setQueue(
        persisted.map((item) => ({
          ...item,
          photoFile: null,
          photoFileName: null,
        })),
      );
    } catch {
      // Corrupt localStorage value — ignore, start with an empty queue.
      setQueue([]);
    }
  }, [userId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Mirror metadata to localStorage on every change (skipped before
  // hydration completes, so we don't overwrite a just-restored queue).
  useEffect(() => {
    if (queue === null) return;
    const persisted: PersistedItem[] = queue.map((item) => ({
      id: item.id,
      isbn: item.isbn,
      title: item.title,
      author: item.author,
      coverUrl: item.coverUrl,
      condition: item.condition,
    }));
    localStorage.setItem(storageKey(userId), JSON.stringify(persisted));
  }, [queue, userId]);

  const items = queue ?? [];

  async function handleAdd() {
    const trimmed = isbnInput.trim();
    setScanError(null);
    if (!trimmed) return;

    setScanning(true);
    try {
      const result = await lookupIsbn(trimmed);
      if (!result) {
        setScanError(
          "Couldn't find that ISBN — check it and try again, or try a different edition.",
        );
        return;
      }

      setQueue((prev) => [
        ...(prev ?? []),
        {
          id: crypto.randomUUID(),
          isbn: result.isbn,
          title: result.title,
          author: result.author,
          coverUrl: result.coverUrl,
          condition: "Good",
          photoFile: null,
          photoFileName: null,
        },
      ]);
      setIsbnInput("");
    } catch {
      setScanError("Something went wrong looking that up — try again.");
    } finally {
      setScanning(false);
    }
  }

  function updateCondition(id: string, condition: Condition) {
    setQueue((prev) =>
      (prev ?? []).map((item) =>
        item.id === id ? { ...item, condition } : item,
      ),
    );
  }

  function attachPhoto(id: string, file: File | null) {
    setQueue((prev) =>
      (prev ?? []).map((item) =>
        item.id === id
          ? { ...item, photoFile: file, photoFileName: file?.name ?? null }
          : item,
      ),
    );
  }

  function removeItem(id: string) {
    setQueue((prev) => (prev ?? []).filter((item) => item.id !== id));
  }

  async function handleSubmit() {
    if (items.length === 0) return;
    setSubmitError(null);
    setSubmitting(true);

    const supabase = createClient();

    try {
      const rows = [];
      for (const item of items) {
        let photoPath: string | null = null;

        if (item.photoFile) {
          const ext = item.photoFile.name.split(".").pop() || "jpg";
          const path = `${userId}/${item.id}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from("listing-photos")
            .upload(path, item.photoFile, { upsert: true });
          if (uploadError) throw uploadError;
          photoPath = path;
        }

        rows.push({
          owner_id: userId,
          isbn: item.isbn,
          title: item.title,
          author: item.author,
          cover_url: item.coverUrl,
          photo_path: photoPath,
          condition: item.condition,
          status: "live",
        });
      }

      const { error: insertError } = await supabase
        .from("listings")
        .insert(rows);
      if (insertError) throw insertError;

      localStorage.removeItem(storageKey(userId));
      router.push("/listings");
    } catch {
      // Queue is intentionally left intact on failure — Tom's top fear is
      // losing his in-progress work, so a failed submit must not clear it.
      setSubmitError(
        "Something went wrong submitting your books — your queue is safe, try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Enter each book&apos;s ISBN — no camera scanning yet, type or
          paste it.
        </p>
        <span
          id="batch-listing-count"
          data-object-id="batch-listing-count"
          className="whitespace-nowrap text-sm font-medium text-gray-900"
        >
          {items.length} book{items.length === 1 ? "" : "s"} added
        </span>
      </div>

      <div className="mb-2 flex gap-2">
        <input
          id="batch-listing-isbn-input"
          data-object-id="batch-listing-isbn-input"
          type="text"
          value={isbnInput}
          disabled={scanning}
          onChange={(e) => setIsbnInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Enter ISBN"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-bookswap-500 disabled:opacity-50"
        />
        <button
          id="batch-listing-scan-btn"
          data-object-id="batch-listing-scan-btn"
          type="button"
          disabled={scanning}
          onClick={handleAdd}
          className="rounded-lg bg-bookswap-600 px-4 py-2 font-medium text-white transition-colors hover:bg-bookswap-700 disabled:opacity-50"
        >
          {scanning ? "Looking up…" : "Add"}
        </button>
      </div>

      {scanError && (
        <p
          id="batch-listing-scan-error"
          data-object-id="batch-listing-scan-error"
          className="mb-4 text-sm text-red-600"
        >
          {scanError}
        </p>
      )}

      <div
        id="batch-listing-queue"
        data-object-id="batch-listing-queue"
        className="mb-6 space-y-3"
      >
        {items.map((item) => (
          <div
            key={item.id}
            id={`batch-listing-card-${item.id}`}
            data-object-id={`batch-listing-card-${item.id}`}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
          >
            <div className="flex h-16 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-gray-100 text-xs text-gray-400">
              {item.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.coverUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                "cover"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900">
                {item.title}
              </p>
              <p className="truncate text-sm text-gray-500">{item.author}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select
                  id={`batch-listing-condition-${item.id}`}
                  data-object-id={`batch-listing-condition-${item.id}`}
                  value={item.condition}
                  onChange={(e) =>
                    updateCondition(item.id, e.target.value as Condition)
                  }
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <label
                  id={`batch-listing-photo-${item.id}`}
                  data-object-id={`batch-listing-photo-${item.id}`}
                  className={`cursor-pointer rounded border px-2 py-1 text-sm ${
                    item.photoFileName
                      ? "border-green-300 bg-green-50 text-green-700"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  {item.photoFileName ? "✓ Photo attached" : "Add photo"}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) =>
                      attachPhoto(item.id, e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>
            </div>
            <button
              id={`batch-listing-remove-${item.id}`}
              data-object-id={`batch-listing-remove-${item.id}`}
              type="button"
              onClick={() => removeItem(item.id)}
              aria-label="Remove"
              className="flex-shrink-0 text-gray-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <p
            id="batch-listing-empty-hint"
            className="py-8 text-center text-sm text-gray-400"
          >
            No books added yet — enter an ISBN above to get started.
          </p>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white p-4">
        <div className="mx-auto max-w-lg">
          {submitError && (
            <p
              id="batch-listing-submit-error"
              data-object-id="batch-listing-submit-error"
              className="mb-2 text-center text-sm text-red-600"
            >
              {submitError}
            </p>
          )}
          <button
            id="batch-listing-submit-btn"
            data-object-id="batch-listing-submit-btn"
            type="button"
            disabled={items.length === 0 || submitting}
            onClick={handleSubmit}
            className="w-full rounded-lg bg-bookswap-600 py-3 font-semibold text-white transition-colors hover:bg-bookswap-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Listing…"
              : `List all ${items.length} book${items.length === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>
    </div>
  );
}
