"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function RatingForm({
  tradeId,
  raterId,
  rateeId,
  rateeName,
  alreadyRated,
  needsCompletion,
}: {
  tradeId: string;
  raterId: string;
  rateeId: string;
  rateeName: string;
  alreadyRated: boolean;
  needsCompletion: boolean;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(alreadyRated);

  async function handleSubmit() {
    if (rating === 0) return;
    setSubmitting(true);

    const supabase = createClient();

    try {
      if (needsCompletion) {
        const { error: completeError } = await supabase
          .from("trades")
          .update({ status: "completed" })
          .eq("id", tradeId);
        if (completeError) throw completeError;
      }

      const { error: ratingError } = await supabase.from("ratings").insert({
        trade_id: tradeId,
        rater_id: raterId,
        ratee_id: rateeId,
        rating,
        comment: comment.trim() || null,
      });
      if (ratingError) throw ratingError;

      setSubmitted(true);
    } catch {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        id="rating-submitted-confirmation"
        data-object-id="rating-submitted-confirmation"
        className="py-8 text-center"
      >
        <p className="text-lg font-semibold text-gray-900">
          ✓ Thanks for rating!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        id="rating-input-section"
        data-object-id="rating-input-section"
        className="rounded-lg border border-gray-200 bg-white p-4"
      >
        <p className="mb-3 text-sm text-gray-600">Rate {rateeName}:</p>
        <div id="rating-stars" data-object-id="rating-stars" className="mb-3 flex gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={value <= rating ? "text-yellow-500" : "text-gray-300"}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          id="rating-comment"
          data-object-id="rating-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional comment..."
          rows={2}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bookswap-500"
        />
      </div>

      <button
        id="rating-submit-btn"
        data-object-id="rating-submit-btn"
        type="button"
        disabled={rating === 0 || submitting}
        onClick={handleSubmit}
        className="mt-4 w-full rounded-lg bg-bookswap-600 py-3 font-semibold text-white transition-colors hover:bg-bookswap-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit rating
      </button>
    </div>
  );
}
