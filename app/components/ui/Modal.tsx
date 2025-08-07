"use client";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

interface ModalProps {
   children: ReactNode;
   isOpen: boolean;
   onClose: () => void;
}

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
   // Handle click outside the modal

   return (
      isOpen && (
         <div className="fixed inset-0 z-[52] bg-black/50 backdrop:bg-transparent">
            <div className="flex items-center justify-center text-center focus:outline-none sm:items-center px-10 pb-20 sm:pb-10 pt-10">
               <div className="relative rounded-lg bg-white text-left shadow-xl sm:max-h-[calc(100vh-60px)] max-h-[calc(100vh-140px)] overflow-hidden p-2 max-w-full">
                  <div className="flex w-full bg-white sticky top-0 z-[999] justify-end">
                     <button
                        type="button"
                        onClick={onClose}
                        className="flex justify-center items-center px-2 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer sm:ml-3 sm:w-auto"
                     >
                        <FontAwesomeIcon icon={faX} />
                     </button>
                  </div>
                  <div className="p-2 relative max-h-[calc(100vh-160px)] sm:max-h-[calc(100vh-140)] overflow-auto">
                     {children}
                  </div>
               </div>
            </div>
         </div>
      )
   );
};

export default Modal;
