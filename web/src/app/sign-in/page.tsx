import { SignInActions } from "@/components/auth/sign-in-actions";
import { DEFAULT_REDIRECT_PATH } from "@/lib/auth/constants";

// Deliberately minimal — no marketing chrome, no search bar. Moved here
// from `/` when `/` became the public search home (Scenario 02); this page
// still gets linked to from anywhere an unauthenticated visitor needs to
// sign in, via ?next=<where-to-return-to>.
export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ auth_error?: string; next?: string }>;
}) {
  const { auth_error, next } = await searchParams;

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-4">
      <div
        id="signup-login-container"
        data-object-id="signup-login-container"
        className="w-full max-w-sm"
      >
        <header className="mb-8 text-center">
          <div
            id="signup-login-logo"
            data-object-id="signup-login-logo"
            className="mb-6 text-lg font-semibold text-gray-900"
          >
            bookswap
          </div>
          <h1
            id="signup-login-headline"
            data-object-id="signup-login-headline"
            className="text-2xl font-bold text-gray-900"
          >
            Get your books gone in minutes
          </h1>
        </header>

        <SignInActions
          initialError={auth_error}
          next={next ?? DEFAULT_REDIRECT_PATH}
        />
      </div>
    </main>
  );
}
