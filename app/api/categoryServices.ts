import useSWR from "swr";
import axiosInstance from "./axiosInstance";

// -----------------------------
// API Utility Functions
// -----------------------------

// Fetch all categories
export const fetchCategories = async () => {
   const response = await axiosInstance.get("/categories");
   return response.data.data;
};

// Create a new category
export const createCategory = async (categoryData: any) => {
   const response = await axiosInstance.post("/category", categoryData);
   return response.data.data;
};

// Update a category by ID
export const updateCategory = async (id: string | number, updatedData: any) => {
   const response = await axiosInstance.patch(`/category/${id}`, updatedData);
   return response.data.data;
};

// Delete a category by ID
export const deleteCategory = async (id: string | number) => {
   const response = await axiosInstance.delete(`/category/${id}`);
   return response.data;
};

// -----------------------------
// SWR Hook for Fetching Categories
// -----------------------------

export const useCategories = () => {
   const { data, error, isValidating, mutate } = useSWR(
      "categories",
      fetchCategories,
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      categories: data,
      isLoading: !error && !data,
      isError: error,
      mutate,
   };
};
