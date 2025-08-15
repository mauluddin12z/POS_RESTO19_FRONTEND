import React, { useRef } from "react";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import Invoice from "../invoice/Invoice";
import { useReactToPrint } from "react-to-print";
import { OrderInterface } from "@/app/types";

interface PaymentSuccessfulProps {
   paymentSuccess: boolean;
   onClose: () => void;
   order: OrderInterface;
}
export default function PaymentSuccessful({
   paymentSuccess,
   onClose,
   order,
}: PaymentSuccessfulProps) {
   const contentRef = useRef<HTMLDivElement>(null);

   const handlePrint = useReactToPrint({ contentRef });
   return (
      paymentSuccess && (
         <>
            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full min-h-screen bg-black/50">
               <div className="w-full max-w-xl p-12 mx-4 text-center transition-all transform bg-white shadow-lg rounded-xl hover:shadow-xl">
                  <div className="flex w-full z-[51] justify-end">
                     <button
                        type="button"
                        onClick={onClose}
                        className="flex justify-center items-center px-2 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer sm:ml-3 sm:w-auto"
                     >
                        <FontAwesomeIcon icon={faX} />
                     </button>
                  </div>
                  <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full text-green-600">
                     <FontAwesomeIcon icon={faCheck} className="text-5xl" />
                  </div>

                  <h1 className="mb-6 text-4xl font-extrabold text-green-600">
                     Payment Successful!
                  </h1>

                  <p className="mb-8 text-xl text-gray-700">
                     Thank you for your purchase.
                  </p>
                  <button
                     className="w-full bg-gray-600 hover:bg-gray-700 text-white p-2 rounded cursor-pointer"
                     onClick={handlePrint}
                  >
                     <div>
                        <FontAwesomeIcon icon={faPrint} /> Print Invoice
                     </div>
                  </button>
               </div>
            </div>
            {/* Hidden invoice for printing */}
            <div className="hidden">
               <Invoice ref={contentRef} order={order} />
            </div>
         </>
      )
   );
}
