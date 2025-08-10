import React, { ReactNode, useEffect } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ModalProps {
   children: ReactNode;
   isOpen: boolean;
   onClose: () => void;
}

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
   // Lock background scroll when modal is open
   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "";
      }

      return () => {
         document.body.style.overflow = "";
      };
   }, [isOpen]);

   return (
      isOpen && (
         <div className="fixed inset-0 z-[52] bg-black/50 backdrop:bg-transparent flex justify-center items-center">
            <div className="h-[calc(100vh-160px)] sm:h-[calc(100vh-140px)] focus:outline-none relative">
               <div className="relative rounded-lg bg-white text-left shadow-xl overflow-hidden p-2 max-w-full top-0">
                  <div className="flex w-full bg-white sticky top-0 z-[51] justify-end">
                     <button
                        type="button"
                        onClick={onClose}
                        className="flex justify-center items-center px-2 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer sm:ml-3 sm:w-auto"
                     >
                        <FontAwesomeIcon icon={faX} />
                     </button>
                  </div>
                  <div className="p-2 relative max-h-[calc(100vh-160px)] sm:max-h-[calc(100vh-140px)] max-w-[calc(100vw-80px)] sm:max-vw-[calc(100vw-140px)] overflow-auto">
                     {children}
                  </div>
               </div>
            </div>
         </div>
      )
   );
};

export default Modal;
