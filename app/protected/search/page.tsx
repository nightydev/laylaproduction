import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Search from "./Search";

export default async function SearchPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  if (user.email === "admin@gmail.com") {
    await supabase.auth.signOut();
    return redirect("/");
  }

  return (
    <>
      <Search />
    </>
  );
}