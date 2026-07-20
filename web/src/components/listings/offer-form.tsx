"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { lookupIsbn, type BookLookupResult } from "@/lib/books/lookup";

type Condition = "Good" | "Fair" | "Worn";
const CONDITIONS: Condition[] = ["Good", "Fair", "Worn"];

export function OfferForm({
  targetListingId,
  targetOwnerId,
  userId,
}: {
  targetListingId: string;
  targetOwnerId: string;
  userId: string;
}) {
  const router = useRouter();
  const [isbnInput, setIsbnInput] = useState("");
  const [book, setBook] = useState<BookLookupResult | null>(null);
  const [condition, setCondition] = useState<Condition>("Good");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [tradeId, setTradeId] = useState<string | null>(null);

  async function handleScan() {
    const trimmed = isbnInput.trim();
    setScanError(null);
    if (!trimmed) return;

    setScanning(true);
    try {
      const result = await lookupIsbn(trimmed);
      if (!result) {
        setScanError("Couldn't find that ISBN — check it and try again.");
        return;
      }
      setBook(result);
    } catch {
      setScanError("Something went wrong looking that up — try again.");
    } finally {
      setScanning(false);
    }
  }

  async function handleSend() {
    if (!book) return;
    setSendError(null);
    setSending(true);

    const supabase = createClient();

    try {
      let photoPath: string | null = null;
      if (photoFile) {
        const ext = photoFile.name.split(".").pop() || "jpg";
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("listing-photos")
          .upload(path, photoFile, { upsert: true });
        if (uploadError) throw uploadError;
        photoPath = path;
      }

      const { data: newListing, error: insertError } = await supabase
        .from("listings")
        .insert({
          owner_id: userId,
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          cover_url: book.coverUrl,
          photo_path: photoPath,
          condition,
          description: description.trim() || null,
          status: "live",
          offered_for_listing_id: targetListingId,
        })
        .select("id")
        .single();
      if (insertError) throw insertError;

      const { data: trade, error: tradeError } = await supabase
        .from("trades")
        .insert({
          listing_id: targetListingId,
          offered_listing_id: newListing.id,
          requester_id: userId,
          owner_id: targetOwnerId,
          offer_type: "exchange",
        })
        .select("id")
        .single();
      if (tradeError) throw tradeError;

      setTradeId(trade.id);
      setSent(true);
    } catch {
      setSendError("Something went wrong sending your request — try again.");
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div
        id="create-listing-sent-confirmation"
        data-object-id="create-listing-sent-confirmation"
        className="py-8 text-center"
      >
        <p className="mb-2 text-xl font-bold text-gray-900">
          ✓ Request sent!
        </p>
        <p className="mb-4 text-sm text-gray-500">
          Waiting for a response.
        </p>
        <div className="flex flex-col items-center gap-2">
          {tradeId && (
            <button
              type="button"
              onClick={() => router.push(`/trades/${tradeId}`)}
              className="text-sm font-medium text-bookswap-600 hover:text-bookswap-700"
            >
              View trade →
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/listings")}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Go to my listings →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm text-gray-600">
        Scan your book&apos;s barcode, or enter the ISBN (no camera in this
        prototype).
      </p>
      <div className="mb-4 flex gap-2">
        <input
          id="create-listing-isbn-input"
          data-object-id="create-listing-isbn-input"
          type="text"
          value={isbnInput}
          disabled={scanning || !!book}
          onChange={(e) => setIsbnInput(e.target.value)}
          placeholder="Enter ISBN"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-bookswap-500 disabled:opacity-50"
        />
        <button
          id="create-listing-scan-btn"
          data-object-id="create-listing-scan-btn"
          type="button"
          disabled={scanning || !!book}
          onClick={handleScan}
          className="rounded-lg bg-bookswap-600 px-4 py-2 font-medium text-white transition-colors hover:bg-bookswap-700 disabled:opacity-50"
        >
          {scanning ? "Looking up…" : "Add"}
        </button>
      </div>

      {scanError && (
        <p className="mb-4 text-sm text-red-600">{scanError}</p>
      )}

      {book && (
        <div
          id="create-listing-book-card"
          data-object-id="create-listing-book-card"
          className="mb-6 rounded-lg border border-gray-200 bg-white p-3"
        >
          <p className="font-medium text-gray-900">{book.title}</p>
          <p className="mb-3 text-sm text-gray-500">{book.author}</p>

          <select
            id="create-listing-condition"
            data-object-id="create-listing-condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value as Condition)}
            className="mb-3 rounded border border-gray-300 px-2 py-1 text-sm"
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any notes about your copy? (optional)"
            rows={2}
            className="mb-3 w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />

          <label className="inline-block cursor-pointer rounded border border-gray-300 px-2 py-1 text-sm text-gray-600">
            {photoFile ? `✓ ${photoFile.name}` : "Add photo"}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      )}

      {sendError && <p className="mb-2 text-sm text-red-600">{sendError}</p>}

      <button
        id="create-listing-send-btn"
        data-object-id="create-listing-send-btn"
        type="button"
        disabled={!book || sending}
        onClick={handleSend}
        className="w-full rounded-lg bg-bookswap-600 py-3 font-semibold text-white transition-colors hover:bg-bookswap-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Sending…" : "Send trade request"}
      </button>
    </div>
  );
}
