import { createOrder, deleteOrder, updateOrder } from "../api/orderServices";
import { useState } from "react";
import { CartInterface, CartItemInterface } from "../types";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { MESSAGES } from "../constants/messages";
import toast from "react-hot-toast";
import { validateCart } from "@/utils/cartValidation";

const useOrderActions = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Create new order
  const handleOrder = async (
    cart: CartInterface,
    setCart: React.Dispatch<React.SetStateAction<CartInterface>>,
    mutate: () => void,
    onCloseModal?: () => void,
  ) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Sedang membuat pesanan...");

    const validation = validateCart(cart);

    if (!validation.valid) {
      toast.error(validation?.message || "", { id: toastId });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", user?.userId?.toString() || "");
      formData.append(
        "items",
        JSON.stringify(
          cart.cartItems.map((item) => ({
            menuId: item.id,
            price: item.price,
            quantity: item.quantity,
            notes: item.notes,
          })),
        ),
      );

      await createOrder(formData);

      setCart({ total: "0", cartItems: [] });
      localStorage.removeItem("cart");

      toast.success(MESSAGES.ORDER.CREATE_SUCCESS, {
        id: toastId,
      });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || MESSAGES.GENERAL.ERROR, {
          id: toastId,
        });
      } else {
        toast.error(MESSAGES.GENERAL.UNKNOWN, {
          id: toastId,
        });
      }
    } finally {
      onCloseModal?.();
      mutate();
      setIsSubmitting(false);
    }
  };

  // Update existing order
  const handleUpdateOrder = async (
    orderId: number,
    updatedItems: CartItemInterface[],
    paymentMethod: string,
    mutate: () => void,
    onCloseModal?: () => void,
  ) => {
    setIsSubmitting(true);

    const toastId = toast.loading("Sedang memperbarui pesanan...");

    try {
      const formData = new FormData();
      formData.append("paymentMethod", paymentMethod);
      formData.append(
        "items",
        JSON.stringify(
          updatedItems.map((item) => ({
            menuId: item.id,
            price: item.price,
            quantity: item.quantity,
            notes: item.notes,
          })),
        ),
      );

      await updateOrder(orderId, formData);

      toast.success(MESSAGES.ORDER.UPDATE_SUCCESS, { id: toastId });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || MESSAGES.GENERAL.ERROR, {
          id: toastId,
        });
      } else {
        toast.error(MESSAGES.ORDER.UPDATE_FAILED, { id: toastId });
      }
    } finally {
      onCloseModal?.();
      mutate();
      setIsSubmitting(false);
    }
  };

  // Delete order
  const handleDeleteOrder = async (
    orderId: number,
    mutate: () => void,
    onCloseModal?: () => void,
  ): Promise<void> => {
    setIsSubmitting(true);
    const toastId = toast.loading("Sedang menghapus pesanan...");
    try {
      await deleteOrder(orderId);

      toast.success(MESSAGES.ORDER.DELETE_SUCCESS, { id: toastId });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(
          MESSAGES.GENERAL.ERROR ||
            error?.response?.data?.message ||
            error.message,
          { id: toastId },
        );
      } else {
        toast.error(MESSAGES.ORDER.DELETE_FAILED, { id: toastId });
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
