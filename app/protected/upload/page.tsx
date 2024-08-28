import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from 'next/link';

export default async function UploadPage() {
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
    <div className="flex flex-col items-center justify-center py-2" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="p-5 bg-white rounded shadow-md w-80">
        <h2 className="mb-5 text-lg font-semibold text-gray-700">Seleccione el método de subida:</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/protected/upload/manual">
              <button className="w-full px-4 py-2 font-semibold text-white transition-colors duration-200 transform bg-gray-800 rounded hover:bg-gray-600">Manual</button>
            </Link>
          </li>
          <li>
            <Link href="/protected/upload/scanner">
              <button className="w-full px-4 py-2 font-semibold text-white transition-colors duration-200 transform bg-gray-800 rounded hover:bg-gray-600">Escaner</button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
