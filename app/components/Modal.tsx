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
   const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
   };

   return (
      isOpen && (
         <div
            id="backdrop"
            onClick={() => onClose()}
            className="fixed inset-0 z-[52] bg-black/50 backdrop:bg-transparent"
         >
            <div className="flex items-center justify-center text-center focus:outline-none sm:items-center px-10 pb-20 sm:pb-10 pt-10 border">
               <div
                  onClick={handleContentClick}
                  className="relative rounded-lg bg-white text-left shadow-xl sm:max-h-[calc(100vh-60px)] max-h-[calc(100vh-140px)] overflow-hidden p-4 max-w-full"
               >
                  <div className="flex w-full bg-white sticky top-0 z-[999] justify-end border-b border-gray-200">
                     <button
                        type="button"
                        onClick={onClose}
                        className="flex justify-center items-center px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer sm:ml-3 sm:w-auto"
                     >
                        <FontAwesomeIcon icon={faX} />
                     </button>
                  </div>
                  <div className="px-1 sm:px-4 pt-5 pb-10 relative max-h-[calc(100vh-160px)] sm:max-h-[calc(100vh-140)] overflow-auto">
                     {children}
                  </div>
               </div>
            </div>
         </div>
      )
   );
};

export default Modal;
