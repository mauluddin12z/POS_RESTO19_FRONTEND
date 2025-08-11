import { CartItemPropsInterface } from "@/app/types";
import { priceFormat } from "@/app/utils/priceFormat";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image, { ImageLoader } from "next/image";
import React from "react";
import QuantityControl from "./QuantityControl";

export default function CartItem({
   item,
   stockMessage,
   onQuantityChange,
   onNotesChange,
   onRemove,
}: CartItemPropsInterface) {
   const myLoader: ImageLoader = ({ src }) => {
      return src;
   };
   return (
      <div className="flex flex-col border-b border-gray-200 pb-3 gap-2">
         <div className="flex gap-2 items-center justify-between">
            <div className="w-18 rounded-lg overflow-hidden">
               <Image
                  className="w-full aspect-5/4 object-cover"
                  loader={myLoader}
                  src={item.imageUrl ?? "no-image.png"}
                  width={500}
                  height={500}
                  priority
                  unoptimized
                  alt={item.name}
               />
            </div>
            <div className="flex flex-col gap-2">
               <span className="font-medium text-xs">{item.name}</span>
               <span className="text-sm text-gray-600">
                  {priceFormat(item.subtotal)}
               </span>
            </div>
            <div className="flex flex-col gap-2">
               {stockMessage && (
                  <span className="font-light text-xs text-red-600">
                     {stockMessage}
                  </span>
               )}
               <QuantityControl
                  item={item}
                  onQuantityChange={onQuantityChange}
               />
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
