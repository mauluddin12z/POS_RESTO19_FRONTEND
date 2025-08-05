
// -----------------------------
// API Utility Functions
// -----------------------------

import useSWR from "swr";
import axiosInstance from "./axiosInstance";

// Fetch all users
export const fetchUsers = async () => {
   const response = await axiosInstance.get("/users");
   return response.data.data; // Adjust if your API returns differently
};

// Create a new user
export const createUser = async (userData: any) => {
   const response = await axiosInstance.post("/users", userData);
   return response.data.data;
};

// Update a user by ID
export const updateUser = async (id: string | number, updatedData: any) => {
   const response = await axiosInstance.patch(`/users/${id}`, updatedData);
   return response.data.data;
};

// Delete a user by ID
export const deleteUser = async (id: string | number) => {
   const response = await axiosInstance.delete(`/users/${id}`);
   return response.data;
};

// -----------------------------
// SWR Hook for Fetching Users
// -----------------------------

export const useUsers = () => {
   const { data, error, isValidating, mutate } = useSWR("users", fetchUsers, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return {
      users: data,
      isLoading: !error && !data,
      isError: error,
      mutate, // allows you to refresh after changes
   };
};
