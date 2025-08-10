"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHouse,
   faList,
   faUsers,
   faSignOut,
   faNoteSticky,
   faBorderAll,
} from "@fortawesome/free-solid-svg-icons";
import { logout } from "@/app/api/auth";
import Image from "next/image";

const links = [
   { href: "/home", label: "Home", icon: "home.svg" },
   { href: "/orders", label: "Orders", icon: "orders.svg" },
   { href: "/menus", label: "Menus", icon: "menus.svg" },
   {
      href: "/categories",
      label: "categories",
      icon: "categories.svg",
      adminOnly: true,
   },
   { href: "/users", label: "Users", icon: "users.svg", adminOnly: true },
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
      <aside
         className="fixed left-0 z-48 w-14 sm:w-24 h-full bg-white border border-gray-200 sm:px-3 sm:py-4 px-1 py-2 overflow-y-auto"
         aria-label="Sidebar"
      >
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
                        <Image
                           className="w-5 aspect-square"
                           width={50}
                           height={50}
                           src={`sidebarIcon/${link.icon}`}
                           alt={link.label}
                           priority
                        />
                        <div className="hidden lg:block">{link.label}</div>
                     </Link>
                  </li>
               ))}
            <li>
               <button
                  onClick={handleLogout}
                  className="flex flex-col justify-center items-center w-full gap-y-2 p-2 text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
               >
                  <Image
                     className="w-5 aspect-square"
                     width={50}
                     height={50}
                     src="sidebarIcon/logout.svg"
                     alt="logout"
                     priority
                  />
                  <div className="hidden lg:block">Logout</div>
               </button>
            </li>
         </ul>
      </aside>
   );
}
