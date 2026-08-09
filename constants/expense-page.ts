import { ExpenseFormInterface, ExpenseInterface } from "@/types";

export type DialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; record: ExpenseInterface }
  | { mode: "delete"; record: ExpenseInterface };

export type FormErrors = Partial<Record<keyof ExpenseFormInterface, string>>;

export type SortKey =
  | "expenseName"
  | "category"
  | "paymentMethod"
  | "amount"
  | "expenseDate";

export interface ExpenseFilterInterface {
  searchQuery?: string;
  category?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export type DatePreset = "today" | "7d" | "30d" | "month" | "all";
