import { Trash2 } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { priceFormat } from "@/utils/priceFormat";
import { DialogState } from "@/constants/expense-page";

interface DeleteExpenseModalProps {
  dialog: DialogState;
  isSubmitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteExpenseModal({
  dialog,
  isSubmitting,
  onConfirm,
  onClose,
}: Readonly<DeleteExpenseModalProps>) {
  return (
    <Modal
      isOpen={dialog.mode === "delete"}
      onClose={onClose}
      title="Hapus Pengeluaran"
      description="Tindakan ini tidak dapat dibatalkan"
      icon={<Trash2 className="h-5 w-5" />}
      size="sm"
      footer={
        <>
          <Button variant="default" onClick={onClose}>
            Batal
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            isLoading={isSubmitting}
            loadingText="Loading"
          >
            <div className="flex gap-x-2">
              <Trash2 className="h-4 w-4" />
              Hapus
            </div>
          </Button>
        </>
      }
    >
      {dialog.mode === "delete" && (
        <div>
          <p className="font-semibold">{dialog.record.expenseName}</p>

          <p className="text-sm text-muted-foreground">
            {dialog.record.category}
          </p>

          <p className="mt-2 text-sm">Yakin ingin menghapus pengeluaran ini?</p>

          <p className="mt-1 font-bold">
            {priceFormat(Number(dialog.record.amount))}
          </p>
        </div>
      )}
    </Modal>
  );
}
