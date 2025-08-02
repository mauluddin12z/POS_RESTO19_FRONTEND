// utils/menuService.ts
import axiosInstance from "./axiosInstance";

export interface MenuFilter {
   categoryId: number | null;
   categoryName?: string;
   menuName?: string;
   minPrice?: number | null;
   maxPrice?: number | null;
   searchQuery?: string;
   sortBy?: string;
   sortOrder?: string;
}

export const fetchMenus = async (filters: MenuFilter) => {
   const params = new URLSearchParams();

   if (filters.categoryId !== null)
      params.append("categoryId", filters.categoryId.toString());
   if (filters.categoryName)
      params.append("categoryName", filters.categoryName);
   if (filters.menuName) params.append("menuName", filters.menuName);
   if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
   if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
   if (filters.searchQuery) params.append("searchQuery", filters.searchQuery);
   if (filters.sortBy) params.append("sortBy", filters.sortBy);
   if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

   const res = await axiosInstance.get(`/menus?${params.toString()}`);
   return res.data.data;
};
