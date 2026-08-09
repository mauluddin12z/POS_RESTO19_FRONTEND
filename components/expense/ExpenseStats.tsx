import { CalendarDays, Receipt, Wallet } from "lucide-react";

import StatCard from "@/components/expense/StatCard";
import momentInstance from "@/utils/momentConfig";
import { priceFormat } from "@/utils/priceFormat";
import { ExpenseInterface } from "@/types";

interface ExpenseStatsProps {
  rows: ExpenseInterface[];
}

export default function ExpenseStats({ rows }: Readonly<ExpenseStatsProps>) {
  const total = rows.reduce((sum, expense) => sum + Number(expense.amount), 0);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthTotal = rows
    .filter((expense) => expense.expenseDate.startsWith(currentMonth))
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const biggest = rows.reduce<ExpenseInterface | null>((largest, expense) => {
    if (!largest || Number(expense.amount) > Number(largest.amount)) {
      return expense;
    }
    return largest;
  }, null);

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<Wallet className="h-5 w-5" />}
        label="Total Pengeluaran"
        value={priceFormat(total)}
        hint={`${rows.length} transaksi`}
      />

      <StatCard
        icon={<CalendarDays className="h-5 w-5" />}
        label="Bulan Ini"
        value={priceFormat(monthTotal)}
        hint={momentInstance(currentMonth).format("MMMM")}
      />

      <StatCard
        icon={<Receipt className="h-5 w-5" />}
        label="Rata-rata"
        value={priceFormat(rows.length ? Math.round(total / rows.length) : 0)}
        hint="Per transaksi"
      />

      <StatCard
        icon={<Wallet className="h-5 w-5" />}
        label="Terbesar"
        value={biggest ? priceFormat(Number(biggest.amount)) : "Rp 0"}
        hint={biggest?.expenseName || "Tidak ada data"}
      />
    </div>
  );
}
