import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateUserForm from "./CreateUserForm";

export default async function CreatePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  if (!(user.email === "admin@gmail.com")) {
    await supabase.auth.signOut();
    return redirect("/");
  }

  return (
    <>
      <CreateUserForm />
    </>
  );
}