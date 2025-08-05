import useSWR from "swr";
import axiosInstance from "./axiosInstance";

// Fetcher function for SWR (using axios)
export const fetchSales = async () => {
   const res = await axiosInstance.get(`/sales`);
   return res.data.data;
};

export const useSales = () => {
   // Using SWR to fetch sales
   const { data, error, isValidating } = useSWR("sales", fetchSales, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   // Return loading state, data, and error
   return {
      sales: data,
      isLoading: isValidating,
      isError: error,
   };
};

// create sale function
export const createSale = async (formData: any) => {
   const res = await axiosInstance.post(`/sale`, formData);
   return res.data;
};
