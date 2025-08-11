import { ProductCardPropsInterface } from "@/app/types";
import { priceFormat } from "@/app/utils/priceFormat";
import Image, { ImageLoader } from "next/image";
import React from "react";
import QuantityControl from "../cart/QuantityControl";

export default function ProductCard({
   id,
   productName,
   productImageUrl,
   productPrice,
   stock,
   onAddToCart,
   cart,
   onQuantityChange,
}: ProductCardPropsInterface) {
   const myLoader: ImageLoader = ({ src }) => src;

   const cartItem = cart.cartItems.find((item) => item.id === id);

   return (
      <div
         className={`w-full h-fit duration-200 bg-white border border-gray-200 overflow-hidden rounded-lg shadow-sm relative ${
            stock > 0 && "hover:scale-[101%]"
         }`}
      >
         {stock === 0 && (
            <div className="absolute inset-0 bg-gray-900/80 z-10 flex items-center justify-center text-white text-lg font-semibold rounded-lg">
               Out of Stock
            </div>
         )}

         <Image
            className="w-full aspect-5/4 object-cover"
            loader={myLoader}
            src={productImageUrl ?? "no-image.png"}
            width={500}
            height={500}
            priority
            unoptimized
            alt={productName}
         />

         <div className="p-4">
            <h5 className="text-xs lg:text-md font-semibold tracking-tight text-gray-900 mb-2">
               {productName}
            </h5>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
               <span className="w-full text-xs lg:text-md font-bold text-gray-900">
                  {priceFormat(productPrice)}
               </span>

               {cartItem ? (
                  <QuantityControl
                     item={cartItem}
                     onQuantityChange={onQuantityChange}
                  />
               ) : (
                  <button
                     className={`w-full bg-white text-green-600 border border-green-600 font-medium rounded-full text-sm px-2 py-1 text-center ${
                        stock > 0 &&
                        "cursor-pointer hover:text-white hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300"
                     }`}
                     onClick={() =>
                        onAddToCart({
                           id,
                           name: productName,
                           imageUrl: productImageUrl,
                           price: productPrice,
                           stock: stock,
                        })
                     }
                     disabled={stock === 0}
                  >
                     Order
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}
