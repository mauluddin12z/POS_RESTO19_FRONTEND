import React from "react";
import { PaymentMethodPropsInterface } from "../types";
const PaymentMethod: React.FC<PaymentMethodPropsInterface> = ({
   paymentOptions,
   onPaymentMethod,
   currentPaymentMethod,
}) => {
   return (
      <div className="flex flex-col">
         <span className="text-sm font-medium">Payment Method:</span>
         <div className="grid grid-cols-3 gap-2 py-1">
            {paymentOptions.map((option, index) => (
               <div
                  key={index}
                  onClick={() => onPaymentMethod(option)}
                  className={`${
                     currentPaymentMethod == option
                        ? "bg-blue-700 hover:bg-blue-800 text-white"
                        : "text-gray-900 bg-white hover:bg-gray-100"
                  } flex justify-center items-center py-2.5 px-5 text-sm font-medium rounded-lg border border-gray-200 cursor-pointer
            `}
               >
                  {option}
               </div>
            ))}
         </div>
      </div>
   );
};

export default PaymentMethod;
