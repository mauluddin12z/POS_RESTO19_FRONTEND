"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/api/auth";
import Image from "next/image";
import { useState } from "react";
import Modal from "../ui/Modal";
import LoadingButton from "../ui/LoadingButton";

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
   const [isLoggingOut, setIsLoggingLogout] = useState(false);

   const handleLogout = async () => {
      try {
         setIsLoggingLogout(true);
         await logout();
         window.history.replaceState(null, "", "/login");
         router.push("/login");
         setIsLoggingLogout(false);
      } catch (error: any) {
         setIsLoggingLogout(false);
         console.error(error.message || "An error occurred.");
      }
   };

   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

   const openLogoutModal = () => setIsLogoutModalOpen(true);
   const closeLogoutModal = () => setIsLogoutModalOpen(false);

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
                           className="w-4 aspect-square "
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
                  onClick={openLogoutModal}
                  className="flex flex-col justify-center items-center w-full gap-y-2 p-2 text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
               >
                  <Image
                     className="w-4 aspect-square"
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
         {isLogoutModalOpen && (
            <Modal isOpen={isLogoutModalOpen} onClose={closeLogoutModal}>
               <div>
                  <p className="text-center">
                     Are you sure you want to log out of your account?
                  </p>
                  <div className="mt-4 gap-4  flex justify-center">
                     <button
                        onClick={handleLogout}
                        className={`bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded-md ${
                           isLoggingOut
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                        }`}
                     >
                        {isLoggingOut ? (
                           <div className="flex gap-2 justify-center items-center">
                              <LoadingButton /> Logging out...
                           </div>
                        ) : (
                           "Logout"
                        )}
                     </button>
                     <button
                        onClick={closeLogoutModal}
                        className="bg-gray-200 hover:bg-gray-300   cursor-pointer px-4 py-2 rounded-md"
                     >
                        Cancel
                     </button>
                  </div>
               </div>
            </Modal>
         )}
      </aside>
   );
}
