import React, { useEffect, useState } from "react";
import { AlertPropsInterface } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const Alert: React.FC<AlertPropsInterface> = ({ type, message, onClose }) => {
   const [isVisible, setIsVisible] = useState(true);

   const alertStyles = {
      success: "text-green-800 bg-green-50",
      error: "text-red-800 bg-red-50",
      warning: "text-yellow-800 bg-yellow-50",
      info: "text-blue-800 bg-blue-50",
      default: "text-gray-800 bg-gray-50",
   };

   useEffect(() => {
      // Automatically close the alert after 5 seconds
      const timer = setTimeout(() => {
         setIsVisible(false);
         setTimeout(onClose, 500); // Call onClose after fade-out transition is done
      }, 5000);

      // Cleanup the timer when the component unmounts
      return () => clearTimeout(timer);
   }, [onClose]);

   return (
      <div
         role="alert"
         aria-live="assertive"
         className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[999] transition-all duration-500 flex gap-x-10 justify-between p-4 mb-4 text-sm rounded-lg shadow ${
            alertStyles[type] || alertStyles.default
         } ${
            !isVisible
               ? "opacity-0 translate-y-5"
               : "opacity-100 translate-y-0"
         }`}
      >
         <span className="font-medium">{message}</span>
         <button
            onClick={() => {
               setIsVisible(false);
               onClose();
            }}
            className="cursor-pointer"
         >
            <FontAwesomeIcon icon={faX} />
         </button>
      </div>
   );
};

export default Alert;
