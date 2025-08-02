"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHouse,
   faList,
   faThLarge,
   faChartLine,
   faUsers,
   faSignOut,
} from "@fortawesome/free-solid-svg-icons"; // Import icons
import { logout } from "@/utils/auth";

// Mapping of links with icons
const links = [
   { href: "/dashboard", label: "Dashboard", menuIcon: faHouse },
   { href: "/menus", label: "Menus", menuIcon: faList },
   { href: "/categories", label: "Categories", menuIcon: faThLarge },
   { href: "/sales", label: "Sales", menuIcon: faChartLine },
   { href: "/users", label: "Users", menuIcon: faUsers, adminOnly: true },
];

export default function Sidebar() {
   const router = useRouter();
   const isAdmin = true;
   const pathname = usePathname();

   const handleLogout = async () => {
      try {
         await logout();
         window.history.replaceState(null, "", "/login");
         router.push("/login");
      } catch (error: any) {
         console.error(error.message || "An error occurred.");
      }
   };

   return (
      <aside id="default-sidebar" className="z-40 h-full" aria-label="Sidebar">
         <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 b">
            <ul className="space-y-4 font-medium text-sm">
               {links
                  .filter((link) => !(link.adminOnly && !isAdmin))
                  .map((link) => (
                     <li key={link.href}>
                        <Link
                           href={link.href}
                           className={`flex flex-col justify-center items-center gap-y-2 p-2 text-gray-900 rounded-lg hover:bg-gray-100 ${
                              pathname === link.href && "bg-gray-200"
                           }`}
                        >
                           <FontAwesomeIcon icon={link.menuIcon} />
                           {link.label}
                        </Link>
                     </li>
                  ))}
               <li>
                  <button
                     onClick={() => handleLogout()}
                     className="flex flex-col justify-center items-center w-full gap-y-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 cursor-pointer"
                  >
                     <FontAwesomeIcon icon={faSignOut} />
                     Logout
                  </button>
               </li>
            </ul>
         </div>
      </aside>
   );
}
