import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountSettingsForm } from "@/components/account/account-settings-form";
import { AppHeader } from "@/components/layout/app-header";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/account");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, preferred_exchange_method")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader />

      <div className="mx-auto max-w-lg px-4 py-6">
        <h1 className="mb-6 text-lg font-semibold text-gray-900">
          Account settings
        </h1>

        <AccountSettingsForm
          email={user.email ?? ""}
          initialDisplayName={profile?.display_name ?? ""}
          initialExchangeMethod={profile?.preferred_exchange_method ?? null}
        />
      </div>
    </main>
  );
}
