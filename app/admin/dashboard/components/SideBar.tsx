import SignOutButton from "./SignOutButton";
import SideBarItem from "./SideBarItem";

export default function SideBar() {

  return (
    <div>
      <aside className="top-0 left-0 z-40 w-64 h-screen bg-black flex flex-col justify-between" aria-label="Sidebar">
        <div className="px-3 py-4 overflow-y-auto">
            <SignOutButton />
          <SideBarItem />
        </div>
      </aside>
    </div>
  );
}