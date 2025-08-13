import {
   createOrderDetail,
   deleteOrderDetailByOrderId,
} from "../api/orderDetailServices";
import { createOrder, deleteOrder, updateOrder } from "../api/orderServices";
import { useState } from "react";
import { CartInterface, CartItemInterface, UserInterface } from "../types";
import { AxiosError } from "axios";
import useAuth from "./useAuth";
import { useGlobalAlert } from "../context/AlertContext";

const useOrderActions = () => {
   const { showAlert } = useGlobalAlert();
   const { user } = useAuth() as { user: UserInterface | null };
   const [isSubmitting, setIsSubmitting] = useState(false);
   // Create new order
   const handleOrder = async (
      cart: CartInterface,
      setCart: React.Dispatch<React.SetStateAction<CartInterface>>,
      mutate: () => void,
      onCloseModal?: () => void
   ) => {
      setIsSubmitting(true);
      const orderFormData = new FormData();
      orderFormData.append("userId", user?.userId?.toString() || "");
      orderFormData.append("total", cart.total);

      try {
         const orderResponse = await createOrder(orderFormData);
         if (!orderResponse?.data?.orderId) {
            showAlert({
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

         showAlert({
            type: "success",
            message: orderResponse?.message || "Order successfully created.",
         });
      } catch (error: any) {
         if (error instanceof AxiosError) {
            showAlert({
               type: "error",
               message: error?.response?.data?.message ?? error.message,
            });
         } else {
            showAlert({
               type: "error",
               message: "An unknown error occurred.",
            });
         }
      } finally {
         if (onCloseModal) onCloseModal();
         mutate();
         setIsSubmitting(false);
      }
   };

   // Update existing order
   const handleUpdateOrder = async (
      orderId: number,
      updatedItems: CartItemInterface[],
      total: string,
      mutate: () => void,
      onCloseModal?: () => void
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

         showAlert({
            type: "success",
            message: "Order successfully updated.",
         });
      } catch (error: any) {
         if (error instanceof AxiosError) {
            showAlert({
               type: "error",
               message: error?.response?.data?.message ?? error.message,
            });
         } else {
            showAlert({
               type: "error",
               message: "Failed to update the order.",
            });
         }
      } finally {
         if (onCloseModal) onCloseModal();
         mutate();
         setIsSubmitting(false);
      }
   };

   // Delete order
   const handleDeleteOrder = async (
      orderId: number,
      mutate: () => void,
      onCloseModal?: () => void
   ): Promise<void> => {
      setIsSubmitting(true);
      try {
         await deleteOrder(orderId);

         showAlert({
            type: "success",
            message: "Order successfully deleted.",
         });
      } catch (error: any) {
         if (error instanceof AxiosError) {
            showAlert({
               type: "error",
               message: error?.response?.data?.message ?? error.message,
            });
         } else {
            showAlert({
               type: "error",
               message: "Failed to delete the order.",
            });
         }
      } finally {
         if (onCloseModal) onCloseModal();
         mutate();
         setIsSubmitting(false);
      }
   };

   return {
      handleOrder,
      handleUpdateOrder,
      handleDeleteOrder,
      isSubmitting,
   };
};

export default useOrderActions;
