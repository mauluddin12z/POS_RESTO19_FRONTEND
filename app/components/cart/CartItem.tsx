import { CartItemPropsInterface } from "@/app/types";
import { priceFormat } from "@/app/utils/priceFormat";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function CartItem({
   item,
   stockMessage,
   onQuantityChange,
   onNotesChange,
   onRemove,
}: CartItemPropsInterface) {
   return (
      <div className="flex flex-col border-b border-gray-200 pb-3 gap-2">
         <div className="flex gap-2 items-center justify-between">
            <div className="flex flex-col gap-2">
               <span className="font-medium text-xs">{item.name}</span>
               <span className="text-sm text-gray-600">
                  {priceFormat(item.price)}
               </span>
            </div>
            <div className="flex flex-col gap-2">
               {stockMessage && (
                  <span className="font-light text-xs text-red-600">
                     {stockMessage}
                  </span>
               )}
               <div className="flex items-center justify-center w-full">
                  <button
                     onClick={() =>
                        onQuantityChange(item.id, item.quantity - 1)
                     }
                     className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-gray-500 rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 cursor-pointer"
                  >
                     <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <input
                     type="number"
                     className="no-arrows w-8 shrink-0 border-0 bg-transparent text-center text-xs font-medium text-gray-900 focus:outline-none focus:ring-0"
                     placeholder="99"
                     value={item.quantity}
                     min={1}
                     max={item.stock}
                     onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) ?? "";
                        // Validate and set quantity
                        onQuantityChange(item.id, newQuantity);
                     }}
                  />

                  <button
                     disabled={item.quantity >= item.stock}
                     onClick={() =>
                        onQuantityChange(item.id, item.quantity + 1)
                     }
                     className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 ${
                        item.quantity >= item.stock
                           ? "text-gray-200"
                           : "text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 cursor-pointer"
                     }`}
                  >
                     <FontAwesomeIcon icon={faPlus} />
                  </button>
               </div>
            </div>
         </div>
         <div className="flex gap-2">
            <input
               id="order-notes"
               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5"
               placeholder="Enter your notes..."
               type="text"
               value={item.notes}
               onChange={(e) => onNotesChange(item.id, e.target.value)}
            />
            <button
               onClick={() => onRemove(item.id)}
               className="border border-red-300 rounded-lg text-red-500 text-xs p-2.5 hover:bg-red-600 hover:text-white cursor-pointer"
            >
               <FontAwesomeIcon icon={faTrash} />
            </button>
         </div>
      </div>
   );
}
