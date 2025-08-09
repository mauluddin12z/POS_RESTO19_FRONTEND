import React from "react";

export interface CategoryCardPropsInterface {
   categoryId: number | null;
   categoryName: string;
   activeCategoryId: number | null | undefined;
   onClick: (categoryId: number | null, categoryName: string) => void;
}

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
         className={`flex-shrink-0 flex justify-center items-center transition duration-150 ${
            isActive
               ? "bg-blue-600 text-white cursor-default"
               : "bg-gray-100 hover:bg-gray-200 text-gray-900 cursor-pointer"
         } font-medium rounded-lg text-sm px-2 py-2 text-center ${
            categoryId === null && "sticky  left-0"
         }`}
      >
         {categoryName}
      </button>
   );
}
