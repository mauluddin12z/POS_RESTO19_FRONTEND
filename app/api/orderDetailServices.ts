import useSWR from "swr";
import axiosInstance from "./axiosInstance";

// Fetcher function for SWR (using axios)
export const fetchOrderDetails = async () => {
   const res = await axiosInstance.get(`/order-details`);
   return res.data.data;
};

export const useOrderDetails = () => {
   // Using SWR to fetch orderDetails
   const { data, error, isValidating } = useSWR(
      "order-details",
      fetchOrderDetails,
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   // Return loading state, data, and error
   return {
      orderDetail: data,
      isLoading: isValidating,
      isError: error,
   };
};

// create order detail function
export const createOrderDetail = async (formData: any) => {
   const res = await axiosInstance.post(`/order-detail`, formData);
   return res.data;
};
