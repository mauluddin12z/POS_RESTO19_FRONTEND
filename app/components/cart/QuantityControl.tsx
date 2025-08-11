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
   return (
      <div className="flex items-center justify-center gap-1 w-auto">
         <button
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 0}
            className={`h-8 w-8 flex items-center justify-center border bg-white rounded-full ${
               item.quantity <= 0
                  ? "border-green-200 text-green-200 cursor-not-allowed"
                  : "border-green-700 text-green-700 hover:bg-green-700 hover:text-white cursor-pointer"
            }`}
         >
            <FontAwesomeIcon icon={faMinus} />
         </button>

         <span className="text-sm font-medium w-6 text-center">
            {item.quantity}
         </span>

         <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className={`h-8 w-8 flex items-center justify-center border bg-white rounded-full ${
               item.quantity >= item.stock
                  ? "border-green-200 text-green-200 cursor-not-allowed"
                  : "border-green-700 text-green-700 hover:bg-green-700 hover:text-white cursor-pointer"
            }`}
         >
            <FontAwesomeIcon icon={faPlus} />
         </button>
      </div>
   );
}
