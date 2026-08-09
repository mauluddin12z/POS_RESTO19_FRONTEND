"use client";

import { Plus } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import { PageShell } from "@/components/ui/PageShell";
import { useExpenses } from "@/api/expenseServices";

import { useExpenseFilters } from "@/hooks/useExpenseFilters";
import { useExpenseSort } from "@/hooks/useExpenseSort";
import { useExpenseDialog } from "@/hooks/useExpenseDialog";

import ExpenseStats from "@/components/expense/ExpenseStats";
import ExpenseFilterBar from "@/components/expense/ExpenseFilterBar";
import ExpenseTable from "@/components/expense/ExpenseTable";
import ExpenseFormModal from "@/components/expense/ExpenseFormModal";
import DeleteExpenseModal from "@/components/expense/DeleteExpenseModal";

import { ExpenseInterface } from "@/types";
import {
  exportExpensesToCSV,
  exportExpensesToXLSX,
} from "@/constants/exportExpenses";

export default function Page() {
  // Search / category / payment method / date range filters
  const {
    query,
    setQuery,
    methodFilter,
    setMethodFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    applyPreset,
    filters,
    setPage,
  } = useExpenseFilters();

  // Data
  const { expenses, isLoading, mutate } = useExpenses(filters);
  const rows: ExpenseInterface[] = expenses?.data ?? [];

  // Sorting
  const { sortKey, toggleSort, sortedRows } = useExpenseSort(rows);

  // Dialog (create / edit / delete) + form state + CRUD handlers
  const {
    dialog,
    formData,
    formErrors,
    isSubmitting,
    openCreate,
    openEdit,
    openDelete,
    close,
    handleChange,
    handleAmountChange,
    handleSubmit,
    handleDelete,
  } = useExpenseDialog(mutate);

  return (
    <MainLayout>
      <PageShell
        title="Pengeluaran"
        description="Kelola pengeluaran operasional"
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="flex cursor-pointer items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Pengeluaran
          </button>
        }
      >
        <ExpenseStats rows={rows} />

        <ExpenseFilterBar
          query={query}
          setQuery={setQuery}
          methodFilter={methodFilter}
          setMethodFilter={setMethodFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          applyPreset={applyPreset}
          onExportCSV={() => exportExpensesToCSV(sortedRows)}
          onExportXLSX={() => exportExpensesToXLSX(sortedRows)}
        />

        <ExpenseTable
          rows={sortedRows}
          isLoading={isLoading}
          sortKey={sortKey}
          toggleSort={toggleSort}
          onEdit={openEdit}
          onDelete={openDelete}
          pagination={expenses?.pagination}
          onPageChange={setPage}
        />

        <ExpenseFormModal
          dialog={dialog}
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onAmountChange={handleAmountChange}
          onSubmit={handleSubmit}
          onClose={close}
        />

        <DeleteExpenseModal
          dialog={dialog}
          isSubmitting={isSubmitting}
          onConfirm={handleDelete}
          onClose={close}
        />
      </PageShell>
    </MainLayout>
  );
}
