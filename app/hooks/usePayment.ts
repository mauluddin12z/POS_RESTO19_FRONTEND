import { useState } from "react";
import { AlertType } from "../types";
import { AxiosError } from "axios";
import { updateOrder } from "../api/orderServices";

interface PaymentPropsInterface {
   orderId: number;
}

type AlertState = { type: AlertType; message: string } | null;

const usePayment = ({ orderId }: PaymentPropsInterface) => {
   const paymentOptions = ["CASH", "QRIS", "BANK"];
   const [paymentMethod, setPaymentMethod] = useState<string>("");
   const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
   const [alert, setAlert] = useState<AlertState>(null);

   // Helper function for resetting payment success state
   const resetPaymentSuccess = () => {
      setPaymentSuccess(false);
   };

   // Generic alert setter
   const showAlert = (type: AlertType, message: string) => {
      setAlert({ type, message });
   };

   const handleCloseAlert = () => setAlert(null);

   const onClosePaymentSuccessAlert = () => setPaymentSuccess(true);

   // Validate the payment method
   const isValidPaymentMethod = () => {
      return paymentMethod && paymentOptions.includes(paymentMethod);
   };

   // Handle the payment logic
   const handlePayment = async () => {
      if (!isValidPaymentMethod()) {
         showAlert("error", "Please select a valid payment method.");
         return;
      }

      setIsSubmitting(true);
      const paymentFormData = new FormData();
      paymentFormData.append("paymentMethod", paymentMethod);
      paymentFormData.append("paymentStatus", "paid");

      try {
         const response = await updateOrder(orderId, paymentFormData);

         if (!response?.data?.orderId) {
            throw new Error("Order update failed: Missing orderId");
         }

         // Handle success and show alert
         setPaymentSuccess(true);
         setTimeout(resetPaymentSuccess, 3000); // Reset after 3 seconds
      } catch (error) {
         if (error instanceof AxiosError) {
            const errorMessage =
               error.response?.data?.message ??
               error.message ??
               "An unknown error occurred.";
            showAlert("error", errorMessage);
         } else {
            showAlert("error", "An unknown error occurred.");
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return {
      paymentOptions,
      paymentMethod,
      setPaymentMethod,
      handlePayment,
      isSubmitting,
      paymentAlert: alert,
      onClosePaymentAlert: handleCloseAlert,
      paymentSuccess,
      onClosePaymentSuccessAlert,
   };
};

export default usePayment;
