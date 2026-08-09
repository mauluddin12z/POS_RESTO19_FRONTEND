import { Pencil, Trash2 } from "lucide-react";

import Pagination from "@/components/ui/Pagination";
import SortableTh from "@/components/expense/SortableTh";
import momentInstance from "@/utils/momentConfig";
import { priceFormat } from "@/utils/priceFormat";
import { ExpenseInterface } from "@/types";
import { SortKey } from "@/constants/expense-page";

interface ExpenseTableProps {
  rows: ExpenseInterface[];
  isLoading: boolean;
  sortKey: SortKey;
  toggleSort: (key: SortKey) => void;
  onEdit: (record: ExpenseInterface) => void;
  onDelete: (record: ExpenseInterface) => void;
  pagination?: {
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
    pageSize?: number;
    hasNextPage?: boolean;
  };
  onPageChange: (page: number) => void;
}

export default function ExpenseTable({
  rows,
  isLoading,
  sortKey,
  toggleSort,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}: Readonly<ExpenseTableProps>) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <SortableTh
                label="Tanggal"
                active={sortKey === "expenseDate"}
                onClick={() => toggleSort("expenseDate")}
              />

              <SortableTh
                label="Pengeluaran"
                active={sortKey === "expenseName"}
                onClick={() => toggleSort("expenseName")}
              />

              <SortableTh
                label="Kategori"
                active={sortKey === "category"}
                onClick={() => toggleSort("category")}
              />

              <SortableTh
                label="Metode"
                active={sortKey === "paymentMethod"}
                onClick={() => toggleSort("paymentMethod")}
              />

              <SortableTh
                label="Nominal"
                active={sortKey === "amount"}
                onClick={() => toggleSort("amount")}
                align="right"
              />

              <th className="px-4 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Loading...
                </td>
              </tr>
            )}

            {!isLoading &&
              rows.map((expense) => (
                <tr
                  key={expense.expenseId}
                  className="border-b border-border last:border-0 hover:bg-secondary/30"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {momentInstance(expense.expenseDate).format("DD MMMM YYYY")}
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">
                      {expense.expenseName}
                    </p>

                    {expense.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {expense.description}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {expense.category}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {expense.paymentMethod}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-right font-bold">
                    {priceFormat(Number(expense.amount))}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        aria-label="Edit pengeluaran"
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border transition-colors hover:border-primary hover:bg-primary hover:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(expense)}
                        aria-label="Hapus pengeluaran"
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-destructive/30 text-destructive transition-colors hover:bg-destructive hover:text-white"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!isLoading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  Tidak ada data pengeluaran.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center py-4">
        <Pagination
          totalItems={pagination?.totalItems ?? 0}
          totalPages={pagination?.totalPages ?? 0}
          currentPage={pagination?.currentPage ?? 1}
          pageSize={pagination?.pageSize ?? 10}
          hasNextPage={pagination?.hasNextPage ?? false}
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
