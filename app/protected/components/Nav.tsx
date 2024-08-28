import AuthButton from "@/components/AuthButton";

export default function Nav() {
  return (
    <nav className="w-full flex justify-center h-16 bg-white shadow-md relative z-10">
      <div className="w-full max-w flex justify-between items-center p-3 text-sm px-10">
        <h1 className="font-bold text-xl">Registro de Propiedad</h1>
        <AuthButton />
      </div>
    </nav>
  );
}