import Nav from "./components/Nav";
import SideBar from "./components/SideBar";


export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Nav />
      <div className="flex">
        <SideBar />
        <div className="p-2 w-full relative z-0">
          {children}
        </div>
      </div>
    </div>
  );
} 