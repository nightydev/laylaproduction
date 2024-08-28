import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CitizenForm from "./form";
import CitizenSearch from './search';

export default async function CitizenPage() {
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
    <div className="flex justify-center items-center h-full">
      <div className="pt-10 w-full h-full">
        <CitizenSearch />
      </div>
      <div className="flex items-center justify-center w-full h-full">
        <CitizenForm />
      </div>
    </div>
  )
}
