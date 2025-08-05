import { priceFormat } from "@/app/utils/priceFormat";
import {
   faCartShopping,
   faMinus,
   faPlus,
   faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image, { ImageLoader } from "next/image";
import React, { useState } from "react";
import { CartPropsInterface } from "../types";
import OrderNotes from "./OrderNotes";
import CartItem from "./CartItem";
import PaymentMethod from "./PaymentMethod";

const Cart: React.FC<CartPropsInterface> = ({
   orderId,
   cart,
   cartItems,
   stockMessage,
   onRemove,
   onQuantityChange,
   onPaymentMethod,
   onOrderNotes,
   onCheckout,
   closeCart,
}) => {
   const total = cartItems.reduce(
      (sum, cartItems) => sum + cartItems.price * cartItems.quantity,
      0
   );
   const paymentOptions = ["QRIS", "CASH", "BANK"];

   return (
      <aside className="w-full h-full overflow-y-auto flex flex-col border border-gray-200 rounded-lg px-4 bg-white">
         <div className="flex justify-between  mb-2 pb-2 border-b border-gray-200 gap-x-2 items-center sticky top-0 bg-white pt-4">
            <h2 className="text-lg font-semibold">
               <FontAwesomeIcon icon={faCartShopping} />
               Order #{cartItems.length === 0 ? "" : orderId ? orderId + 1 : 1}
            </h2>
            <button
               onClick={() => {
                  onRemove(0), closeCart();
               }}
               className="h-full flex justify-center items-center p-2 text-xs text-white bg-red-400 rounded-lg border border-gray-200 hover:bg-red-600 cursor-pointer"
            >
               <FontAwesomeIcon icon={faTrashAlt} />
            </button>
         </div>

         {cartItems.length === 0 ? (
            <div className="text-gray-500 text-center px-4 pt-10 pb-14">
               Your cart is empty.
            </div>
         ) : (
            <div className="flex flex-col gap-4">
               {cartItems.map((item) => (
                  <CartItem
                     key={item.id}
                     item={item}
                     stockMessage={stockMessage}
                     onQuantityChange={onQuantityChange}
                     onRemove={onRemove}
                  />
               ))}
            </div>
         )}

         {cartItems.length > 0 && (
            <>
               {/* PaymentMethod */}
               <div className="mt-2 border-t border-gray-200 pt-2 flex flex-col gap-1">
                  <PaymentMethod
                     paymentOptions={paymentOptions}
                     onPaymentMethod={onPaymentMethod}
                     currentPaymentMethod={cart.paymentMethod}
                  />
                  {/* Order notes */}
                  <OrderNotes
                     onOrderNotes={onOrderNotes}
                     currentOrderNotes={cart.notes}
                  />
               </div>

               {/* Summary + Checkout */}
               <div className="sticky bottom-0 bg-white pt-2 pb-4 border-t border-gray-200 mt-auto">
                  <div className="flex justify-between mb-3">
                     <span className="text-sm font-medium">Total:</span>
                     <span className="text-sm font-semibold">
                        {priceFormat(total)}
                     </span>
                  </div>
                  <button
                     onClick={() => {
                        onCheckout();
                        closeCart();
                     }}
                     className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium"
                  >
                     Bayar
                  </button>
               </div>
            </>
         )}
      </aside>
   );
};

export default Cart;
