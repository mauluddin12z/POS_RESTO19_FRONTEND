import { createOrderDetail } from "../api/orderDetailServices";
import { createOrder } from "../api/orderServices";
import { useEffect, useState } from "react";
import { AlertType, CartInterface, UserInterface } from "../types";
import { AxiosError } from "axios";

export interface useOrderActionsPropsInterface {
   cart: CartInterface;
   user: UserInterface | null;
   setCart: React.Dispatch<React.SetStateAction<CartInterface>>;
}

const useOrderActions = ({
   cart,
   user,
   setCart,
}: useOrderActionsPropsInterface) => {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);

   const handleCloseAlert = () => {
      setAlert(null);
   };

   const handleOrder = async () => {
      const orderFormData = new FormData();
      orderFormData.append("userId", user?.userId?.toString() || "");
      orderFormData.append("total", cart.total);

      try {
         const orderResponse = await createOrder(orderFormData);
         if (!orderResponse?.data?.orderId) {
            setAlert({
               type: "error",
               message: "Order creation failed.",
            });
            throw new Error("Order creation failed: Missing orderId");
         }

         for (const item of cart.cartItems) {
            const orderDetailFormData = new FormData();
            orderDetailFormData.append(
               "orderId",
               orderResponse.data.orderId.toString()
            );
            orderDetailFormData.append("menuId", item.id.toString());
            orderDetailFormData.append("quantity", item.quantity.toString());
            orderDetailFormData.append("price", item.price.toString());
            orderDetailFormData.append(
               "subtotal",
               (item.price * item.quantity).toString()
            );
            orderDetailFormData.append("notes", item.notes);

            await createOrderDetail(orderDetailFormData);
         }

         // Reset cart after successful checkout
         setCart({
            total: "0",
            cartItems: [],
         });
         localStorage.removeItem("cart");

         // Show Order successfully created component
         setAlert({
            type: "success",
            message: orderResponse?.message || "Order successfully created.",
         });

         setIsSubmitting(false);
      } catch (error: any) {
         setIsSubmitting(false);
         // Cast the error to AxiosError type to access 'response'
         if (error instanceof AxiosError) {
            setAlert({
               type: "error",
               message: error?.response?.data?.message ?? error.message,
            });
         } else {
            setAlert({
               type: "error",
               message: "An unknown error occurred.",
            });
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return {
      handleOrder,
      isSubmitting,
      alert,
      handleCloseAlert,
   };
};
export default useOrderActions;
