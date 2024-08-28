import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName = '';
  if (user) {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
    } else {
      fullName = profile.full_name;
    }
  }

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
  };

  return user ? (
    <div className="flex items-center gap-4">
      <div className="bg-gray-100 rounded-lg shadow-inner p-2">
      {fullName}
      </div>
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-black hover:bg-gray-800 text-white">
          Cerrar Sesión
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-black hover:bg-gray-800 text-white"
    >
      Usuario
    </Link>
  );
}
