import React, { useRef, useEffect } from "react";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CartItemInterface } from "@/app/types";

interface QuantityControlProps {
   item: CartItemInterface;
   onQuantityChange: (id: number, quantity: number) => void;
}

export default function QuantityControl({
   item,
   onQuantityChange,
}: QuantityControlProps) {
   const incrementInterval = useRef<NodeJS.Timeout | null>(null);
   const decrementInterval = useRef<NodeJS.Timeout | null>(null);
   const quantityRef = useRef(item.quantity);

   // Keep quantityRef updated with the latest quantity
   useEffect(() => {
      quantityRef.current = item.quantity;
   }, [item.quantity]);

   const handleIncrement = () => {
      if (quantityRef.current < item.stock) {
         const newQuantity = quantityRef.current + 1;
         quantityRef.current = newQuantity;
         onQuantityChange(item.id, newQuantity);
      }
   };

   const handleDecrement = () => {
      if (quantityRef.current > 0) {
         const newQuantity = quantityRef.current - 1;
         quantityRef.current = newQuantity;
         onQuantityChange(item.id, newQuantity);
      }
   };

   const startIncrementing = () => {
      handleIncrement();
      incrementInterval.current = setInterval(() => {
         handleIncrement();
      }, 100);
   };

   const stopIncrementing = () => {
      if (incrementInterval.current) {
         clearInterval(incrementInterval.current);
         incrementInterval.current = null;
      }
   };

   const startDecrementing = () => {
      handleDecrement();
      decrementInterval.current = setInterval(() => {
         handleDecrement();
      }, 100);
   };

   const stopDecrementing = () => {
      if (decrementInterval.current) {
         clearInterval(decrementInterval.current);
         decrementInterval.current = null;
      }
   };

   return (
      <div className="flex items-center justify-center gap-2">
         <button
            onMouseDown={startDecrementing}
            onMouseUp={stopDecrementing}
            onMouseLeave={stopDecrementing}
            onTouchStart={startDecrementing}
            onTouchEnd={stopDecrementing}
            disabled={item.quantity <= 0}
            className={`h-8 w-8 flex items-center justify-center border bg-white rounded-full ${
               item.quantity <= 0
                  ? "border-green-200 text-green-200 cursor-not-allowed"
                  : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer"
            }`}
         >
            <FontAwesomeIcon icon={faMinus} />
         </button>

         <span className="text-sm font-medium w-6 text-center">
            {item.quantity}
         </span>

         <button
            onMouseDown={startIncrementing}
            onMouseUp={stopIncrementing}
            onMouseLeave={stopIncrementing}
            onTouchStart={startIncrementing}
            onTouchEnd={stopIncrementing}
            disabled={item.quantity >= item.stock}
            className={`h-8 w-8 flex items-center justify-center border bg-white rounded-full ${
               item.quantity >= item.stock
                  ? "border-green-200 text-green-200 cursor-not-allowed"
                  : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer"
            }`}
         >
            <FontAwesomeIcon icon={faPlus} />
         </button>
      </div>
   );
}
