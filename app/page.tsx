import Link from "next/link";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
    return redirect("/");
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 z-0">
        <Image src={'/bg.jpg'} width={5472} height={3078} className="absolute inset-0 w-full h-full object-cover" alt="Wallpaper"/>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <div className="bg-white shadow-lg rounded-lg p-10 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">Registro de Propiedad</h1>
          <p className="text-xl mb-6">¿Cómo quieres acceder?</p>
          <div className="flex space-x-4">
            <AuthButton />
            <Link href="/admin" className="py-2 px-3 flex rounded-md no-underline bg-black hover:bg-gray-800 text-white">
              Administrador
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
