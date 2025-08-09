"use client";
import React, { useState, useCallback, useEffect } from "react";
import { formatDateToIndonesian } from "../../utils/dateFormat";
import Modal from "../ui/Modal";
import { AlertType, OrderInterface } from "../../types";
import { deleteOrder } from "../../api/orderServices";
import { AxiosError } from "axios";
import Alert from "../ui/Alert";
import PaymentStatus from "../payment/PaymentStatus";
import usePayment from "../../hooks/usePayment";
import PaymentSuccessful from "../payment/PaymentSuccessful";
import ActionButtons from "./ActionButtons";
import PaymentModal from "./PaymentModal";
import OrderDetailsTable from "./OrderDetailsTable";
import EditOrderModal from "./EditOrderModal";
// import EditOrderModal from "./EditOrderModal"; // <-- Modal edit baru

interface OrderItemProps {
   order: OrderInterface;
   mutate: () => void;
   loading: boolean;
}

const OrderItem = ({ order, mutate }: OrderItemProps) => {
   const { date, time } = formatDateToIndonesian(order?.createdAt);
   const [selectedOrder, setSelectedOrder] = useState<OrderInterface | null>(
      null
   );
   const [modalState, setModalState] = useState<{
      type: "delete" | "payment" | "edit";
      isOpen: boolean;
   } | null>(null);

   const [isDeleting, setIsDeleting] = useState(false);
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);

   const {
      handlePayment,
      isSubmitting: isSubmittingPayment,
      paymentOptions,
      paymentMethod,
      paymentAlert,
      setPaymentMethod,
      paymentSuccess,
      onClosePaymentSuccessAlert,
   } = usePayment({ orderId: order.orderId, mutate });

   useEffect(() => {
      setAlert(paymentAlert);
   }, [paymentAlert]);

   const closeModal = useCallback(() => setModalState(null), []);

   const openPaymentModal = useCallback((order: OrderInterface) => {
      setSelectedOrder(order);
      setModalState({ type: "payment", isOpen: true });
   }, []);

   const openDeleteModal = useCallback((order: OrderInterface) => {
      setSelectedOrder(order);
      setModalState({ type: "delete", isOpen: true });
   }, []);

   const openEditModal = useCallback((order: OrderInterface) => {
      setSelectedOrder(order);
      setModalState({ type: "edit", isOpen: true });
   }, []);

   const handleDelete = useCallback(async () => {
      if (!selectedOrder?.orderId) return;
      setIsDeleting(true);

      try {
         const res = await deleteOrder(selectedOrder.orderId);
         setAlert({ type: "success", message: res?.message });
         mutate();
      } catch (error) {
         const errorMessage =
            error instanceof AxiosError
               ? error?.response?.data?.message ?? error.message
               : "An unknown error occurred.";
         setAlert({ type: "error", message: errorMessage });
      } finally {
         setIsDeleting(false);
         closeModal();
      }
   }, [selectedOrder, mutate]);

   const handleCloseAlert = () => setAlert(null);

   return (
      <div className="flex flex-col justify-between border border-gray-200 rounded-lg p-2 hover:shadow-sm">
         {/* Order Overview */}
         <div className="flex items-center justify-between flex-wrap border-b border-gray-200 pb-2">
            <div className="bg-blue-50 rounded-lg p-3.5 text-gray-600 font-medium">{`#${order.orderId}`}</div>
            <div className="flex flex-col items-end text-gray-600 gap-1">
               <PaymentStatus status={order.paymentStatus} />
               <div className="text-xs font-semibold">{date}</div>
               <div className="text-xs font-light">{time}</div>
            </div>
         </div>

         {/* Order Table */}
         <OrderDetailsTable
            orderDetails={order.orderDetails}
            isExpanded={false}
         />

         {/* Action Buttons */}
         <ActionButtons
            onEdit={() => openEditModal(order)}
            onDelete={() => openDeleteModal(order)}
            onInfo={() => openPaymentModal(order)}
            isPaid={order.paymentStatus === "paid"}
         />

         {/* Modal for Payment */}
         {modalState?.type === "payment" &&
            modalState.isOpen &&
            selectedOrder && (
               <PaymentModal
                  isOpen={modalState.isOpen}
                  onClose={closeModal}
                  order={selectedOrder}
                  date={date}
                  time={time}
                  paymentOptions={paymentOptions}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  handlePayment={handlePayment}
                  isSubmitting={isSubmittingPayment}
               />
            )}

         {/* Edit Modal */}
         {modalState?.type === "edit" && modalState.isOpen && selectedOrder && (
            <EditOrderModal
               isOpen={modalState.isOpen}
               onClose={closeModal}
               selectedOrder={selectedOrder}
               mutate={mutate}
               isSubmitting={isSubmittingPayment}
            />
         )}

         {/* Delete Confirmation Modal */}
         {modalState?.type === "delete" && modalState.isOpen && (
            <Modal isOpen={modalState.isOpen} onClose={closeModal}>
               <div>
                  Are you sure you want to delete this order?
                  <div className="mt-4 gap-4 flex justify-center">
                     <button
                        onClick={handleDelete}
                        className={`bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded-md ${
                           isDeleting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isDeleting}
                     >
                        {isDeleting ? "Deleting..." : "Yes, delete"}
                     </button>
                     <button
                        onClick={closeModal}
                        className="bg-gray-300 hover:bg-gray-400 cursor-pointer px-4 py-2 rounded-md"
                     >
                        Cancel
                     </button>
                  </div>
               </div>
            </Modal>
         )}

         {/* Payment Success Modal */}
         {paymentSuccess && (
            <PaymentSuccessful
               paymentSuccess={paymentSuccess}
               onClose={onClosePaymentSuccessAlert}
            />
         )}

         {/* Alert Component */}
         {alert && (
            <Alert
               type={alert.type}
               message={alert.message}
               onClose={handleCloseAlert}
            />
         )}
      </div>
   );
};

export default OrderItem;
