import { ExpenseFormInterface } from "@/types";

export const expensePaymentMethods = [
  "Cash",
  "Bank Transfer",
  "Debit",
  "Credit Card",
  "QRIS",
  "E-Wallet",
];

export const emptyExpenseForm: ExpenseFormInterface = {
  expenseId: "",
  expenseName: "",
  category: "Bahan Baku",
  paymentMethod: "Cash",
  amount: "0",
  expenseDate: new Date().toISOString().slice(0, 10),
  description: "",
};
