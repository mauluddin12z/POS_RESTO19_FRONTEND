import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { DatePreset } from "@/constants/expense-page";

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function useExpenseFilters() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "",
    paymentMethod: "",
    fromDate: "",
    toDate: "",
    page: 1,
    pageSize: 10,
  });

  const debouncedQuery = useDebounce(query, 300);

  // Search
  useEffect(() => {
    setFilters((prev) => {
      if (prev.searchQuery === debouncedQuery) {
        return prev;
      }

      return { ...prev, searchQuery: debouncedQuery, page: 1 };
    });
  }, [debouncedQuery]);

  // Payment method
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      paymentMethod: methodFilter === "all" ? "" : methodFilter,
      page: 1,
    }));
  }, [methodFilter]);

  // Date range
  useEffect(() => {
    setFilters((prev) => ({ ...prev, fromDate, toDate, page: 1 }));
  }, [fromDate, toDate]);

  const setPage = (page: number) => setFilters((prev) => ({ ...prev, page }));

  // DATE PRESETS

  const applyPreset = (preset: DatePreset) => {
    const today = new Date();

    if (preset === "all") {
      setFromDate("");
      setToDate("");
      return;
    }

    if (preset === "today") {
      const value = toDateInputValue(today);
      setFromDate(value);
      setToDate(value);
      return;
    }

    if (preset === "7d") {
      const from = new Date(today);
      from.setDate(from.getDate() - 6);
      setFromDate(toDateInputValue(from));
      setToDate(toDateInputValue(today));
      return;
    }

    if (preset === "30d") {
      const from = new Date(today);
      from.setDate(from.getDate() - 29);
      setFromDate(toDateInputValue(from));
      setToDate(toDateInputValue(today));
      return;
    }

    if (preset === "month") {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      setFromDate(toDateInputValue(from));
      setToDate(toDateInputValue(today));
    }
  };

  return {
    query,
    setQuery,
    categoryFilter,
    setCategoryFilter,
    methodFilter,
    setMethodFilter,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    applyPreset,
    filters,
    setPage,
  };
}
