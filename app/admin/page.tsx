import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { SubmitButton } from "@/components/submit-button";

export default function AdminLog({
  searchParams,
}: {
  searchParams: { message: string };
}) {

  const signIn = async (formData: FormData) => {
    "use server";

    const email = "admin@gmail.com"
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/admin?message=No se ha podido ingresar como administrador");
    }

    return redirect("/admin/dashboard/users");
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 z-0">
        <Image src={'/bg.jpg'} width={5472} height={3078} className="absolute inset-0 w-full h-full object-cover" alt="Wallpaper"/>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center relative z-10">
        <div className="bg-white shadow-lg rounded-lg px-2 py-6 flex flex-col items-center">
          <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <Link
              href="/"
              className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-white bg-black flex items-center group text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>{" "}
              Volver
            </Link>

            <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
              <label className="text-md" htmlFor="password">
                Contraseña
              </label>
              <input
                className="rounded-md px-4 py-2 bg-inherit border mb-6"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
              <SubmitButton
                formAction={signIn}
                className="bg-black rounded-md px-4 py-2 text-white mb-2"
                pendingText="Iniciando Sesión..."
              >
                Iniciar Sesión
              </SubmitButton>
              {searchParams?.message && (
                <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                  {searchParams.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}