import useSWR from "swr";
import axiosInstance from "./axiosInstance";
import { ExpenseFilterInterface } from "@/types";

// Query Params Utility
export const buildQueryParams = (filters: ExpenseFilterInterface) => {
  const params = new URLSearchParams();

  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    // Nested object
    if (typeof value === "object" && !Array.isArray(value)) {
      Object.entries(value).forEach(([op, v]) => {
        if (v === null || v === undefined || v === "") return;

        params.append(`${key}[${op}]`, String(v));
      });

      return;
    }

    // Arrays
    if (Array.isArray(value)) {
      params.append(`${key}[in]`, value.join(","));
      return;
    }

    // Normal values
    params.append(key, String(value));
  });

  return params.toString();
};

// API Functions

export const fetchExpenses = async (filters: ExpenseFilterInterface) => {
  const queryString = buildQueryParams(filters);

  try {
    const response = await axiosInstance.get(`/expenses?${queryString}`);

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Error fetching expenses",
    );
  }
};

export const getExpenseById = async (expenseId: number) => {
  const response = await axiosInstance.get(`/expenses/${expenseId}`);

  return response.data;
};

export const createExpense = async (expenseData: object) => {
  const response = await axiosInstance.post("/expenses", expenseData);

  return response.data;
};

export const updateExpense = async (
  id: string | number,
  updatedData: object,
) => {
  const response = await axiosInstance.patch(`/expenses/${id}`, updatedData);

  return response.data;
};

export const deleteExpense = async (id: string | number) => {
  const response = await axiosInstance.delete(`/expenses/${id}`);

  return response.data;
};

// SWR Hook for Expenses

export const useExpenses = (filters?: ExpenseFilterInterface) => {
  const key = filters ? ["expenses", filters] : null;

  const fetcher = ([_, filters]: [string, ExpenseFilterInterface]) =>
    fetchExpenses(filters);

  const { data, error, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    expenses: data,
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
};
