"use client";
import React, { ReactNode, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useGlobalAlert } from "@/app/context/AlertContext";
import Alert from "../ui/Alert";
import { AuthProvider } from "@/app/context/AuthContext";

interface MainLayoutProps {
   children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
   const { alert, closeAlert } = useGlobalAlert();
   return (
      <div className="bg-white text-gray-900">
         {alert && (
            <Alert
               type={alert.type}
               message={alert.message}
               onClose={closeAlert}
            />
         )}
         <div className="flex">
            {/* Fixed Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <main className="sm:ml-24 ml-14 sm:p-4 p-2 w-full max-w-[calc(100vw-3.5rem)] sm:max-w-[calc(100vw-6rem)] bg-white">
               {children}
            </main>
         </div>
      </div>
   );
}
