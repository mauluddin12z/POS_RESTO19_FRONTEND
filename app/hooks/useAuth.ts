import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function useAuth() {
   const [user, setUser] = useState<any | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<any>(null);

   useEffect(() => {
      // If no user is set, no need to fetch session
      if (!user) {
         setLoading(true);
         const checkLogin = async () => {
            try {
               const res = await axiosInstance.get("/auth/session");
               setUser(res.data?.user || null); // Set user data if available
            } catch (err) {
               console.error("Failed to check session:", err);
               setUser(null);
               setError(err);
            } finally {
               setLoading(false);
            }
         };
         checkLogin();
      } else {
         setLoading(false);
      }
   }, [user]);

   return { user, loading, error };
}

export default useAuth;
