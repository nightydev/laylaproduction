import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Form from "./Form";


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
    <div>
      <Form />
    </div>
  )
}
