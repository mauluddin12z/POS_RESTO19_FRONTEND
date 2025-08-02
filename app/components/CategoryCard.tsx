import React from "react";

interface CategoryCardProps {
   categoryId: number | null;
   categoryName: string;
   activeCategoryId: number | null;
   onClick: (categoryId: number | null, categoryName: string) => void;
}

export default function CategoryCard({
   categoryId,
   categoryName,
   activeCategoryId,
   onClick,
}: CategoryCardProps) {
   const isActive = categoryId === activeCategoryId;

   return (
      <div
         onClick={() => onClick(categoryId, categoryName)}
         className={`flex-shrink-0 flex justify-center items-center w-48 h-16 text-gray-900 ${
            isActive ? "bg-gray-200" : "bg-gray-100"
         } hover:bg-gray-200 cursor-pointer font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
            categoryId == null && `sticky left-0`
         }`}
      >
         {categoryName}
      </div>
   );
}
