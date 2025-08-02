import Image, { ImageLoader } from "next/image";
import React from "react";
// @ts-ignore
import { toRupiah } from "to-rupiah";

export default function ProductCard({
   productName,
   productImageUrl,
   productPrice,
}: any) {
   const myLoader: ImageLoader = ({ src }) => {
      return src;
   };
   return (
      <div className="w-fit h-fit hover:scale-[102%] duration-300 bg-white border border-gray-200 rounded-lg shadow-sm">
         <a href="#">
            <Image
               className="rounded-t-lg w-64 aspect-square"
               loader={myLoader}
               src={productImageUrl}
               width={500}
               height={500}
               priority
               unoptimized
               alt={productName}
            />
         </a>
         <div className="px-5 py-5">
            <a href="#">
               <h5 className="text-lg font-semibold tracking-tight text-gray-900">
                  {productName}
               </h5>
            </a>
            <div className="flex items-center justify-between">
               <span className="text-md font-bold text-gray-900">
                  {toRupiah(productPrice, { replaceZeroDecimals: true })}
               </span>
               <button className="text-white bg-blue-700 hover:bg-blue-800 cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center ">
                  Order
               </button>
            </div>
         </div>
      </div>
   );
}
