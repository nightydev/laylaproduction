'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import styles from "./SideBarItem.module.css"

export default function SideBarItem() {
  const pathName = usePathname();
  console.log(pathName)

  return (
    <ul className="space-y-2 font-medium pt-5">

      <li>
        <Link href="/admin/dashboard/users" className={`${styles.link} ${(pathName === "/admin/dashboard/users") && styles['active-link']} `}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" viewBox="0 0 16 16">
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">Usuarios</span>
        </Link>
      </li>

      <li>
        <Link href="/admin/dashboard/create" className={`${styles.link} ${(pathName === "/admin/dashboard/create") && styles['active-link']}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" viewBox="0 0 16 16">
            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">Crear Usuario</span>
        </Link>
      </li>
    </ul>
  );
}