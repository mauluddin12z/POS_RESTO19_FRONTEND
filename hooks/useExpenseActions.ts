import {
  createExpense,
  updateExpense,
  deleteExpense,
} from "@/api/expenseServices";
import { ExpenseFormInterface } from "../types";
import { MESSAGES } from "../constants/messages";
import toast from "react-hot-toast";

/**
 * Custom hook to manage Expense-related actions
 */
const useExpenseActions = () => {
  /**
   * Validates expense form data and returns error messages
   */
  const validateExpenseForm = (formData: ExpenseFormInterface) => {
    const errors = {
      expenseName: "",
      category: "",
      paymentMethod: "",
      amount: "",
      expenseDate: "",
    };

    const amount = Number(formData.amount);

    if (!formData.expenseName.trim()) {
      errors.expenseName = "Nama pengeluaran wajib diisi.";
    }

    if (!formData.category.trim()) {
      errors.category = "Kategori wajib diisi.";
    }

    if (!formData.paymentMethod.trim()) {
      errors.paymentMethod = "Metode pembayaran wajib dipilih.";
    }

    if (Number.isNaN(amount) || amount <= 0) {
      errors.amount = "Nominal harus lebih dari 0.";
    }

    if (!formData.expenseDate) {
      errors.expenseDate = "Tanggal pengeluaran wajib diisi.";
    }

    return errors;
  };

  /**
   * Handles adding a new expense
   */
  const handleAddExpense = async ({
    formData,
    setIsSubmitting,
    closeAddModal,
    mutate,
    setFormErrors,
  }: {
    formData: ExpenseFormInterface;
    setIsSubmitting: (val: boolean) => void;
    closeAddModal: () => void;
    mutate: () => void;
    setFormErrors: (errors: any) => void;
  }) => {
    setIsSubmitting(true);

    const validationErrors = validateExpenseForm(formData);

    setFormErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((e) => e !== "");

    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    const toastId = toast.loading("Sedang menambahkan pengeluaran...");

    try {
      const expenseData = {
        expenseName: formData.expenseName.trim(),
        category: formData.category.trim(),
        paymentMethod: formData.paymentMethod.trim(),
        amount: Number(formData.amount),
        expenseDate: formData.expenseDate,
        description: formData.description?.trim() || null,
      };

      const res = await createExpense(expenseData);

      toast.success(MESSAGES.EXPENSE?.CREATE_SUCCESS || res?.message, {
        id: toastId,
      });
    } catch (error: any) {
      toast.error(
        MESSAGES.GENERAL.ERROR ||
          error?.response?.data?.message ||
          error.message,
        { id: toastId },
      );
    } finally {
      mutate();
      closeAddModal();
      setIsSubmitting(false);
    }
  };

  /**
   * Handles editing an existing expense
   */
  const handleEditExpense = async ({
    expenseId,
    formData,
    closeEditModal,
    setIsSubmitting,
    mutate,
    setFormErrors,
  }: {
    expenseId: number;
    formData: ExpenseFormInterface;
    closeEditModal: () => void;
    setIsSubmitting: (val: boolean) => void;
    mutate: () => void;
    setFormErrors: (errors: any) => void;
  }) => {
    setIsSubmitting(true);

    const validationErrors = validateExpenseForm(formData);

    setFormErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((e) => e !== "");

    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    const toastId = toast.loading("Sedang memperbarui pengeluaran...");

    try {
      const expenseData = {
        expenseName: formData.expenseName.trim(),
        category: formData.category.trim(),
        paymentMethod: formData.paymentMethod.trim(),
        amount: Number(formData.amount),
        expenseDate: formData.expenseDate,
        description: formData.description?.trim() || null,
      };

      const res = await updateExpense(expenseId, expenseData);

      toast.success(MESSAGES.EXPENSE?.UPDATE_SUCCESS || res?.message, {
        id: toastId,
      });
    } catch (error: any) {
      toast.error(
        MESSAGES.GENERAL.ERROR ||
          error?.response?.data?.message ||
          error.message,
        { id: toastId },
      );
    } finally {
      mutate();
      closeEditModal();
      setIsSubmitting(false);
    }
  };

  /**
   * Handles deleting an expense
   */
  const handleDeleteExpense = async ({
    expenseId,
    setIsDeleting,
    closeDeleteModal,
    mutate,
  }: {
    expenseId: number;
    setIsDeleting: (val: boolean) => void;
    closeDeleteModal: () => void;
    mutate: () => void;
  }) => {
    setIsDeleting(true);

    const toastId = toast.loading("Sedang menghapus pengeluaran...");

    try {
      const res = await deleteExpense(expenseId);

      toast.success(MESSAGES.EXPENSE?.DELETE_SUCCESS || res?.message, {
        id: toastId,
      });
    } catch (error: any) {
      toast.error(
        MESSAGES.GENERAL.ERROR ||
          error?.response?.data?.message ||
          error.message,
        { id: toastId },
      );
    } finally {
      mutate();
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  return {
    handleAddExpense,
    handleEditExpense,
    handleDeleteExpense,
  };
};

export default useExpenseActions;
