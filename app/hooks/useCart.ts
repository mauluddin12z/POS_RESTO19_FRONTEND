import {
   CartInterface,
   CartItemInterface,
   ProductInterface,
} from "@/app/types";
import { useEffect, useState } from "react";

const useCart = () => {
   const [cart, setCart] = useState<CartInterface>({
      total: "0",
      paymentMethod: "",
      notes: "",
      cartItems: [],
   });

   const [stockMessage, setStockMessage] = useState<string>("");

   // Load cart from localStorage
   useEffect(() => {
      const stored = localStorage.getItem("cart");
      if (!stored) return;
      try {
         const parsed: CartInterface = JSON.parse(stored);
         if (parsed && parsed.cartItems && Array.isArray(parsed.cartItems)) {
            setCart(parsed);
         }
      } catch (err) {
         console.error("Failed to parse cart from localStorage", err);
      }
   }, []);

   // Persist cart to localStorage
   useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
   }, [cart]);

   // Ensure quantity doesn't exceed stock and handle stockMessage
   const getValidQuantity = (quantity: number, stock: number) => {
      if (quantity > stock) {
         setStockMessage(`Out of stock.`);
         return stock; // Cap the quantity at stock level
      }
      if (quantity < stock) {
         setStockMessage(""); // Clear message if quantity is valid
      }
      return quantity;
   };

   // Handle adding items to the cart
   const handleAddToCart = (product: ProductInterface) => {
      setCart((prev: CartInterface) => {
         const existingItem = prev.cartItems.find(
            (item) => item.id === product.id
         );

         const updatedCartItems = existingItem
            ? prev.cartItems.map((item) =>
                 item.id === product.id
                    ? {
                         ...item,
                         quantity: getValidQuantity(
                            item.quantity + 1,
                            product.stock
                         ),
                      }
                    : item
              )
            : [
                 ...prev.cartItems,
                 { ...product, quantity: 1 }, // New item starts with quantity 1
              ];

         const updatedTotal = updatedCartItems
            .reduce(
               (accumulator: number, item: CartItemInterface) =>
                  accumulator + item.price * item.quantity,
               0
            )
            .toFixed(2);

         return { ...prev, cartItems: updatedCartItems, total: updatedTotal };
      });
   };

   // Handle removing items from the cart
   const handleRemove = (id: number | null) => {
      setCart((prev: CartInterface) => {
         if (id === 0) {
            return { ...prev, cartItems: [], total: "0.00" };
         }

         const updatedCartItems = prev.cartItems.filter(
            (item) => item.id !== id
         );

         const updatedTotal = updatedCartItems
            .reduce(
               (accumulator: number, item: CartItemInterface) =>
                  accumulator + item.price * item.quantity,
               0
            )
            .toFixed(2);

         return { ...prev, cartItems: updatedCartItems, total: updatedTotal };
      });
   };

   // Handle changing item quantity in the cart
   const handleQuantityChange = (id: number, quantity: number) => {
      if (quantity <= 0) return handleRemove(id);
      setCart((prev: CartInterface) => {
         const updatedCartItems = prev.cartItems.map((item) =>
            item.id === id
               ? {
                    ...item,
                    quantity: getValidQuantity(quantity, item.stock), // Ensure quantity doesn't exceed stock
                 }
               : item
         );

         const updatedTotal = updatedCartItems
            .reduce(
               (accumulator: number, item: CartItemInterface) =>
                  accumulator + item.price * item.quantity,
               0
            )
            .toFixed(2);

         return { ...prev, cartItems: updatedCartItems, total: updatedTotal };
      });
   };

   // Handle the payment method
   const handlePaymentMethod = (paymentMethod: string) => {
      setCart((prevCart) => ({
         ...prevCart,
         paymentMethod: paymentMethod, // Update only the payment method
      }));
   };

   // Handle notes
   const handleNotes = (notes: string) => {
      setCart((prevCart) => ({
         ...prevCart,
         notes: notes, // Update only the payment method
      }));
   };

   return {
      cart,
      setCart,
      handleAddToCart,
      handleRemove,
      handleQuantityChange,
      stockMessage,
      handlePaymentMethod,
      handleNotes,
   };
};

export default useCart;
