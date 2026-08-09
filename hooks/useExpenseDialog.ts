import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "@/api/expenseServices";
import { ExpenseFormInterface, ExpenseInterface } from "@/types";
import { emptyExpenseForm } from "@/constants/expense";
import { DialogState, FormErrors } from "@/constants/expense-page";

export function useExpenseDialog(mutate: () => Promise<any>) {
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });
  const [formData, setFormData] =
    useState<ExpenseFormInterface>(emptyExpenseForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ------------------------------------------------------------
  // OPEN / CLOSE
  // ------------------------------------------------------------

  const openCreate = () => {
    setFormData({
      ...emptyExpenseForm,
      expenseDate: new Date().toISOString().slice(0, 10),
    });
    setFormErrors({});
    setDialog({ mode: "create" });
  };

  const openEdit = (record: ExpenseInterface) => {
    setFormData({
      expenseId: String(record.expenseId),
      expenseName: record.expenseName,
      category: record.category,
      paymentMethod: record.paymentMethod,
      amount: String(record.amount),
      expenseDate: record.expenseDate,
      description: record.description ?? "",
    });
    setFormErrors({});
    setDialog({ mode: "edit", record });
  };

  const openDelete = (record: ExpenseInterface) => {
    setDialog({ mode: "delete", record });
  };

  const close = () => {
    setDialog({ mode: "closed" });
    setFormErrors({});
  };

  // ------------------------------------------------------------
  // INPUT CHANGE
  // ------------------------------------------------------------

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name as keyof ExpenseFormInterface]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAmountChange = (rawValue: string) => {
    setFormData((prev) => ({
      ...prev,
      amount: rawValue.replace(/\D/g, ""),
    }));
  };

  // ------------------------------------------------------------
  // VALIDATION
  // ------------------------------------------------------------

  const validate = () => {
    const errors: FormErrors = {};
    const amount = Number(formData.amount);

    if (!formData.expenseName.trim()) {
      errors.expenseName = "Nama pengeluaran wajib diisi.";
    } else if (formData.expenseName.trim().length < 2) {
      errors.expenseName = "Minimal 2 karakter.";
    }

    if (!formData.category.trim()) {
      errors.category = "Kategori wajib diisi.";
    }

    if (!formData.paymentMethod.trim()) {
      errors.paymentMethod = "Metode pembayaran wajib dipilih.";
    }

    if (!formData.amount.trim()) {
      errors.amount = "Nominal wajib diisi.";
    } else if (!Number.isFinite(amount) || amount <= 0) {
      errors.amount = "Nominal harus lebih dari 0.";
    }

    if (!formData.expenseDate) {
      errors.expenseDate = "Tanggal pengeluaran wajib diisi.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ------------------------------------------------------------
  // SUBMIT (CREATE / UPDATE)
  // ------------------------------------------------------------

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      expenseName: formData.expenseName.trim(),
      category: formData.category.trim(),
      paymentMethod: formData.paymentMethod.trim(),
      amount: Number(formData.amount),
      expenseDate: formData.expenseDate,
      description: formData.description?.trim() || null,
    };

    if (dialog.mode === "create") {
      const toastId = toast.loading("Sedang menambahkan pengeluaran...");
      setIsSubmitting(true);

      try {
        const response = await createExpense(payload);
        toast.success(
          response?.message || "Pengeluaran berhasil ditambahkan.",
          { id: toastId },
        );
        await mutate();
        close();
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Gagal menambahkan pengeluaran.",
          { id: toastId },
        );
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (dialog.mode === "edit") {
      const toastId = toast.loading("Sedang memperbarui pengeluaran...");
      setIsSubmitting(true);

      try {
        const response = await updateExpense(dialog.record.expenseId, payload);
        toast.success(response?.message || "Pengeluaran berhasil diperbarui.", {
          id: toastId,
        });
        await mutate();
        close();
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Gagal memperbarui pengeluaran.",
          { id: toastId },
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // ------------------------------------------------------------
  // DELETE
  // ------------------------------------------------------------

  const handleDelete = async () => {
    if (dialog.mode !== "delete") {
      return;
    }

    const toastId = toast.loading("Sedang menghapus pengeluaran...");
    setIsSubmitting(true);

    try {
      const response = await deleteExpense(dialog.record.expenseId);
      toast.success(response?.message || "Pengeluaran berhasil dihapus.", {
        id: toastId,
      });
      await mutate();
      close();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Gagal menghapus pengeluaran.",
        { id: toastId },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
