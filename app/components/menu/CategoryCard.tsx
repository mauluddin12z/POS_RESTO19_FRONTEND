import React from "react";
import { CategoryCardPropsInterface } from "../types";

export default function CategoryCard({
   categoryId,
   categoryName,
   activeCategoryId,
   onClick,
}: CategoryCardPropsInterface) {
   const isActive = categoryId === activeCategoryId;

   return (
      <button
         disabled={isActive}
         onClick={() => onClick(categoryId, categoryName)}
         className={`flex-shrink-0 flex justify-center items-center ${
            isActive
               ? "bg-blue-700 hover:bg-blue-800  text-white"
               : "bg-gray-100 hover:bg-gray-200 text-gray-900 cursor-pointer"
         } font-medium rounded-lg text-sm px-2 py-2 text-center ${
            categoryId === null && "sticky  left-0"
         }`}
      >
         {categoryName}
      </button>
   );
}
