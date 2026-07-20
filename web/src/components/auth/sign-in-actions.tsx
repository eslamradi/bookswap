"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_REDIRECT_PATH } from "@/lib/auth/constants";

type AuthMethod = "google" | "apple" | "email";

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function SignInActions({
  initialError,
  next = DEFAULT_REDIRECT_PATH,
}: {
  initialError?: string;
  next?: string;
}) {
  const [loadingMethod, setLoadingMethod] = useState<AuthMethod | null>(null);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const anyLoading = loadingMethod !== null;
  const redirectTo = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function handleOAuth(provider: "google" | "apple") {
    setError(null);
    setLoadingMethod(provider);

    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: redirectTo() },
      });

      // On success the browser navigates away to the provider's consent
      // screen, so we only ever reach this line on failure.
      if (oauthError) {
        setError("Something went wrong — try again");
        setLoadingMethod(null);
      }
    } catch {
      // createClient() throws synchronously if Supabase isn't configured
      // (missing/invalid env vars) — must still land in the error state,
      // not leave the button stuck loading forever.
      setError("Something went wrong — try again");
      setLoadingMethod(null);
    }
  }

  async function handleEmailContinue() {
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email to continue");
      return;
    }

    setLoadingMethod("email");

    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: { emailRedirectTo: redirectTo() },
      });

      if (otpError) {
        setError("Something went wrong — try again");
        return;
      }

      setMagicLinkSent(true);
    } catch {
      setError("Something went wrong — try again");
    } finally {
      setLoadingMethod(null);
    }
  }

  if (magicLinkSent) {
    return (
      <div
        id="signup-login-check-email"
        data-object-id="signup-login-check-email"
        className="text-center"
      >
        <p className="font-medium text-gray-900">Check your email</p>
        <p className="mt-1 text-sm text-gray-500">
          We sent a sign-in link to {email}.
        </p>
        <button
          type="button"
          onClick={() => setMagicLinkSent(false)}
          className="mt-4 text-sm font-medium text-bookswap-600 hover:text-bookswap-700"
        >
          Try another way
        </button>
      </div>
    );
  }

  return (
    <div
      id="signup-login-auth-section"
      data-object-id="signup-login-auth-section"
      className="space-y-3"
    >
      <button
        id="signup-login-btn-google"
        data-object-id="signup-login-btn-google"
        type="button"
        disabled={anyLoading}
        onClick={() => handleOAuth("google")}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        <span>Continue with Google</span>
        {loadingMethod === "google" && <Spinner />}
      </button>

      <button
        id="signup-login-btn-apple"
        data-object-id="signup-login-btn-apple"
        type="button"
        disabled={anyLoading}
        onClick={() => handleOAuth("apple")}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
      >
        <span>Continue with Apple</span>
        {loadingMethod === "apple" && <Spinner />}
      </button>

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-gray-200" />
        <span
          id="signup-login-divider"
          data-object-id="signup-login-divider"
          className="text-xs text-gray-400"
        >
          or
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <input
        id="signup-login-input-email"
        data-object-id="signup-login-input-email"
        type="email"
        value={email}
        disabled={anyLoading}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-bookswap-500 disabled:opacity-50"
      />

      <button
        id="signup-login-btn-email"
        data-object-id="signup-login-btn-email"
        type="button"
        disabled={anyLoading}
        onClick={handleEmailContinue}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-bookswap-600 py-3 font-semibold text-white transition-colors hover:bg-bookswap-700 disabled:opacity-50"
      >
        <span>Continue</span>
        {loadingMethod === "email" && <Spinner />}
      </button>

      {error && (
        <p
          id="signup-login-error"
          data-object-id="signup-login-error"
          className="text-center text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
