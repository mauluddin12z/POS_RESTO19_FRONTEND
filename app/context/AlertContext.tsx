"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertType } from "../types";

type AlertState = {
   type: AlertType;
   message: string;
} | null;

type AlertContextType = {
   alert: AlertState;
   showAlert: (alert: AlertState, duration?: number) => void;
   closeAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
   const [alert, setAlert] = useState<AlertState>(null);

   const showAlert = useCallback((alert: AlertState, duration = 3000) => {
      setAlert(alert);
      if (duration) {
         setTimeout(() => {
            setAlert(null);
         }, duration);
      }
   }, []);

   const closeAlert = useCallback(() => {
      setAlert(null);
   }, []);

   return (
      <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
         {children}
      </AlertContext.Provider>
   );
};

export const useGlobalAlert = (): AlertContextType => {
   const context = useContext(AlertContext);
   if (!context)
      throw new Error("useGlobalAlert must be used within AlertProvider");
   return context;
};
