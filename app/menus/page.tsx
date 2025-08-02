"use client";

import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "../components/MainLayout";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import { fetchMenus, MenuFilter } from "@/utils/menuServices";
import axiosInstance from "@/utils/axiosInstance";
import Loading from "../components/Loading";

// Menu item type definition
interface Menu {
   menuName: string;
   menuDescription: string;
   menuImageUrl: string;
   price: number;
   stock: number;
   categoryId: number;
   categoryName: string;
}

// Category type definition
interface Category {
   categoryName: string;
   categoryId: number;
}

export default function Page() {
   const [menus, setMenus] = useState<Menu[]>([]);
   const [categories, setCategories] = useState<Category[]>([]);

   // Filter state used for menu query
   const [filters, setFilters] = useState<MenuFilter>({
      categoryId: null,
      categoryName: "",
      menuName: "",
      minPrice: null,
      maxPrice: null,
      searchQuery: "",
      sortBy: "",
      sortOrder: "",
   });

   // Loading state for menus and categories
   const [loadingMenus, setLoadingMenus] = useState<boolean>(true);
   const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

   // Handle category selection (updates filters)
   const handleCategoryClick = useCallback((categoryId: number | null) => {
      setFilters((prev) => ({
         ...prev,
         categoryId,
      }));
   }, []);

   // Fetch menus when filters change
   useEffect(() => {
      const getMenus = async () => {
         setLoadingMenus(true);
         try {
            const data = await fetchMenus(filters);
            setMenus(data);
         } catch (error: any) {
            console.error(error.message || error);
         } finally {
            setLoadingMenus(false);
         }
      };

      getMenus();
   }, [filters]);

   // Fetch categories once on mount
   useEffect(() => {
      const fetchCategories = async () => {
         setLoadingCategories(true);
         try {
            const res = await axiosInstance.get("/categories");
            setCategories(res.data.data);
         } catch (error: any) {
            console.error(error.message || error);
         } finally {
            setLoadingCategories(false);
         }
      };

      fetchCategories();
   }, []);

   return (
      <MainLayout>
         <div className="w-full flex gap-4">
            <div className="w-full flex flex-col h-full gap-4 p-4 border border-gray-200 rounded-lg">
               {/* Render category filters or loading */}
               {loadingCategories ? (
                  <Loading />
               ) : (
                  <div className="relative flex gap-4 overflow-x-auto">
                     <CategoryCard
                        categoryId={null}
                        categoryName="Semua menu"
                        activeCategoryId={filters.categoryId}
                        onClick={handleCategoryClick}
                     />
                     {categories.map((category) => (
                        <CategoryCard
                           key={category.categoryId}
                           categoryId={category.categoryId}
                           categoryName={category.categoryName}
                           activeCategoryId={filters.categoryId}
                           onClick={handleCategoryClick}
                        />
                     ))}
                  </div>
               )}
               {/* Render menus or loading */}
               {loadingMenus ? (
                  <Loading />
               ) : menus.length === 0 ? (
                  <div className="w-full flex justify-center items-center mt-24">
                     No product available.
                  </div>
               ) : (
                  <div className="flex flex-wrap gap-4">
                     {menus.map((menu) => (
                        <ProductCard
                           key={menu.menuName + menu.categoryId}
                           productName={menu.menuName}
                           productImageUrl={menu.menuImageUrl}
                           productPrice={menu.price}
                        />
                     ))}
                  </div>
               )}
            </div>
            <div className="flex w-96 border border-gray-200 rounded-lg"></div>
         </div>
      </MainLayout>
   );
}
