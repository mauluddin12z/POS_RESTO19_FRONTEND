"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { logout } from "@/app/api/auth";
import { UserInterface } from "../types";
import axiosInstance from "../api/axiosInstance";
import { usePathname } from "next/navigation";

interface AuthContextType {
   user: UserInterface | null;
   loading: boolean;
   handleLogout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
   const [user, setUser] = useState<UserInterface | null>(null);
   const [loading, setLoading] = useState(true);
   const pathname = usePathname();

   useEffect(() => {
      // Check if we are on the login page
      if (pathname === "/login") {
         setLoading(false); // Skip fetching session if on login page
         return;
      }

      // Fetch user session only on initial load (component mount)
      const fetchUser = async () => {
         try {
            const { data } = await axiosInstance.get("/auth/session");
            if (data) {
               setUser(data.user);
            } else {
               setUser(null);
            }
         } catch (error) {
            console.error("Failed to fetch user data:", error);
            setUser(null);
         } finally {
            setLoading(false);
         }
      };

      fetchUser();
   }, [pathname]); // Make effect run only when the page path changes

   const handleLogout = async () => {
      try {
         setLoading(true);
         await logout();
         setUser(null);
      } catch (error) {
         console.error("Error logging out:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <AuthContext.Provider value={{ user, loading, handleLogout }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = (): AuthContextType => {
   const context = useContext(AuthContext);

   // Check if the context is undefined and throw an error
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
   }

   return context;
};
