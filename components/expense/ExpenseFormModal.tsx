import { FormEvent } from "react";
import { Pencil, Wallet } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { priceFormat } from "@/utils/priceFormat";
import { ExpenseFormInterface } from "@/types";
import { expensePaymentMethods } from "@/constants/expense";
import { DialogState, FormErrors } from "@/constants/expense-page";

type ChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

interface ExpenseFormModalProps {
  dialog: DialogState;
  formData: ExpenseFormInterface;
  formErrors: FormErrors;
  isSubmitting: boolean;
  onChange: (e: ChangeEvent) => void;
  onAmountChange: (rawValue: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export default function ExpenseFormModal({
  dialog,
  formData,
  formErrors,
  isSubmitting,
  onChange,
  onAmountChange,
  onSubmit,
  onClose,
}: Readonly<ExpenseFormModalProps>) {
  const isOpen = dialog.mode === "create" || dialog.mode === "edit";
  const isCreate = dialog.mode === "create";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCreate ? "Tambah Pengeluaran" : "Edit Pengeluaran"}
      description={
        isCreate
          ? "Catat pengeluaran operasional baru"
          : "Perbarui informasi pengeluaran"
      }
      icon={
        isCreate ? (
          <Wallet className="h-5 w-5" />
        ) : (
          <Pencil className="h-5 w-5" />
        )
      }
      size="lg"
      footer={
        <>
          <Button variant="default" onClick={onClose}>
            Batal
          </Button>

          <Button
            variant="primary"
            type="submit"
            form="expense-form"
            isLoading={isSubmitting}
            loadingText="Loading"
          >
            {isCreate ? "Tambah Pengeluaran" : "Simpan Perubahan"}
          </Button>
        </>
      }
    >
      <form id="expense-form" onSubmit={onSubmit} className="space-y-5">
        {/* Expense Name */}

        <div>
          <label
            htmlFor="expense-name"
            className="mb-1.5 block text-sm font-medium"
          >
            Nama Pengeluaran{" "}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
          </label>

          <input
            id="expense-name"
            name="expenseName"
            value={formData.expenseName}
            onChange={onChange}
            maxLength={150}
            placeholder="Contoh: Pembelian bahan baku"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />

          {formErrors.expenseName && (
            <p className="mt-1 text-xs text-red-500">
              {formErrors.expenseName}
            </p>
          )}
        </div>

        {/* Category + Date */}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="mb-1.5 block text-sm font-medium"
            >
              Kategori <span className="text-red-500">*</span>
            </label>

            <input
              id="category"
              name="category"
              value={formData.category}
              onChange={onChange}
              maxLength={150}
              placeholder="Contoh: Bahan Baku, Gas, Stok, Gaji, dll"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />

            {formErrors.category && (
              <p className="mt-1 text-xs text-red-500">{formErrors.category}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="expense-date"
              className="mb-1.5 block text-sm font-medium"
            >
              Tanggal <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              id="expense-date"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={onChange}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />

            {formErrors.expenseDate && (
              <p className="mt-1 text-xs text-red-500">
                {formErrors.expenseDate}
              </p>
            )}
          </div>
        </div>

        {/* Amount + Payment Method */}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="amount"
              className="mb-1.5 block text-sm font-medium"
            >
              Nominal <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                Rp
              </span>

              <input
                id="amount"
                name="amount"
                inputMode="numeric"
                value={formData.amount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>

            {formErrors.amount && (
              <p className="mt-1 text-xs text-red-500">{formErrors.amount}</p>
            )}

            {formData.amount && Number(formData.amount) > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {priceFormat(Number(formData.amount))}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="payment-method"
              className="mb-1.5 block text-sm font-medium"
            >
              Metode Pembayaran <span className="text-red-500">*</span>
            </label>

            <select
              id="payment-method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={onChange}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {expensePaymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>

            {formErrors.paymentMethod && (
              <p className="mt-1 text-xs text-red-500">
                {formErrors.paymentMethod}
              </p>
            )}
          </div>
        </div>

        {/* Description */}

        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium"
          >
            Deskripsi{" "}
            <span className="text-xs font-normal text-muted-foreground">
              (Opsional)
            </span>
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            maxLength={255}
            rows={3}
            placeholder="Keterangan tambahan..."
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
      </form>
    </Modal>
  );
}
