import React, { useState } from "react";
import Modal from "../ui/Modal";
import Image from "next/image";

export interface PaymentMethodPropsInterface {
   paymentOptions: string[];
   setPaymentMethod: (paymentMethod: string) => void;
   paymentMethod: string;
}

const PaymentMethod: React.FC<PaymentMethodPropsInterface> = ({
   paymentOptions,
   setPaymentMethod,
   paymentMethod,
}) => {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const handlePaymentMethodSelect = (option: string) => {
      setPaymentMethod(option);
      if (option === "QRIS") {
         setIsModalOpen(true); // Show modal when QRIS is selected
      }
   };

   const closeModal = () => {
      setIsModalOpen(false); // Close modal when clicking close
   };

   return (
      <div className="flex flex-col">
         <span className="text-sm font-medium">Payment Method:</span>
         {paymentMethod === "" && (
            <span className="text-xs text-red-600">
               Please select the payment method
            </span>
         )}
         <div className="grid grid-cols-3 gap-2 py-1">
            {paymentOptions.map((option, index) => (
               <div
                  key={index}
                  onClick={() => handlePaymentMethodSelect(option)}
                  className={`${
                     paymentMethod == option
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "text-gray-900 bg-white hover:bg-gray-100"
                  } flex justify-center items-center py-2.5 px-5 text-sm font-medium rounded-lg border border-gray-200 cursor-pointer`}
               >
                  {option}
               </div>
            ))}
         </div>

         {/* QRIS Modal */}
         {paymentMethod === "QRIS" && (
            <Modal isOpen={isModalOpen} onClose={closeModal}>
               <Image
                  className="rounded-t-lg w-96 h-full aspect-square"
                  src="QRIS.jpg"
                  width={500}
                  height={500}
                  priority
                  unoptimized
                  alt="QRIS"
               />
            </Modal>
         )}
      </div>
   );
};

export default PaymentMethod;
