"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ExchangeMethod = "meetup" | "self_arranged" | null;

export function AccountSettingsForm({
  email,
  initialDisplayName,
  initialExchangeMethod,
}: {
  email: string;
  initialDisplayName: string;
  initialExchangeMethod: ExchangeMethod;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [exchangeMethod, setExchangeMethod] =
    useState<ExchangeMethod>(initialExchangeMethod);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        preferred_exchange_method: exchangeMethod,
      })
      .eq("id", user.id);

    setSaving(false);
    if (!error) {
      setSaved(true);
      router.refresh();
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-1 text-xs text-gray-500">Email</p>
        <p className="text-sm text-gray-900">{email}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <label className="mb-1 block text-sm font-medium text-gray-900">
          Display name
        </label>
        <input
          id="account-display-name"
          data-object-id="account-display-name"
          type="text"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
            setSaved(false);
          }}
          placeholder="How other users see you"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-bookswap-500"
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-3 text-sm font-medium text-gray-900">
          Preferred exchange method
        </p>
        <p className="mb-3 text-xs text-gray-500">
          A head start for future trades — not required, and not yet
          automatically applied at handoff time.
        </p>
        <div className="space-y-2">
          {(
            [
              { value: "meetup", label: "Meet in a public place" },
              { value: "self_arranged", label: "Arrange mailing myself" },
              { value: null, label: "No preference" },
            ] as const
          ).map((option) => (
            <label
              key={option.label}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="radio"
                name="exchangeMethod"
                checked={exchangeMethod === option.value}
                onChange={() => {
                  setExchangeMethod(option.value);
                  setSaved(false);
                }}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <button
        id="account-save-btn"
        data-object-id="account-save-btn"
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="w-full rounded-lg bg-bookswap-600 py-3 font-semibold text-white transition-colors hover:bg-bookswap-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : saved ? "✓ Saved" : "Save changes"}
      </button>

      <button
        id="account-sign-out-btn"
        data-object-id="account-sign-out-btn"
        type="button"
        disabled={signingOut}
        onClick={handleSignOut}
        className="w-full rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}
