
import { createSaleDetail } from "../api/saleDetailServices";
import { createSale } from "../api/saleServices";
import { useState } from "react";
import { UseCheckoutPropsInterface } from "../types";

const useCheckout = ({ cart, user, setCart }: UseCheckoutPropsInterface) => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [paymentSuccessVisible, setPaymentSuccessVisible] = useState(false);

   const handleCheckout = async () => {
      setLoading(true);
      setError(null);

      const saleFormData = new FormData();
      saleFormData.append("userId", user?.userId?.toString() || "");
      saleFormData.append("total", cart.total);
      saleFormData.append("paymentMethod", cart.paymentMethod);
      saleFormData.append("notes", cart.notes);

      try {
         const saleResponse = await createSale(saleFormData);
         if (!saleResponse?.data?.saleId) {
            throw new Error("Sale creation failed: Missing saleId");
         }

         for (const item of cart.cartItems) {
            const saleDetailFormData = new FormData();
            saleDetailFormData.append(
               "saleId",
               saleResponse.data.saleId.toString()
            );
            saleDetailFormData.append("menuId", item.id.toString());
            saleDetailFormData.append("quantity", item.quantity.toString());
            saleDetailFormData.append("price", item.price.toString());
            saleDetailFormData.append(
               "subtotal",
               (item.price * item.quantity).toString()
            );

            await createSaleDetail(saleDetailFormData);
         }

         // Reset cart after successful checkout
         setCart({
            total: "0",
            paymentMethod: "",
            notes: "",
            cartItems: [],
         });
         localStorage.removeItem("cart");

         // Show PaymentSuccessful component
         setPaymentSuccessVisible(true);
         setTimeout(() => {
            setPaymentSuccessVisible(false); // Hide after 3 seconds
         }, 3000);
      } catch (err: any) {
         setError(err.message || "Something went wrong during checkout.");
         console.error("Error during checkout:", err);
      } finally {
         setLoading(false);
      }
   };

   return { handleCheckout, loading, error, paymentSuccessVisible };
};
export default useCheckout;
