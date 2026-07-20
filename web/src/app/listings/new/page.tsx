import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BatchListingForm } from "@/components/listings/batch-listing-form";

export default async function NewListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/listings/new");
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="mx-auto max-w-lg px-4 py-6">
        <BatchListingForm userId={user.id} />
      </div>
    </main>
  );
}
