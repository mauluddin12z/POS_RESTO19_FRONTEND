import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image, { ImageLoader } from "next/image";
import React from "react";
import { priceFormat } from "../utils/priceFormat";
import { CartItemPropsInterface } from "../types";

export default function CartItem({
   item,
   stockMessage,
   onQuantityChange,
   onRemove,
}: CartItemPropsInterface) {
   const myLoader: ImageLoader = ({ src }) => {
      return src;
   };
   return (
      <div
         className="flex gap-2 items-center justify-between border-b border-gray-200 pb-3"
      >
         <Image
            className="w-16 h-16 object-cover rounded"
            loader={myLoader}
            src={item.image ?? "no-image.png"}
            width={500}
            height={500}
            priority
            unoptimized
            alt={item.name}
         />
         <div className="flex flex-col w-full">
            <span className="font-medium text-xs">{item.name}</span>
            <span className="font-light text-xs text-red-600">
               {stockMessage}
            </span>
            <div className="flex items-center justify-center w-full mt-2">
               <button
                  onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-gray-500 rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 cursor-pointer"
               >
                  <FontAwesomeIcon icon={faMinus} />
               </button>
               <input
                  type="text"
                  className="w-8 shrink-0 border-0 bg-transparent text-center text-xs font-medium text-gray-900 focus:outline-none focus:ring-0"
                  placeholder="99"
                  value={item.quantity}
                  maxLength={item.stock.toString().length}
                  onChange={(e) => {
                     const newQuantity = parseInt(e.target.value);
                     // Validate and set quantity
                     if (newQuantity >= 0 && newQuantity <= item.stock) {
                        onQuantityChange(item.id, newQuantity);
                     }
                  }}
               />

               <button
                  disabled={item.quantity >= item.stock}
                  onClick={() => onQuantityChange(item.id, item.quantity + 1)}
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
         <div className="flex flex-col">
            <span className="ml-3 text-sm text-gray-600">
               {priceFormat(item.price)}
            </span>
            <button
               onClick={() => onRemove(item.id)}
               className="text-red-500 text-sm hover:underline cursor-pointer"
            >
               Remove
            </button>
         </div>
      </div>
   );
}
