"use client";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { OrderInterface, CartItemInterface } from "../../types";
import useCart from "@/app/hooks/useCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import CartItem from "../cart/CartItem";
import { priceFormat } from "@/app/utils/priceFormat";
import useOrderActions from "@/app/hooks/useOrderActions";
import Alert from "../ui/Alert";
import MenuGrid from "../menu/MenuGrid";
import AddOrderItemModal from "./AddOrderItemModal";

interface EditOrderModalProps {
   isOpen: boolean;
   onClose: () => void;
   selectedOrder: OrderInterface;
   mutate: () => void;
   isSubmitting: boolean;
}

const EditOrderModal = ({
   isOpen,
   onClose,
   selectedOrder,
   mutate,
}: EditOrderModalProps) => {
   const {
      cart,
      setCart,
      handleNotesChange,
      handleRemove,
      handleQuantityChange,
      stockMessage,
      handleAddToCart,
   } = useCart();

   const { handleUpdateOrder, isSubmitting, alert, handleCloseAlert } =
      useOrderActions({
         cart,
         setCart,
         mutate,
      });

   // Load order into cart on modal open
   useEffect(() => {
      if (isOpen && selectedOrder) {
         const mappedItems: CartItemInterface[] =
            selectedOrder.orderDetails.map((item) => ({
               id: item.menu.menuId,
               name: item.menu.menuName,
               price: item.price,
               quantity: item.quantity,
               subtotal: item.price * item.quantity,
               notes: item.notes || "",
               stock: item.menu.stock,
            }));

         const total = mappedItems
            .reduce((acc, item) => acc + item.subtotal, 0)
            .toFixed(2);

         setCart({
            cartItems: mappedItems,
            total,
         });
      }
   }, [isOpen, selectedOrder, setCart]);

   const handleSaveChanges = () => {
      handleUpdateOrder(selectedOrder.orderId, cart.cartItems, cart.total);
      onClose();
   };

   const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

   const openAddItemModal = useCallback(() => {
      setIsAddItemModalOpen(true);
   }, []);

   const closeAddItemModal = useCallback(() => {
      setIsAddItemModalOpen(false);
   }, []);

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <div className="w-full h-full overflow-y-auto flex flex-col border border-gray-200 lg:rounded-lg px-4 bg-white">
            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200 gap-x-2 items-center sticky top-0 bg-white pt-4">
               <h2 className="text-lg font-semibold">
                  <FontAwesomeIcon icon={faCartShopping} />
                  Edit Order #{selectedOrder.orderId}
               </h2>
               <button
                  onClick={openAddItemModal}
                  className={`px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium cursor-pointer`}
               >
                  Add Item
               </button>
            </div>

            {cart.cartItems.length === 0 ? (
               <div className="text-gray-500 text-center px-4 pt-10 pb-14">
                  Your cart is empty.
               </div>
            ) : (
               <div className="flex flex-col gap-4">
                  {cart.cartItems.map((item) => (
                     <CartItem
                        key={item.id}
                        item={item}
                        stockMessage={stockMessage}
                        onQuantityChange={handleQuantityChange}
                        onNotesChange={handleNotesChange}
                        onRemove={handleRemove}
                     />
                  ))}
               </div>
            )}

            {cart.cartItems.length > 0 && (
               <>
                  {/* Summary + Order */}
                  <div className="sticky bottom-0 bg-white pt-2 pb-4 border-t border-gray-200 mt-auto">
                     <div className="flex justify-between mb-3">
                        <span className="text-sm font-medium">Total:</span>
                        <span className="text-sm font-semibold">
                           {priceFormat(parseInt(cart.total))}
                        </span>
                     </div>
                     <button
                        onClick={() => {
                           handleSaveChanges();
                        }}
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium ${
                           isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                        }`}
                     >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                     </button>
                     <button
                        onClick={() => {
                           handleRemove(0);
                        }}
                        className={`w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-200 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer mt-2`}
                     >
                        Cancel Edit
                     </button>
                  </div>
               </>
            )}
         </div>
         <div className="flex flex-col w-full max-h-[80vh] sm:min-w-96">
            <div className="flex-grow overflow-auto">
               <div className="w-full h-full overflow-y-auto flex flex-col border border-gray-200 lg:rounded-lg px-4 bg-white"></div>
            </div>
         </div>

         {/* Add Item Modal */}
         <AddOrderItemModal
            isAddItemModalOpen={isAddItemModalOpen}
            closeAddItemModal={closeAddItemModal}
            onAddToCart={handleAddToCart}
         />
         {alert && (
            <Alert
               type={alert.type}
               message={alert.message}
               onClose={handleCloseAlert}
            />
         )}
      </Modal>
   );
};

export default EditOrderModal;
