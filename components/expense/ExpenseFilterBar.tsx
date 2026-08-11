import { CalendarRange, Download, FileSpreadsheet, Search } from "lucide-react";

import { expensePaymentMethods } from "@/constants/expense";
import { DatePreset } from "@/constants/expense-page";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

const selectClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

const datePresets: [DatePreset, string][] = [
  ["today", "Hari ini"],
  ["7d", "7 hari"],
  ["30d", "30 hari"],
  ["month", "Bulan ini"],
  ["all", "Semua"],
];

interface ExpenseFilterBarProps {
  query: string;
  setQuery: (value: string) => void;
  methodFilter: string;
  setMethodFilter: (value: string) => void;
  fromDate: string;
  setFromDate: (value: string) => void;
  toDate: string;
  setToDate: (value: string) => void;
  applyPreset: (preset: DatePreset) => void;
  onExportCSV: () => void;
  onExportXLSX: () => void;
}

export default function ExpenseFilterBar({
  query,
  setQuery,
  methodFilter,
  setMethodFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  applyPreset,
  onExportCSV,
  onExportXLSX,
}: Readonly<ExpenseFilterBarProps>) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari data pengeluaran, atau catatan…"
          className={inputClass + " pl-9"}
        />
      </div>

      <select
        value={methodFilter}
        onChange={(e) => setMethodFilter(e.target.value)}
        className={selectClass + " w-auto min-w-[150px]"}
      >
        <option value="all">Semua metode</option>
        {expensePaymentMethods.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <div className="flex w-full flex-wrap items-center gap-3 border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-14 w-14 text-muted-foreground" />
          <input
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => setFromDate(e.target.value)}
            className={inputClass + " w-auto"}
            aria-label="Tanggal mulai"
          />
          <span className="text-sm text-muted-foreground">s/d</span>
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => setToDate(e.target.value)}
            className={inputClass + " w-auto"}
            aria-label="Tanggal akhir"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {datePresets.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary cursor-pointer"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer"
          >
            <Download className="h-4 w-4" /> CSV
          </button>
          <button
            type="button"
            onClick={onExportXLSX}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </button>
        </div>
      </div>
    </div>
  );
}
