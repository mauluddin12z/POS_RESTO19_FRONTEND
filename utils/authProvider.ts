"use client";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";

function useAuth() {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const checkLogin = async () => {
         try {
            const res = await axiosInstance.get("/auth/session");
            setUser(res.data.user);
         } catch (err: any) {
            console.error("Failed to check session:", err);
            setUser(null)
            setError(err);
         } finally {
            setLoading(false);
         }
      };
      checkLogin();
   }, []);

   return { user, isLoggedIn: !!user, loading, error };
}

export default useAuth;
