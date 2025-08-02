"use client";
import React, { ReactNode, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import useAuth from "@/utils/authProvider";
import { useRouter } from "next/navigation";

interface MainLayoutProps {
   children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
   const { isLoggedIn, user } = useAuth();
   const router = useRouter();
   useEffect(() => {
      if (!isLoggedIn) {
      }
   }, []);

   return (
      <div className="flex flex-col w-full h-screen bg-white text-gray-900">
         <Header />
         <div className="flex w-full h-full">
            <Sidebar />
            <main className="p-4 flex-1 overflow-y-auto">
               <div className="flex min-h-full border border-gray-200 rounded-lg p-4">
                  {children}
               </div>
            </main>
         </div>
      </div>
   );
}
