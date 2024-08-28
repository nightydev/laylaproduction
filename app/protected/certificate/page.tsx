import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CertificateForm from "./form";

export default async function CertificatePage() {
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
    <CertificateForm />
  );
}
