import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import List from "./List";

interface User {
  created_at: string;
  full_name: string;
  email: string;
  password: string;
}

export default async function UsersPage() {
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

  async function fetchUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('created_at, full_name, email, password');

    if (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
    return data as User[];
  }

  const users = await fetchUsers();

  return (
    <>
      <List users={users} />
    </>
  );
}