import * as XLSX from "xlsx";
import { ExpenseInterface } from "@/types";

function toExportRows(rows: ExpenseInterface[]) {
  return rows.map((expense) => ({
    Tanggal: expense.expenseDate,
    Pengeluaran: expense.expenseName,
    Kategori: expense.category,
    Metode: expense.paymentMethod,
    Nominal: Number(expense.amount),
    Deskripsi: expense.description ?? "",
  }));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function exportExpensesToCSV(rows: ExpenseInterface[]) {
  const worksheet = XLSX.utils.json_to_sheet(toExportRows(rows));
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });

  downloadBlob(blob, `pengeluaran-${todayStamp()}.csv`);
}

export function exportExpensesToXLSX(rows: ExpenseInterface[]) {
  const worksheet = XLSX.utils.json_to_sheet(toExportRows(rows));
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Pengeluaran");
  XLSX.writeFile(workbook, `pengeluaran-${todayStamp()}.xlsx`);
}
