import {
   CartInterface,
   CartItemInterface,
   ProductInterface,
} from "@/app/types";
import { useEffect, useState } from "react";

const useCart = () => {
   const [cart, setCart] = useState<CartInterface>({
      total: "0",
      cartItems: [],
   });

   const [stockMessage, setStockMessage] = useState<string>("");

   // Load cart from localStorage
   useEffect(() => {
      const stored = localStorage.getItem("cart");
      if (!stored) return;
      try {
         const parsed: CartInterface = JSON.parse(stored);
         if (parsed && Array.isArray(parsed.cartItems)) {
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

   // Ensure quantity doesn't exceed stock
   const getValidQuantity = (quantity: number, stock: number) => {
      if (quantity > stock) {
         setStockMessage("Out of stock.");
         return stock;
      }
      setStockMessage("");
      return quantity;
   };

   // Utility to calculate subtotal and total
   const calculateTotals = (cartItems: CartItemInterface[]) => {
      const updatedCartItems = cartItems.map((item) => ({
         ...item,
         subtotal: parseFloat((item.price * item.quantity).toFixed(2)),
      }));

      const total = updatedCartItems
         .reduce((acc, item) => acc + item.subtotal, 0)
         .toFixed(2);

      return { updatedCartItems, total };
   };

   // Add to cart
   const handleAddToCart = (product: ProductInterface) => {
      console.log("Adding product to cart:", product);
      setCart((prev: CartInterface) => {
         const existingItem = prev.cartItems.find(
            (item) => item.id === product.id
         );

         let updatedItems: CartItemInterface[];

         if (existingItem) {
            updatedItems = prev.cartItems.map((item) =>
               item.id === product.id
                  ? {
                       ...item,
                       quantity: getValidQuantity(
                          item.quantity + 1,
                          product.stock
                       ),
                    }
                  : item
            );
         } else {
            updatedItems = [
               ...prev.cartItems,
               {
                  id: product.id,
                  imageUrl: product.imageUrl,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  subtotal: product.price,
                  notes: "",
                  stock: product.stock,
               },
            ];
         }

         const { updatedCartItems, total } = calculateTotals(updatedItems);

         return {
            ...prev,
            cartItems: updatedCartItems,
            total,
         };
      });
   };

   // Remove from cart
   const handleRemove = (id: number | null) => {
      setCart((prev: CartInterface) => {
         if (id === 0) {
            return { ...prev, cartItems: [], total: "0" };
         }

         const updatedItems = prev.cartItems.filter((item) => item.id !== id);
         const { updatedCartItems, total } = calculateTotals(updatedItems);

         return {
            ...prev,
            cartItems: updatedCartItems,
            total,
         };
      });
   };

   // Update quantity
   const handleQuantityChange = (id: number, quantity: number) => {
      if (quantity <= 0) return handleRemove(id);

      setCart((prev: CartInterface) => {
         const updatedItems = prev.cartItems.map((item) =>
            item.id === id
               ? {
                    ...item,
                    quantity: getValidQuantity(quantity, item.stock),
                 }
               : item
         );

         const { updatedCartItems, total } = calculateTotals(updatedItems);

         return {
            ...prev,
            cartItems: updatedCartItems,
            total,
         };
      });
   };

   // Update notes for a specific cart item
   const handleNotesChange = (id: number, newNotes: string) => {
      setCart((prev: CartInterface) => {
         const updatedItems = prev.cartItems.map((item) =>
            item.id === id
               ? {
                    ...item,
                    notes: newNotes,
                 }
               : item
         );

         const { updatedCartItems, total } = calculateTotals(updatedItems);

         return {
            ...prev,
            cartItems: updatedCartItems,
            total,
         };
      });
   };
   return {
      cart,
      setCart,
      handleAddToCart,
      handleRemove,
      handleQuantityChange,
      handleNotesChange,
      stockMessage,
   };
};

export default useCart;
