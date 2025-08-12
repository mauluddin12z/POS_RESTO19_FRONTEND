import {
   createOrderDetail,
   deleteOrderDetail,
   deleteOrderDetailByOrderId,
} from "../api/orderDetailServices";
import { createOrder, updateOrder } from "../api/orderServices";
import { useState } from "react";
import {
   AlertType,
   CartInterface,
   CartItemInterface,
   UserInterface,
} from "../types";
import { AxiosError } from "axios";
import useAuth from "./useAuth";

export interface useOrderActionsPropsInterface {
   cart: CartInterface;
   setCart: React.Dispatch<React.SetStateAction<CartInterface>>;
   mutate: () => void;
}

const useOrderActions = ({
   cart,
   setCart,
   mutate,
}: useOrderActionsPropsInterface) => {
   const { user } = useAuth() as { user: UserInterface | null };
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);

   const handleCloseAlert = () => {
      setAlert(null);
   };

   const handleOrder = async (onSuccess?: () => void) => {
      setIsSubmitting(true);
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

         setCart({ total: "0", cartItems: [] });
         localStorage.removeItem("cart");

         setAlert({
            type: "success",
            message: orderResponse?.message || "Order successfully created.",
         });
         mutate();
         setIsSubmitting;

         // Call onClose when order created successful
         if (onSuccess) onSuccess();
      } catch (error: any) {
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
         setIsSubmitting(false);
      } finally {
         setIsSubmitting(false);
      }
   };

   // Update existing order
   const handleUpdateOrder = async (
      orderId: number,
      updatedItems: CartItemInterface[],
      total: string,
      onSuccess?: () => void
   ): Promise<void> => {
      setIsSubmitting(true);
      try {
         const formData = new FormData();
         formData.append("total", total);
         await updateOrder(orderId, formData);

         await deleteOrderDetailByOrderId(orderId);

         for (const item of updatedItems) {
            const detailFormData = new FormData();
            detailFormData.append("orderId", orderId.toString());
            detailFormData.append("menuId", item.id.toString());
            detailFormData.append("quantity", item.quantity.toString());
            detailFormData.append("price", item.price.toString());
            detailFormData.append(
               "subtotal",
               (item.price * item.quantity).toString()
            );
            detailFormData.append("notes", item.notes);
            await createOrderDetail(detailFormData);
         }

         setAlert({
            type: "success",
            message: "Order successfully updated.",
         });

         // Call onClose when order update is successful
         if (onSuccess) onSuccess();
         mutate();
      } catch (error: any) {
         if (error instanceof AxiosError) {
            setAlert({
               type: "error",
               message: error?.response?.data?.message ?? error.message,
            });
         } else {
            setAlert({
               type: "error",
               message: "Failed to update the order.",
            });
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return {
      handleOrder,
      handleUpdateOrder,
      isSubmitting,
      alert,
      handleCloseAlert,
   };
};

export default useOrderActions;
