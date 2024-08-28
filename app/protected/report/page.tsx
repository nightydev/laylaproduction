import Report from "./Report";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ReportPage() {
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
    <Report />
  );
}