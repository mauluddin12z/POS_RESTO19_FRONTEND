import React from "react";
import SkeletonLoading from "../ui/SkeletonLoading";

export default function OrderItemLoading() {
   return (
      <div className="w-full h-64 border border-gray-300 rounded-lg p-2">
         <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
               <div className="w-10 h-10">
                  <SkeletonLoading />
               </div>
               <div className="flex flex-col gap-2 items-end">
                  <div className="w-10 h-3">
                     <SkeletonLoading />
                  </div>
                  <div className="w-36 h-4">
                     <SkeletonLoading />
                  </div>
                  <div className="w-24 h-4">
                     <SkeletonLoading />
                  </div>
               </div>
            </div>
            <div className="w-full h-36">
               <SkeletonLoading />
            </div>
         </div>
      </div>
   );
}
