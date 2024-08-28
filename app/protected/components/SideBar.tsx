import SideBarItem from "./SideBarItem";

export default function SideBar() {

  return (
    <div>
      <aside className="top-0 left-0 w-64 bg-gray-100 flex flex-col justify-between shadow relative z-5" style={{ height: 'calc(100vh - 4rem)' }} aria-label="Sidebar">
        <div className="px-3 overflow-y-auto">
          <SideBarItem />
        </div>
      </aside>
    </div>
  );
}