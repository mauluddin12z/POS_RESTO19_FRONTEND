import React from "react";
import SkeletonLoading from "../ui/SkeletonLoading";
import CategoryCard from "./CategoryCard";

interface Props {
   categories: { categoryId: number; categoryName: string }[];
   activeCategoryId: number | null | undefined;
   loadingCategories: boolean;
   onCategoryClick: (id: number | null) => void;
}

const MenuFilters: React.FC<Props> = ({
   categories,
   activeCategoryId,
   onCategoryClick,
   loadingCategories,
}) => {
   return (
      <div
         className={`relative flex gap-2 max-w-full ${
            loadingCategories ? "overflow-hidden" : "overflow-x-auto"
         } rounded-lg`}
      >
         {loadingCategories ? (
            <>
               {[...Array(4)].map((_, index) => (
                  <div key={index} className="min-w-20 min-h-6">
                     <SkeletonLoading />
                  </div>
               ))}
            </>
         ) : (
            <>
               <CategoryCard
                  categoryId={null}
                  categoryName="All Menus"
                  activeCategoryId={activeCategoryId}
                  onClick={onCategoryClick}
               />
               {categories?.map((cat) => (
                  <CategoryCard
                     key={cat.categoryId}
                     categoryId={cat.categoryId}
                     categoryName={cat.categoryName}
                     activeCategoryId={activeCategoryId}
                     onClick={onCategoryClick}
                  />
               ))}
            </>
         )}
      </div>
   );
};

export default MenuFilters;
