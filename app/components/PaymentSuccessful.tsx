import React from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PaymentSuccessful() {
   return (
      <div className=" fixed top-0 left-0 z-50 flex items-center justify-center w-full min-h-screen bg-black/50">
         <div className="w-full max-w-xl p-12 mx-4 text-center transition-all transform bg-white shadow-lg rounded-xl hover:shadow-xl">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full text-green-600">
               <FontAwesomeIcon icon={faCheck} className="text-5xl" />
            </div>

            <h1 className="mb-6 text-4xl font-extrabold text-green-600">
               Payment Successful!
            </h1>

            <p className="mb-8 text-xl text-gray-700">
               Thank you for your purchase.
            </p>
         </div>
      </div>
   );
}
