import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SignOutButton() {
  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
  };

  return (
    <div className="flex items-center gap-4">
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-white hover:bg-gray-200 text-black space-y-2 font-medium">
          Salir
        </button>
      </form>
    </div>
  );
}
