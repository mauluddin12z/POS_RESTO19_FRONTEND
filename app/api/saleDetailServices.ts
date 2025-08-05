import useSWR from "swr";
import axiosInstance from "./axiosInstance";

// Fetcher function for SWR (using axios)
export const fetchSaleDetails = async () => {
   const res = await axiosInstance.get(`/sale-details`);
   return res.data.data;
};

export const useSaleDetails = () => {
   // Using SWR to fetch salesDetails
   const { data, error, isValidating } = useSWR(
      "sale-details",
      fetchSaleDetails,
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   // Return loading state, data, and error
   return {
      salesDetail: data,
      isLoading: isValidating,
      isError: error,
   };
};

// create sale detail function
export const createSaleDetail = async (formData: any) => {
   const res = await axiosInstance.post(`/sale-detail`, formData);
   return res.data;
};
