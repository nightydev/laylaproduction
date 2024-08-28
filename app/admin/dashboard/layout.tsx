import SideBar from "./components/SideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SideBar />
      <div className="p-2 w-full">
        {children}
      </div>
    </div>
  );
}