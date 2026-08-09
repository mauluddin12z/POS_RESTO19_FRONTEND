import { useMemo, useState } from "react";
import { ExpenseInterface } from "@/types";
import { SortKey } from "@/constants/expense-page";

export function useExpenseSort(rows: ExpenseInterface[]) {
  const [sortKey, setSortKey] = useState<SortKey>("expenseDate");
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(key === "expenseName");
    }
  };

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      let comparison = 0;

      if (sortKey === "amount") {
        comparison = Number(a.amount) - Number(b.amount);
      } else if (sortKey === "expenseName") {
        comparison = a.expenseName.localeCompare(b.expenseName);
      } else if (sortKey === "category") {
        comparison = a.category.localeCompare(b.category);
      } else if (sortKey === "paymentMethod") {
        comparison = a.paymentMethod.localeCompare(b.paymentMethod);
      } else {
        comparison = a.expenseDate.localeCompare(b.expenseDate);
      }

      return sortAsc ? comparison : -comparison;
    });
  }, [rows, sortKey, sortAsc]);

  return { sortKey, sortAsc, toggleSort, sortedRows };
}
